# SHIELD DJ Lite Web

**Free, open-source, offline audio player and live remix studio for Chromebooks.**

Version **1.23 PRECISION PITCH** · GPL-3.0-only

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
- Recursive folder import, shuffle without repetition within a cycle, flexible case/accent-insensitive search with partial words, arbitrary word order and limited typo tolerance; newest-first sorting by modification date.
- Pitch and speed linked, 0.25x–2x; fine 0.001x control (Shift + Left/Right or slider), regular 0.025x control, two-decimal display with a smaller third digit only when needed, and precise tooltip; Q16/PCM16 resampling 1–20 kHz in 1 kHz steps, plus original mode.
- Seven-band ROCK STUDIO EQ, bass boost, audio boost, stereo convolution reverb, bitcrusher.
- Adaptive Glitch, Tape Wobble, Ghost Echo, Robot, Reverse Grains, and **Buffer Shatter**: signal-adaptive granular effects with transient-sensitive triggering, variable duration, random reordering and playback speeds, short crossfades and continuous transport. All effects respect the user's independent frequency selection.
- Three-column PC layout with continuous virtual scrolling library (no pagination), current-track jump and fullscreen toggle.
- Playback error recovery: skip unreadable files, stop when none are playable. Import does not start playback automatically.

| Key | Action |
| --- | --- |
| F | Fullscreen on/off |
| Left / Right | Linked pitch and speed (0.025x) |
| Shift + Left / Right | Fine linked pitch and speed (0.001x) |
| Up / Down | Audio rate (1 kHz steps) |
| G / H | Glitch / Buffer Shatter toggle |
| Space | Play / pause |
| U / O | Previous / next |
| S / X / B | Shuffle / repeat / stop |

## Smart search (introduced in v1.16)

Search file names and paths using fragments or words in any order. For example, `side clickbait`, `bait`, `clikbait`, and `CLICKBAIT` all match `Clickbait - C-Side.mp3`. Accents, punctuation and case are normalized. Limited typo tolerance applies to words of five or more characters. Date sorting and shuffle remain independent. Matching is local; no music tags or online metadata are fetched.

## Reverb and pitch (v1.18)

The stereo reverb synthesizes room impulses with predelay, seven groups of early reflections, independent decay bands and a smooth ending. The native browser ConvolverNode performs DSP; changing wet mix reuses the active impulse. Two cached impulses at most, with a 3 MiB cache budget at normal browser sample rates. Reverb is disconnected after its fade when disabled. CONCERT: 0.72 s, CATHEDRAL: 1.55 s, EXTRA: 2.40 s, FREE: 1.78 s; long mode multiplies these durations by 1.4.

In headless Chromium at 48 kHz, the eight variants required 15–28% fewer impulse samples than v1.17. In one offline benchmark rendering six seconds of synthetic stereo audio, median render time across eight variants changed from 63.0 to 45.6 ms. These are container measurements, not Chromebook CPU utilization. Tests also checked fine pitch properties, MP3/OGG playback, cache reuse, transitions, and disconnection when disabled. File navigation was unavailable in the test environment; HTML was injected into Chromium instead. The fallback audio engine was exercised, not real Chromebook hardware output. Listening quality remains subjective.

## Adaptive glitch and continuous library (v1.20)

Frequency selection is independent of every glitch mode, including ORIGINAL and 1–20 kHz. Granular modes react to a fast/slow envelope detector, with randomized fallback timing, variable grain sizes and durations and nonrepeating consecutive pattern choices. This is lightweight onset detection, not a full beat tracker. Silent sections do not trigger new grains. The library displays only visible rows plus six extra rows on each side, preserving search, sort and shuffle independence. The current-track button locates the active song within the filtered list.

Development validation: 63 synthetic stereo DSP scenarios across 44.1/48/96 kHz and three intensity settings, plus 15 sample-rate checks and 3 silence checks; output matched across 128 and 8192 frame chunks. 64 virtual-window bounds cases passed. These were JavaScript logic tests, not physical Chromebook listening tests.

## Library display (v1.22)

Continuous virtual scrolling now uses normal-flow spacers. Row numbers follow the displayed order, titles appear above their modification dates, and alphabetical sorting uses the file name rather than the folder path. Recent-first and oldest-first sorting remain available; unknown dates are placed last. Playback and shuffle are unchanged. Tested sorting in JavaScript and the updated list renderer in a representative Chromium layout with 5,000 synthetic entries, at four viewport sizes and three scroll positions each. The complete player on physical ChromeOS has not been retested.

## Audio focus (v1.21)

VOICE ONLY (approx.) and INSTRUMENT ONLY (approx.) are experimental native Web Audio presets, not AI stem separation. Voice focus emphasizes the stereo center in the 155 Hz–6.9 kHz range. Instrument focus reduces the center's vocal-frequency region, retaining stereo sides and more bass and treble. Centered instruments and off-center vocals can still be affected. Use ORIGINAL quality for the best available source fidelity; reduced sample rates are creative effects. No training data, model weights, or music files are bundled.

Offline Chromium tests of the focus graph on two privately supplied eight-second music excerpts at 48 kHz took 27–31 ms per focus render and had no samples above full scale. These measurements do not measure vocal isolation accuracy or the physical Chromebook's CPU. Synthetic tone tests found approximately -16 dB attenuation for centered 1–2.5 kHz tones in instrument mode, versus roughly -1.5 dB for side tones. No paired official vocal/instrument stems were available for validation; no model was trained. A candidate for future supervised evaluation is the [OnAir Music Dataset](https://github.com/sevagh/OnAir-Music-Dataset), by Hrag, Crescent MTL Project and SevagH, CC BY-SA 4.0. Its audio was not downloaded or used in this version. No redistribution of the privately supplied excerpts.

The diagnostic report includes browser audio context sample rate and reported base/output latency when available. They are browser estimates, not measured acoustic latency.

## Audio notes

AudioWorklet is preferred. If unavailable, the player falls back to a ScriptProcessor buffer of 8192 frames, using the same DSP core. This fallback may have more control latency or occasional dropouts. The browser may mute very slow playback on some platforms. The app uses the system audio output: unplugging headphones can switch sound to speakers. Start with a low volume, especially with distortion, boost and headphones.

ROCK STUDIO (v1.17) is tuned for energetic guitar-driven rock: 85 Hz low shelf (+1.8 dB), 130 Hz punch (+3 dB), 310 Hz cut (-3.2 dB), 1150 Hz (+1.7 dB), 2600 Hz (+3.5 dB), 4800 Hz harshness cut (-2 dB) and 9000 Hz high shelf (+2 dB), with -5 dB input headroom. The seven bands use native Web Audio filters. When no other heavy effects are active, a 2.5:1 compressor with 12 ms attack and 110 ms release helps retain transients. At 48 kHz, the measured combined EQ (before headroom) is +2.71 dB at 130 Hz, +3.69 dB at 2.6 kHz and -0.45 dB at 4.8 kHz. Headroom keeps the peak frequency response below unity across the three tested sample rates. Four five-second local musical excerpts rendered without sample clipping in an offline Chromium test; music is not redistributed. These are measurements, not a guarantee of listening preference or real-device performance. Additional boost/FX can change levels.

## Privacy and tests

No telemetry, uploads, bundled songs, external fonts or runtime dependencies. The player reads user-selected files locally. Settings are saved locally where the browser allows it; the folder must be reopened after restarting. Diagnostic reports are exported by explicit user action. The provided test reports contain synthetic test data only.

- [`node test-dsp.cjs`](test-dsp.cjs): 63 synthetic stereo DSP cases at 44.1/48/96 kHz, comparing 128 and 8192 frame blocks.
- [`python test-browser.py`](test-browser.py) (requires Python, Playwright, Chromium and FFmpeg; set `CHROMIUM_PATH` if needed). Headless Chromium tests during development covered MP3/OGG decoding, corrupt-file recovery, shuffle, date sorting, five viewport sizes, EQ response and fullscreen. For automated tests, the HTML was injected into a headless page. Shield-77 has also tested the player on their own physical Chromebook; no formal real-device performance benchmark is claimed.
- The DSP test script generates `DSP-TESTS.json` locally; these are not real-device audio latency measurements.

## License

Free of charge, open source under **GNU GPL v3 only**. See [LICENSE](LICENSE), [NOTICE.md](NOTICE.md) and [CREDITS.md](CREDITS.md). You may redistribute and modify the code subject to the GPL. No warranty. Music files remain subject to their own rights. No music is included.

## Français

Lecteur et laboratoire de remix entièrement local, conçu en priorité pour les Chromebook ASUS CM14. Je possède moi-même ce Chromebook et j'ai testé le lecteur directement sur mon propre appareil. Le moteur audio a été construit à partir des concepts de mes propres projets Shield DJ Lite et Shield Theme Maker, adaptés aux API audio de Chrome. Le projet est gratuit et libre, avec le code source fourni. ChatGPT a participé au développement du port Web. Aucun abonnement ni service payant n'est nécessaire.

Le filtre ROCK STUDIO utilise sept bandes natives, une marge de 5 dB et une compression plus douce lorsque les effets lourds sont désactivés. Il privilégie les impacts de batterie et la présence des guitares sans amplifier exagérément les aigus.

Ouvre `index.html`, importe un dossier MP3/OGG et lance la lecture. F = plein écran, H = Buffer Shatter, G = Glitch, flèches = fréquence/pitch. Maj + gauche/droite = pas fin de 0,001× (valeur exacte dans l’infobulle). Aucun morceau n'est fourni. Les tests ne garantissent pas l'absence de microcoupures sur toutes les machines.
