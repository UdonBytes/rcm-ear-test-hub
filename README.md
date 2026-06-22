# RCM Ear Test Hub — Netlify app

Static React + Vite edition of the RCM ear-training prototype. The original
Streamlit and Flask apps remain in the repository root.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The deployable site is written to `dist/`. In Netlify, set the base directory
to `netlify-app`; `netlify.toml` supplies the build command, publish folder,
and single-page-app redirect.

Interval, chord, and chord-progression playback uses compact WAV versions of
the repository piano samples. Clapback and playback use only records exported
from `rcm_ear_training/clapback.py` that have an exact matching WAV in
`static/audio/clapback`. The build copies those approved files verbatim; it
does not synthesize or invent melody exercises.

`src/data/approvedExercises.js` is the source of truth for exercises that must
use Jane-approved WAVs: clapback, playback, and chord progressions. Intervals
and chords are generated from `src/data/rcmIntervalRules.js` and
`src/data/rcmChordRules.js` using the existing piano samples.

Question audio is played directly from the approved WAV path through one
central controller. Replaying does not change the current record, and starting
or leaving any exercise stops the previous clip before another can play.

To refresh the approved-example mapping after Jane approves source changes:

```bash
python scripts/prepare_approved_examples.py
```
