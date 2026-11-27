# SHIELD DJ Lite Web

**Free, open-source, offline audio player and live remix studio for Chromebooks.**

Version **1.26 EXACT PITCH** · GPL-3.0-only

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
- Pitch and speed linked, 0.25x–2x; fine 0.001x control (Shift + Left/Right or slider), regular 0.025x control, fixed three-decimal display, with a green indicator at exactly 1.000x; Q16/PCM16 resampling 1–20 kHz in 1 kHz steps, plus original mode.
- Seven-band ROCK STUDIO EQ, three-band BASS STUDIO, audio boost, stereo convolution reverb, bitcrusher.
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

## BASS STUDIO (v1.24)

The former single 180 Hz peaking filter (up to +22 dB) is replaced by three native Web Audio bands: low shelf around 85–90 Hz, kick/bass presence around 100–125 Hz, and a corrective cut at 260 Hz. Four presets: PUNCH, DEEP BASS, ROCK DRIVE and DEEP + PUNCH. Saved preset IDs are preserved. Input headroom is managed per preset (-3.5 to -6.5 dB); with bass enabled and no other heavy effects, compression is 3:1 with 10 ms attack and 120 ms release. Other heavy effects retain the prior protection settings. The OFF preset has a flat response; ROCK STUDIO without bass boost retains its previous compressor settings.

Offline native Chromium measurements: 15 frequency-response cases at 44.1/48/96 kHz; 42 six-second music renders (30 new, 12 comparison), using three privately supplied tracks, with and without ROCK STUDIO. At 48 kHz, DEEP + PUNCH gives approximately +7.03 dB at 60 Hz and +4.20 dB at 125 Hz relative to 1 kHz, before compressor action. The strongest old setting produced 2,105 samples above full scale in the six comparison renders; the strongest new setting had zero, as did all 30 new renders. In this benchmark the maximum new bass-only filter gain after preset headroom was below +1.5 dB. The tests used the isolated native filter/dynamics chain, not the complete player or physical Chromebook speakers; combinations with heavy effects can differ. The three songs are not redistributed. No claims of measured device CPU use or subjective listening quality.

## Focus tuning (v1.25)

VOICE ONLY (approx.) now uses a 420 Hz high-pass, 6 kHz low-pass and +3.5 dB presence around 1.8 kHz, with additional gain margin. INSTRUMENT ONLY (approx.) now preserves more low-frequency center energy with a -24 dB high shelf at 500 Hz and a +20 dB recovery shelf at 7 kHz; stereo sides remain intact before output gain. These are native filters, not an AI model.

Calibration used two privately supplied filtered, reverberated reference recordings of the same song. They were not verified clean stems; their shared signal exhibited an approximate 1.65-second offset. Frequency-response selection used the first 60 seconds; validation used three separate eight-second excerpts per reference from later in the song. In Chromium offline tests at 22.05 kHz, the voice preset's reference-energy contrast increased from 0.48 to 5.62 dB, and the instrument preset's contrast from 1.58 to 2.21 dB. The instrument reference itself lost 3.21 dB rather than 5.01 dB in instrument mode; the voice reference was also less attenuated, so this is a preservation tradeoff rather than stronger vocal removal. Neither updated preset exceeded full scale in the validation renders. Median rendering times were 11.85 and 11.40 ms for eight seconds of audio. No real-device or true source-separation accuracy claim is made. No music, stems or trained weights are redistributed.

## Exact pitch (v1.26)

Pitch always shows four digits (three decimal places), e.g. 0.999x, 1.000x, 1.001x. At exactly 1.000x the indicator and reset button turn green. Fine step remains 0.001x and normal step 0.025x. Eight JavaScript checks passed for display, exact rate, indicator state and limits. Physical-device rendering was not tested.

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
