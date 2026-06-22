export const chordFormulas = {
  'Major triad': [0, 4, 7],
  'Minor triad': [0, 3, 7],
  'Dominant 7th': [0, 4, 7, 10],
  'Diminished 7th': [0, 3, 6, 9],
  'Augmented triad': [0, 4, 8],
}

export const rcmChordRules = {
  1: { qualities: ['Major triad', 'Minor triad'], playback: 'brokenThenSolid', identifyTone: false },
  2: { qualities: ['Major triad', 'Minor triad'], playback: 'solid', identifyTone: false },
  3: { qualities: ['Major triad', 'Minor triad'], playback: 'solidThenTone', identifyTone: true, toneChoices: ['Root', 'Third', 'Fifth'] },
  4: { qualities: ['Major triad', 'Minor triad'], playback: 'solidThenTone', identifyTone: true, toneChoices: ['Root', 'Third', 'Fifth'] },
  5: { qualities: ['Major triad', 'Minor triad', 'Dominant 7th'], playback: 'solid', identifyTone: false },
  6: { qualities: ['Major triad', 'Minor triad', 'Dominant 7th', 'Diminished 7th'], playback: 'solid', identifyTone: false },
  7: { qualities: ['Major triad', 'Minor triad', 'Dominant 7th', 'Diminished 7th', 'Augmented triad'], playback: 'solid', identifyTone: false },
  8: { qualities: ['Major triad', 'Minor triad', 'Dominant 7th', 'Diminished 7th', 'Augmented triad'], playback: 'solid', identifyTone: false },
}

export function chordDisplayName(quality, level) {
  if (level >= 5) {
    if (quality === 'Major triad') return 'Major (Triad)'
    if (quality === 'Minor triad') return 'Minor (Triad)'
    if (quality === 'Augmented triad') return 'Augmented (Triad)'
  }
  if (quality === 'Major triad') return 'Major'
  if (quality === 'Minor triad') return 'Minor'
  if (quality === 'Diminished 7th') return 'Diminished 7th'
  if (quality === 'Augmented triad') return 'Augmented (Triad)'
  return quality
}
