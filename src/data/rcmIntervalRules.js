export const intervalSemitones = {
  'Minor 2nd': 1,
  'Major 2nd': 2,
  'Minor 3rd': 3,
  'Major 3rd': 4,
  'Perfect 4th': 5,
  'Augmented 4th / Diminished 5th': 6,
  'Perfect 5th': 7,
  'Minor 6th': 8,
  'Major 6th': 9,
  'Minor 7th': 10,
  'Major 7th': 11,
  'Perfect 8ve': 12,
}

export const rcmIntervalRules = {
  1: { intervals: ['Major 3rd', 'Minor 3rd'], playback: 'connectedAscendingDescending', directions: ['ascending'] },
  2: { intervals: ['Major 3rd', 'Minor 3rd', 'Perfect 5th'], playback: 'connectedAscendingDescending', directions: ['ascending'] },
  3: { intervals: ['Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Perfect 5th'], playback: 'connectedAscendingDescending', directions: ['ascending'] },
  4: { intervals: ['Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Perfect 5th', 'Perfect 8ve'], playback: 'connectedAscendingDescending', directions: ['ascending'] },
  5: { intervals: ['Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Perfect 5th', 'Major 6th', 'Minor 6th', 'Perfect 8ve'], playback: 'melodicThenHarmonic', directions: ['ascending', 'descending'] },
  6: { intervals: ['Major 2nd', 'Minor 2nd', 'Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Perfect 5th', 'Major 6th', 'Minor 6th', 'Perfect 8ve'], playback: 'melodicThenHarmonic', directions: ['ascending', 'descending'] },
  7: { intervals: ['Major 2nd', 'Minor 2nd', 'Major 3rd', 'Minor 3rd', 'Perfect 4th', 'Perfect 5th', 'Major 6th', 'Minor 6th', 'Major 7th', 'Minor 7th', 'Perfect 8ve'], playback: 'melodicThenHarmonic', directions: ['ascending', 'descending'] },
  8: { intervals: Object.keys(intervalSemitones), playback: 'melodicThenHarmonic', directions: ['ascending', 'descending'] },
}
