# SHIELD DJ Lite Web

**Free, open-source, offline audio player and live remix studio for ChromeOS.**

![Version](https://img.shields.io/badge/version-1.33-76d7f5)
![License](https://img.shields.io/badge/license-GPL--3.0--only-blue)
![Runtime](https://img.shields.io/badge/runtime-local%20HTML-92dca4)

**v1.33 ENGINE REFINEMENT** · Classic interface · Single HTML file · No installation

[Download ZIP](https://github.com/Shield-77/Shield-DJ-Lite-Web/archive/refs/heads/main.zip) · [Download HTML](https://github.com/Shield-77/Shield-DJ-Lite-Web/blob/main/index.html) · [Source history](https://github.com/Shield-77/Shield-DJ-Lite-Web/commits/main/) · [Issues](https://github.com/Shield-77/Shield-DJ-Lite-Web/issues)

## About

SHIELD DJ Lite Web is a free personal project by Shield-77, made to share local music playback and creative audio effects with other users. It adapts the concepts of the original 3DS projects to native browser audio APIs, rather than emulating a console or porting its binary. Designed primarily for the **ASUS Chromebook CM14 (CM1406 series / CM1406CM4A, MediaTek Kompanio 540, 8 GB RAM, Mali-G57)**, it also targets recent Chromium-based desktop browsers.

Shield-77 chooses the features, creative direction and interface, and tests the player on their own physical Chromebook. ChatGPT assists with Web code, debugging, documentation and automated tests; Codex assisted development of the original 3DS projects. No AI service is required to run the player.

## Download and start

1. Download the [repository ZIP](https://github.com/Shield-77/Shield-DJ-Lite-Web/archive/refs/heads/main.zip) and extract it, or open the [HTML file page](https://github.com/Shield-77/Shield-DJ-Lite-Web/blob/main/index.html) and choose **Download raw file**.
2. Open `index.html` in Chrome. Check the version in the header to avoid using an older downloaded copy.
3. Choose a folder with **OUVRIR DOSSIER** or select individual files with **FICHIERS**. Press **LECTURE** after checking the system audio output.

No installer, account, subscription, server, developer mode or administrator access is required. Playback works offline. The HTML includes its full GPLv3 license. No music is supplied.

[![Repository QR code](qr.svg)](https://github.com/Shield-77/Shield-DJ-Lite-Web)

## Audio studio

| Feature | Details |
| --- | --- |
| Pitch and speed | Linked, 0.250x–2.000x, exact 0.001x grid; buttons and arrows advance one step. The display reads the actual browser playback rate. |
| Quality | ORIGINAL bypass or 1–20 kHz in 1 kHz steps, Q16/PCM16 resampling adapted from Shield Theme Maker. Independent of pitch and glitch. |
| EQ | ROCK STUDIO, POP STUDIO, POP ROCK STUDIO, Jazz, Clair, Extérieur, Classique; seven native filter nodes reused. |
| BASS STUDIO | PUNCH, DEEP BASS, ROCK DRIVE, DEEP + PUNCH; separate low, impact and corrective bands. |
| Reverb | Stereo synthesized convolution, CONCERT, CONCERT LIVE, CATHEDRALE, EXTRA and LIBRE. Optional LONG mode. |
| Glitch Lab | Adaptive Glitch, Tape Wobble, Ghost Echo, Robot, Reverse Grains, Buffer Shatter; adjustable intensity. |
| Digital Crush | Bit reduction and sample-hold through AudioWorklet; bit reduction alone in the WaveShaper fallback. |
| Audio focus | Experimental VOICE ONLY and INSTRUMENT ONLY, based on stereo and frequency filtering, not AI source separation. |

CONCERT LIVE is inspired by measurements of a privately supplied concert recording. It is a synthetic room response, not a measured reconstruction of the venue. No recording is included. Smooth parameter transitions and output dynamics protection are retained; they are not a guarantee against clipping in every combination of effects.

## Library and controls

- Local MP3 and OGG Vorbis playback; WAV, FLAC and other supported formats depend on the browser.
- Recursive folder import, drag-and-drop, continuous virtual list, current-track locator and fullscreen.
- Accent- and case-insensitive search, partial words, arbitrary word order and limited typo tolerance.
- Modification-date sorting, alphabetical sorting and shuffle without repeats within a cycle; search and sorting do not change playback order.
- Unreadable files are skipped; playback stops when no usable files remain. No automatic playback on folder import.

| Key | Action |
| --- | --- |
| Space | Play / pause |
| U / O | Previous / next |
| Left / Right | Pitch -/+ 0.001x (Shift uses the same step) |
| Up / Down | Audio quality |
| G / H | Adaptive Glitch / Buffer Shatter toggle |
| S / X / B | Shuffle / repeat / stop |
| F | Fullscreen |

The pitch reset restores exactly 1.000x. Holding a pitch arrow repeats after 350 ms, every 110 ms. The slider intentionally allows larger jumps. The desktop uses the original compact three-panel layout with independent library scrolling.

## v1.33: engine refinement

- Cache up to three sorted library index arrays; invalidate on folder import. Search no longer sorts the matching tracks again.
- Reflect only the changed control instead of rebuilding all UI state on each slider event.
- Hoist invariant remix calculations outside the sample loop; avoid repeated reset calls on empty worklet input.
- Flush pending settings on page hide and avoid rebuilding the fallback crush curve unnecessarily.
- Keep the v1.32 CSS exactly; preserve the EQ curves, bass profiles, reverb impulse algorithms and exact pitch grid.

**Validation for v1.33:** 63 synthetic comparisons with v1.32 at 44.1/48/96 kHz, with 23,700,600 identical stereo-channel samples across different block sizes; 15 search/sort cases over 5,000 synthetic tracks; 63 DSP regression scenarios and 15 standalone resampling tests executed in a JavaScript environment. No physical Chromebook CPU measurement or listening test was performed for this version. The browser test script was updated for the current pitch and independent glitch/quality behavior, but has not been rerun for v1.33.

See [development history and prior test notes](DEVELOPMENT.md) for previous versions. Historical test results are not a current guarantee.

## Runtime, privacy and limitations

AudioWorklet is preferred. The fallback uses a ScriptProcessor buffer of 8192 frames for resampling/remix and WaveShaper for bit reduction; fallback timing may differ. The app uses the system audio output, and headphone disconnection can switch sound to speakers. Start at a moderate volume, especially when using boost or headphones.

No telemetry, upload, external fonts, bundled music, model weights or network requests in the standalone player. Files remain local; settings are stored in the browser when allowed. Reopen the folder after closing the browser. Diagnostic reports are exported manually. The README badges are hosted by Shields.io and are not dependencies of the HTML player.

## Development and testing

- [index.html](index.html): complete playable source, styles and DSP.
- [test-dsp.cjs](test-dsp.cjs): run with `node test-dsp.cjs`; synthetic stereo tests and separate resampling checks.
- [test-browser.py](test-browser.py): run with `python test-browser.py`; requires Python, Playwright, Chromium and FFmpeg. Set `CHROMIUM_PATH` if needed.
- [DEVELOPMENT.md](DEVELOPMENT.md): historical engineering notes and limitations.

## Credits and license

**Shield-77**: original project, feature design, creative direction and device tests.  
**ChatGPT (OpenAI)**: AI-assisted Web implementation, documentation and automated testing.  
**Codex (OpenAI)**: AI-assisted development of the original 3DS projects.

| Related project | Role |
| --- | --- |
| [Shield DJ Lite](https://github.com/Shield-77/Shield-DJ-Lite) | Original 3DS player; audio concepts and interface inspiration. [License](https://github.com/Shield-77/Shield-DJ-Lite/blob/main/LICENSE) · [Notice](https://github.com/Shield-77/Shield-DJ-Lite/blob/main/NOTICE.md) |
| [Shield Theme Maker](https://github.com/Shield-77/Shield-Theme-Maker) | Source of the adapted PCM16 Q16 interpolation approach. [Audio conversion source](https://github.com/Shield-77/Shield-Theme-Maker/blob/main/source/audio_convert.c) · [License](https://github.com/Shield-77/Shield-Theme-Maker/blob/main/LICENSE) |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Native audio processing supplied by the browser. |
| [Shield-77 on GitHub](https://github.com/Shield-77) | Original SHIELD ecosystem. |

The Web player's own source is licensed under **GNU GPL version 3 only (GPL-3.0-only)**. See [LICENSE](LICENSE), [NOTICE](NOTICE.md) and [full credits and third-party scope](CREDITS.md). Both original SHIELD project license files have the same GPLv3 text as this repository. Original 3DS libraries and artwork retain their own attribution and licensing; they are not bundled in the Web player. No music, proprietary art, AI runtime or browser codecs are redistributed. Modification and redistribution are permitted under GPL terms; no warranty.

## Français

**Lecteur audio et studio de remix gratuit, libre et entièrement local**, conçu en priorité pour les Chromebook ASUS CM14. L'interface classique est conservée. Le moteur s'inspire de Shield DJ Lite et de Shield Theme Maker, avec une adaptation aux API natives de Chrome.

[Télécharger le ZIP](https://github.com/Shield-77/Shield-DJ-Lite-Web/archive/refs/heads/main.zip), extraire `index.html`, l'ouvrir dans Chrome et importer ses fichiers. Pas d'installation ni de connexion requise pour écouter. Les boutons −/+ et les flèches avancent toujours de 0,001×. Les effets audio, les profils de basses et la réverbération restent disponibles.

Je possède moi-même le Chromebook cible et j'ai testé le lecteur sur cet appareil (versions précédentes). Je choisis les fonctionnalités et réalise les essais ; ChatGPT m'aide à développer le port Web, tandis que Codex a participé aux projets 3DS d'origine. Le projet est conçu pour partager, pas pour imposer un abonnement.

[Crédits complets](CREDITS.md) · [Licence GPLv3](LICENSE) · [Signaler un problème](https://github.com/Shield-77/Shield-DJ-Lite-Web/issues)
