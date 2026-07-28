#!/usr/bin/env python3
"""
Transcript skill — přepis videa do češtiny.
Použití: python transcript.py "<URL>"
"""

import sys
import os
import subprocess
import tempfile
import re
import glob

def get_openai_client():
    try:
        from openai import OpenAI
    except ImportError:
        print("Chyba: nainstaluj openai: pip install openai", file=sys.stderr)
        sys.exit(1)
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Chyba: nastav OPENAI_API_KEY environment variable.", file=sys.stderr)
        sys.exit(1)
    return OpenAI(api_key=api_key)


def check_ytdlp():
    try:
        subprocess.run(["yt-dlp", "--version"], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Chyba: nainstaluj yt-dlp: pip install yt-dlp", file=sys.stderr)
        sys.exit(1)


def parse_vtt(content: str) -> str:
    """Parsuje WebVTT soubor a vrátí čistý text bez duplikátů."""
    lines = content.split("\n")
    texts = []
    seen = set()
    for line in lines:
        line = line.strip()
        # Přeskočit hlavičky, časy a prázdné řádky
        if not line or line == "WEBVTT" or "-->" in line or line.startswith("NOTE"):
            continue
        # Přeskočit timestamp tagy a HTML tagy
        line = re.sub(r"<[^>]+>", "", line)
        line = re.sub(r"&amp;", "&", line)
        line = re.sub(r"&lt;", "<", line)
        line = re.sub(r"&gt;", ">", line)
        line = line.strip()
        if line and line not in seen:
            seen.add(line)
            texts.append(line)
    return " ".join(texts)


def parse_srt(content: str) -> str:
    """Parsuje SRT soubor a vrátí čistý text."""
    # Odstraní čísla bloků, časová razítka a HTML tagy
    content = re.sub(r"\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n", "", content)
    content = re.sub(r"<[^>]+>", "", content)
    lines = [l.strip() for l in content.split("\n") if l.strip()]
    # Odstranit duplikáty
    seen = set()
    unique = []
    for l in lines:
        if l not in seen:
            seen.add(l)
            unique.append(l)
    return " ".join(unique)


def try_get_subtitles(url: str, tmpdir: str) -> tuple[str, str]:
    """
    Pokusí se stáhnout titulky přes yt-dlp.
    Vrátí (text, název_videa) nebo (None, None) pokud titulky nejsou.
    """
    output_template = os.path.join(tmpdir, "video")

    # Zkusit nejprve české titulky, pak anglické, pak auto-generované
    for sub_langs in ["cs", "en", "cs,en"]:
        for auto in [False, True]:
            cmd = [
                "yt-dlp",
                "--write-sub" if not auto else "--write-auto-sub",
                "--sub-langs", sub_langs,
                "--skip-download",
                "--no-warnings",
                "-o", output_template,
                url
            ]
            subprocess.run(cmd, capture_output=True, text=True)

            # Najít stažený subtitle soubor
            vtt_files = glob.glob(os.path.join(tmpdir, "*.vtt"))
            srt_files = glob.glob(os.path.join(tmpdir, "*.srt"))

            if vtt_files or srt_files:
                sub_file = (vtt_files + srt_files)[0]
                with open(sub_file, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                if sub_file.endswith(".vtt"):
                    text = parse_vtt(content)
                else:
                    text = parse_srt(content)

                if len(text.strip()) > 50:  # Aspoň smysluplný obsah
                    # Zjistit název videa
                    title_result = subprocess.run(
                        ["yt-dlp", "--get-title", "--no-warnings", url],
                        capture_output=True, text=True
                    )
                    title = title_result.stdout.strip() or url
                    return text, title

    return None, None


def transcribe_audio(url: str, tmpdir: str, client) -> tuple[str, str]:
    """Stáhne audio a přepíše přes OpenAI Whisper API."""
    audio_path = os.path.join(tmpdir, "audio.mp3")

    print("Stahuji audio...", file=sys.stderr)
    result = subprocess.run([
        "yt-dlp",
        "-x",
        "--audio-format", "mp3",
        "--audio-quality", "3",
        "--no-warnings",
        "-o", audio_path,
        url
    ], capture_output=True, text=True)

    # yt-dlp může přidat příponu
    mp3_files = glob.glob(os.path.join(tmpdir, "*.mp3"))
    if not mp3_files:
        mp3_files = glob.glob(os.path.join(tmpdir, "audio*"))

    if not mp3_files:
        print(f"Chyba při stahování audia: {result.stderr}", file=sys.stderr)
        sys.exit(1)

    audio_file = mp3_files[0]
    file_size = os.path.getsize(audio_file)

    print(f"Přepisuji audio ({file_size // 1024 // 1024} MB) přes Whisper...", file=sys.stderr)

    with open(audio_file, "rb") as f:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=f,
            response_format="text"
        )

    # Název videa
    title_result = subprocess.run(
        ["yt-dlp", "--get-title", "--no-warnings", url],
        capture_output=True, text=True
    )
    title = title_result.stdout.strip() or url

    return str(transcript), title


def detect_language(text: str, client) -> str:
    """Zjistí jazyk textu."""
    sample = text[:500]
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": f"What language is this text in? Reply with only the language name in English (e.g. 'English', 'Czech', 'Slovak'):\n\n{sample}"}
        ],
        max_tokens=10
    )
    return response.choices[0].message.content.strip()


def translate_and_clean(text: str, client, source_lang: str = None) -> str:
    """Přeloží a vyčistí text do češtiny."""

    if source_lang and source_lang.lower() in ["czech", "čeština"]:
        # Jen vyčistit, nepřekládat
        prompt = f"""Vyčisti následující přepis videa. Oprav gramatiku, přidej správnou interpunkci, rozděl do odstavců. Zachovej veškerý obsah. Vrať pouze vyčištěný text bez komentářů.

{text}"""
    else:
        prompt = f"""Přelož a vyčisti následující přepis videa do češtiny. Pokud je to přepis mluvené řeči, oprav gramatiku, přidej interpunkci a rozděl do přirozených odstavců. Zachovej veškerý obsah. Vrať pouze přeložený text bez komentářů.

{text}"""

    # Pokud je text příliš dlouhý, rozdělit na části
    max_chunk = 3000
    if len(text) <= max_chunk:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=4000
        )
        return response.choices[0].message.content.strip()
    else:
        # Zpracovat po částech
        chunks = [text[i:i+max_chunk] for i in range(0, len(text), max_chunk)]
        results = []
        for i, chunk in enumerate(chunks):
            print(f"Překládám část {i+1}/{len(chunks)}...", file=sys.stderr)
            if source_lang and source_lang.lower() in ["czech", "čeština"]:
                chunk_prompt = f"Vyčisti tuto část přepisu. Oprav gramatiku, přidej interpunkci. Vrať jen text:\n\n{chunk}"
            else:
                chunk_prompt = f"Přelož tuto část přepisu do češtiny. Vrať jen přeložený text:\n\n{chunk}"
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": chunk_prompt}],
                max_tokens=4000
            )
            results.append(response.choices[0].message.content.strip())
        return "\n\n".join(results)


def main():
    if len(sys.argv) < 2:
        print("Použití: python transcript.py <URL>")
        sys.exit(1)

    url = sys.argv[1]
    check_ytdlp()
    client = get_openai_client()

    with tempfile.TemporaryDirectory() as tmpdir:
        print("Hledám titulky...", file=sys.stderr)
        raw_text, title = try_get_subtitles(url, tmpdir)

        if raw_text:
            print("Titulky nalezeny.", file=sys.stderr)
        else:
            print("Titulky nenalezeny, stahuji audio...", file=sys.stderr)
            raw_text, title = transcribe_audio(url, tmpdir, client)

        print("Zjišťuji jazyk...", file=sys.stderr)
        lang = detect_language(raw_text, client)
        print(f"Jazyk: {lang}", file=sys.stderr)

        print("Překládám do češtiny...", file=sys.stderr)
        czech_text = translate_and_clean(raw_text, client, lang)

    # Výstup — čistý formát pro zobrazení v chatu
    print(f"\n---\n**Transcript: {title}**\n")
    print(czech_text)
    print("\n---")

    # Upozornění na délku
    word_count = len(czech_text.split())
    if word_count > 1000:
        print(f"\n_(Transcript obsahuje ~{word_count} slov. Mohu připravit shrnutí klíčových bodů.)_")


if __name__ == "__main__":
    main()
