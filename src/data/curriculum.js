export const intervalSemitones = {
  'Minor 2nd': 1, 'Major 2nd': 2, 'Minor 3rd': 3, 'Major 3rd': 4,
  'Perfect 4th': 5, 'Augmented 4th / Diminished 5th': 6, 'Perfect 5th': 7,
  'Minor 6th': 8, 'Major 6th': 9, 'Minor 7th': 10, 'Major 7th': 11, 'Perfect 8ve': 12,
}

export const levelIntervals = {
  1: ['Major 3rd', 'Minor 3rd'],
  2: ['Major 3rd', 'Minor 3rd', 'Perfect 5th'],
  3: ['Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Perfect 5th'],
  4: ['Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Perfect 5th', 'Perfect 8ve'],
  5: ['Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Perfect 5th', 'Major 6th', 'Minor 6th', 'Perfect 8ve'],
  6: ['Major 2nd', 'Minor 2nd', 'Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Perfect 5th', 'Major 6th', 'Minor 6th', 'Perfect 8ve'],
  7: ['Major 2nd', 'Minor 2nd', 'Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Perfect 5th', 'Major 6th', 'Minor 6th', 'Major 7th', 'Minor 7th', 'Perfect 8ve'],
  8: Object.keys(intervalSemitones),
}

export const chordFormulas = {
  'Major triad': [0, 4, 7], 'Minor triad': [0, 3, 7],
  'Dominant 7th': [0, 4, 7, 10], 'Diminished 7th': [0, 3, 6, 9],
  'Augmented triad': [0, 4, 8],
}

export const chordChoices = {
  1: ['Major triad', 'Minor triad'], 2: ['Major triad', 'Minor triad'],
  3: ['Major triad', 'Minor triad'], 4: ['Major triad', 'Minor triad'],
  5: ['Major triad', 'Minor triad', 'Dominant 7th'],
  6: ['Major triad', 'Minor triad', 'Dominant 7th', 'Diminished 7th'],
  7: Object.keys(chordFormulas), 8: Object.keys(chordFormulas),
}

export const activities = {
  intervals: { id: 'intervals', icon: '🌈', title: 'Intervals', blurb: 'Identify the interval you hear.', color: 'violet' },
  chords: { id: 'chords', icon: '🎹', title: 'Chords', blurb: 'Identify chord quality and chord tones.', color: 'yellow' },
  clapback: { id: 'clapback', icon: '👏', title: 'Clapback', blurb: 'Clap or tap back the rhythm.', color: 'coral' },
  playback: { id: 'playback', icon: '🎵', title: 'Playback', blurb: 'Play back the melody after hearing it.', color: 'sky' },
  progressions: { id: 'progressions', icon: '🏡', title: 'Chord Progressions', blurb: 'Identify I–IV–I and I–V–I progressions.', color: 'mint' },
  combined: { id: 'combined', icon: '🎶', title: 'Clapback / Playback', blurb: 'Practice the paired clapback and playback test.', color: 'coral' },
}

// Mirrors curriculum.py plus the availability checks in streamlit_app.py.
export const levelActivities = {
  1: [
    { ...activities.intervals, available: true }, { ...activities.chords, available: true },
    { ...activities.clapback, available: true }, { ...activities.playback, available: true },
  ],
  2: [
    { ...activities.intervals, available: true }, { ...activities.chords, available: true },
    { ...activities.playback, available: true },
  ],
  3: [
    { ...activities.intervals, available: true }, { ...activities.chords, available: true },
    { ...activities.playback, available: true },
  ],
  4: [
    { ...activities.intervals, available: true }, { ...activities.chords, available: true },
    { ...activities.playback, available: true },
  ],
  5: [
    { ...activities.intervals, available: true }, { ...activities.chords, available: true },
    { ...activities.progressions, available: true }, { ...activities.combined, available: true },
  ],
  6: [
    { ...activities.intervals, available: true }, { ...activities.chords, available: true },
    { ...activities.progressions, available: true },
  ],
  7: [
    { ...activities.intervals, available: true }, { ...activities.chords, available: true },
  ],
  8: [
    { ...activities.intervals, available: true }, { ...activities.chords, available: true },
  ],
}
