# SHIELD DJ Lite Web

**Free, open-source, offline audio player and live remix studio for Chromebooks.**

Version **1.15 ROCK & SHATTER** · GPL-3.0-only

Designed primarily for the **ASUS Chromebook CM14 (CM1406 series / CM1406CM4A, MediaTek Kompanio 540, 8 GB RAM, Mali-G57)** and ChromeOS/Chrome. It also targets modern desktop Chromium browsers. Shield-77 personally owns the target ASUS Chromebook and has tested the player on that physical device. Automated development tests were also conducted separately in headless Chromium and Node.js.

The audio engine was built from Shield-77's own projects, [Shield DJ Lite](https://github.com/Shield-77/Shield-DJ-Lite) and [Shield Theme Maker](https://github.com/Shield-77/Shield-Theme-Maker). Their audio concepts and Q16 PCM16 resampling were adapted to the browser. The web implementation uses native browser decoding and Web Audio rather than running 3DS code. ChatGPT assisted with the web code and automated tests; Shield-77 chose the features and creative direction and personally tested the player on their own Chromebook.

[![Repository QR code](qr.svg)](https://github.com/Shield-77/Shield-DJ-Lite-Web)

Created as a free personal project to share with friends who use Chromebooks, especially students. No system modification, developer mode or administrative access is required.

## Download / Téléchargement

**[Download the HTML player / Télécharger le lecteur HTML](https://github.com/Shield-77/Shield-DJ-Lite-Web/blob/main/index.html)** (on the GitHub file page, select **Download raw file**).

Alternative: [download the complete ZIP](https://github.com/Shield-77/Shield-DJ-Lite-Web/archive/refs/heads/main.zip) and extract `index.html`.

## Getting started

1. Download `index.html` using one of the links above. The complete GPLv3 license is also embedded in the HTML.
2. Open `index.html` in Chrome. No install, account, subscription or internet connection is required for playback.
3. Choose a folder or individual MP3/OGG files. Check your system audio output and press LECTURE.

## Features

- Native MP3 and OGG Vorbis playback; additional formats depend on browser support.
- Recursive folder import, shuffle without repetition within a cycle, search and newest-first sorting by modification date.
- Pitch and speed linked, 0.25x–2x; Q16/PCM16 resampling 2–20 kHz in 1 kHz steps, plus original mode.
- Five-band ROCK HD EQ, bass boost, audio boost, stereo convolution reverb, bitcrusher.
- Glitch 6 kHz, Tape Wobble, Ghost Echo, Robot, Reverse Grains, and **Buffer Shatter 6 kHz**: random grain reordering, reverse, half-speed and double-speed fragments, with short crossfades and continuous transport.
- Three-column PC layout with scrollable library; fullscreen toggle.
- Playback error recovery: skip unreadable files, stop when none are playable. Import does not start playback automatically.

| Key | Action |
| --- | --- |
| F | Fullscreen on/off |
| Left / Right | Linked pitch and speed |
| Up / Down | Audio rate (1 kHz steps) |
| G / H | Glitch / Buffer Shatter toggle |
| Space | Play / pause |
| U / O | Previous / next |
| S / X / B | Shuffle / repeat / stop |

## Audio notes

AudioWorklet is preferred. If unavailable, the player falls back to a ScriptProcessor buffer of 8192 frames, using the same DSP core. This fallback may have more control latency or occasional dropouts. The browser may mute very slow playback on some platforms. The app uses the system audio output: unplugging headphones can switch sound to speakers. Start with a low volume, especially with distortion, boost and headphones.

ROCK HD uses a 105 Hz low shelf (+2.5 dB), a 320 Hz cut (-2.5 dB), 1550 Hz (+2.4 dB), 3400 Hz (+2 dB), a 7600 Hz high shelf (+1.5 dB) and -4.5 dB input headroom, with dynamics protection. The result is a relative EQ emphasis, not a guarantee of higher loudness or of perfect separation of instruments.

## Privacy and tests

No telemetry, uploads, bundled songs, external fonts or runtime dependencies. The player reads user-selected files locally. Settings are saved locally where the browser allows it; the folder must be reopened after restarting. Diagnostic reports are exported by explicit user action. The provided test reports contain synthetic test data only.

- [`node test-dsp.cjs`](test-dsp.cjs): 63 synthetic stereo DSP cases at 44.1/48/96 kHz, comparing 128 and 8192 frame blocks.
- [`python test-browser.py`](test-browser.py) (requires Python, Playwright, Chromium and FFmpeg; set `CHROMIUM_PATH` if needed). Headless Chromium tests during development covered MP3/OGG decoding, corrupt-file recovery, shuffle, date sorting, five viewport sizes, EQ response and fullscreen. For automated tests, the HTML was injected into a headless page. Shield-77 has also tested the player on their own physical Chromebook; no formal real-device performance benchmark is claimed.
- The DSP test script generates `DSP-TESTS.json` locally; these are not real-device audio latency measurements.

## License

Free of charge, open source under **GNU GPL v3 only**. See [LICENSE](LICENSE), [NOTICE.md](NOTICE.md) and [CREDITS.md](CREDITS.md). You may redistribute and modify the code subject to the GPL. No warranty. Music files remain subject to their own rights. No music is included.

## Français

Lecteur et laboratoire de remix entièrement local, conçu en priorité pour les Chromebook ASUS CM14. Je possède moi-même ce Chromebook et j'ai testé le lecteur directement sur mon propre appareil. Le moteur audio a été construit à partir des concepts de mes propres projets Shield DJ Lite et Shield Theme Maker, adaptés aux API audio de Chrome. Le projet est gratuit et libre, avec le code source fourni. ChatGPT a participé au développement du port Web. Aucun abonnement ni service payant n'est nécessaire.

Ouvre `index.html`, importe un dossier MP3/OGG et lance la lecture. F = plein écran, H = Buffer Shatter, G = Glitch, flèches = fréquence/pitch. Aucun morceau n'est fourni. Les tests ne garantissent pas l'absence de microcoupures sur toutes les machines.
