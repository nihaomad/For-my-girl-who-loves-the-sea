# Open When Letters

A small static website: a peony splash, a question gate, a sea scene, a sealed letter, and a wall of "open when" envelopes.

## Files

| File | What it is |
|---|---|
| `index.html` | The page structure (all four scenes) |
| `styles.css` | All the styling and animations |
| `config.js` | **Edit this one.** Gate answer, hint, intro text, letters, video and song |
| `script.js` | The behavior (splash, gate, sea, letter, envelopes) |
| `assets/` | Put your sea video and song here |

No build step, no install. It is plain HTML/CSS/JS.

## Run it

Double-click `index.html` to open it in a browser. That's it.

For the video/song to load reliably, it's better to run a tiny local server from this folder:

```bash
npx serve .
```

or, if you have Python:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Add your sea video and song

1. Put the files in `assets/`, e.g. `assets/sea.mp4` and `assets/song.mp3`.
2. In `config.js` set:
   ```js
   const SEA_VIDEO = "assets/sea.mp4";
   const SEA_SONG  = "assets/song.mp3";
   ```

To start the song at a specific part, set `SEA_SONG_START` (e.g. `"1:05"`). To repeat only that part, also set `SEA_SONG_END`.

Use `.mp4` (H.264) for the video; `.MOV` from an iPhone often won't play in Chrome/Android. Keep it short and under ~20 MB so it loads fast on mobile data.

## Put it online (free)

- **Netlify Drop**: go to https://app.netlify.com/drop and drag this whole folder in. You get a link.
- **GitHub Pages**: push the folder to a repo, then Settings → Pages → deploy from the `main` branch.

## Notes

- Which envelopes she has opened is remembered in her browser (localStorage), per device.
- The gate answer is in `config.js`, so anyone who views the page source can see it. It's a sweet gate, not real security.
