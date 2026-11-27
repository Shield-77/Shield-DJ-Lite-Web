# Credits and licensing

- **Shield-77**: original SHIELD projects, feature design, creative direction and user testing. Copyright (C) 2026 Shield-77 where applicable.
- [Shield DJ Lite](https://github.com/Shield-77/Shield-DJ-Lite): original 3DS project and inspiration for the audio effects, controls and minimalist interface. Original project code is GPL-3.0-only; see its [LICENSE](https://github.com/Shield-77/Shield-DJ-Lite/blob/main/LICENSE) and [NOTICE](https://github.com/Shield-77/Shield-DJ-Lite/blob/main/NOTICE.md).
- [Shield Theme Maker](https://github.com/Shield-77/Shield-Theme-Maker): PCM16 Q16 linear-interpolation resampling approach adapted to streaming Web Audio from [source/audio_convert.c](https://github.com/Shield-77/Shield-Theme-Maker/blob/main/source/audio_convert.c). Original project is GPLv3. The web implementation was modified and extended on 2026-11-27. See the upstream [license](https://github.com/Shield-77/Shield-Theme-Maker/blob/main/LICENSE).
- **OpenAI ChatGPT**: AI-assisted development of the web implementation, documentation and tests. The original SHIELD projects were developed with assistance from Codex. No OpenAI runtime service, model, key or SDK is included.
- Chrome / Chromium / Web Audio / HTML media: browser-provided platform APIs; the app does not bundle the browser or its codecs. Browser components retain their own licenses. System monospace fonts are referenced, not redistributed.
- QR image: static SVG for the repository URL. No QR generation library is shipped or required at runtime.
- Development and tests used Node.js and Python/Playwright/FFmpeg; those tools are not bundled in the player and retain their own licenses.

## Web implementation (v1.34)

Native browser APIs: [Web Audio](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet), [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) and [File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API). These are platform facilities, not bundled dependencies. The reverb impulses are synthesized by the app. AUTO STUDIO uses native spectral analysis and a bounded heuristic controller; no neural model is trained or bundled. No concert recordings, training data, pretrained models or game assets are shipped. Music used in private testing is not part of the distribution.

The original 3DS projects retain their own attribution files. The illustration credited to **kamrikeen** in the Shield DJ Lite README is not included in this Web player. No permission to redistribute that artwork is asserted.

## Visual Studio (v1.38)

- SHIELD DJ Lite fallback logo: provided by Shield-77 for this project. The supplied 256 × 128 artwork is embedded as a compressed WebP copy, used as the default local display. Original visual identity and rights remain with their respective holders; no additional third-party artwork is included.
- Local cover artwork is user-supplied media or extracted from the user's audio metadata. The player does not download, publish or redistribute users' covers.
- Metadata parser, Canvas display, vinyl animation and bass-reactive movement: project-specific AI-assisted implementation using browser APIs. No external metadata or visualization library bundled.

## Scope

The app's own source is distributed under **GNU GPL version 3 only** (SPDX: GPL-3.0-only). No warranty. See the complete [LICENSE](LICENSE). No minimp3, Tremor, libogg, libctru, Kame Tools code, 3DS binaries, proprietary fonts or music from the original projects are bundled in this web package. The supplied SHIELD fallback logo is the artwork exception noted above. Their separate licenses and attributions remain in their upstream projects; this package does not relicense those components.

For the upstream third-party notices, consult the original [Shield DJ Lite credits](https://github.com/Shield-77/Shield-DJ-Lite#licence-et-cr%C3%A9dits) and [Shield Theme Maker README](https://github.com/Shield-77/Shield-Theme-Maker/blob/main/README.md). Thanks to those authors and contributors. The software does not grant rights to any songs imported by users or trademarks of third parties. No official affiliation with browser or hardware vendors is claimed.

The SHIELD name identifies the original project; modified versions should identify their changes and not imply official endorsement. This is not an additional restriction on the rights granted by the GPL.

## Acknowledgements for the original 3DS projects

The following contributors are credited in the upstream projects. These are acknowledgements of their contributions to the original ecosystem, not a claim that their code is included in this Web player:

| Project / contributor | Upstream license or role |
| --- | --- |
| [minimp3](https://github.com/lieff/minimp3), lieff and contributors | CC0 1.0; MP3 decoding |
| [Tremor](https://gitlab.xiph.org/xiph/tremor) and [libogg](https://gitlab.xiph.org/xiph/ogg), Xiph.Org Foundation and contributors | BSD-style licenses; Ogg/Vorbis support |
| [stb](https://github.com/nothings/stb), Sean Barrett and contributors | MIT or public-domain terms; image processing |
| [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/), Braille Institute of America | SIL Open Font License 1.1 |
| [devkitPro](https://github.com/devkitPro), including devkitARM and libctru contributors | 3DS development tools and libraries, under their respective licenses |
| [Kame Tools](https://gitlab.com/beelzy/kame-tools), beelzy and contributors | Reference and tool for theme structure; no direct code reuse claimed |
| [Anemone3DS](https://github.com/astronautlevel2/Anemone3DS), developers and contributors | Theme installation ecosystem; not integrated here |

See the original repositories for their complete license texts. Thank you to everyone who makes these free projects possible.
