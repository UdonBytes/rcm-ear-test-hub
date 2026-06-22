import { intervalSemitones, rcmIntervalRules } from '../data/rcmIntervalRules'
import { chordDisplayName, chordFormulas, rcmChordRules } from '../data/rcmChordRules'

const SAMPLE_LOW_MIDI = 53 // F3
const SAMPLE_HIGH_MIDI = 81 // A5

const randomItem = items => items[Math.floor(Math.random() * items.length)]

function shuffle(items) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
  }
  return copy
}

function midiToName(midi) {
  const names = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
  return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`
}

export function generateIntervalQuestion(level, previous = null) {
  const rule = rcmIntervalRules[level]
  let question
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const answer = randomItem(rule.intervals)
    const distance = intervalSemitones[answer]
    const startMidi = SAMPLE_LOW_MIDI + Math.floor(Math.random() * (SAMPLE_HIGH_MIDI - SAMPLE_LOW_MIDI - distance + 1))
    const direction = randomItem(rule.directions)
    question = {
      id: `${level}-${answer}-${startMidi}-${direction}-${Date.now()}`,
      level,
      answer,
      choices: shuffle(rule.intervals),
      startMidi,
      endMidi: startMidi + distance,
      startNote: midiToName(startMidi),
      endNote: midiToName(startMidi + distance),
      playback: rule.playback,
      direction,
    }
    if (!previous || previous.answer !== question.answer || previous.startMidi !== question.startMidi) break
  }
  return question
}

function possibleChordRoots(quality) {
  const highestInterval = Math.max(...chordFormulas[quality])
  const roots = []
  for (let midi = SAMPLE_LOW_MIDI; midi <= SAMPLE_HIGH_MIDI - highestInterval; midi += 1) roots.push(midi)
  return roots
}

export function generateChordQuestion(level, previous = null) {
  const rule = rcmChordRules[level]
  let question
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const quality = randomItem(rule.qualities)
    const rootMidi = randomItem(possibleChordRoots(quality))
    const formula = chordFormulas[quality]
    const toneIndex = rule.identifyTone ? Math.floor(Math.random() * 3) : null
    question = {
      id: `${level}-${quality}-${rootMidi}-${toneIndex ?? 'quality'}-${Date.now()}`,
      level,
      quality,
      answer: chordDisplayName(quality, level),
      choices: rule.qualities.map(item => chordDisplayName(item, level)),
      rootMidi,
      rootNote: midiToName(rootMidi),
      notes: formula.map(interval => rootMidi + interval),
      playback: rule.playback,
      identifyTone: rule.identifyTone,
      toneAnswer: toneIndex === null ? null : rule.toneChoices[toneIndex],
      toneChoices: rule.toneChoices || [],
      toneMidi: toneIndex === null ? null : rootMidi + formula[toneIndex],
    }
    const repeatedRoot = previous?.rootMidi === question.rootMidi
    const repeatedQuality = previous?.quality === question.quality
    if (!previous || !(repeatedRoot || repeatedQuality)) break
  }
  return question
}

export function shuffleQueue(items, previousId = null) {
  const shuffled = shuffle(items)
  if (previousId && shuffled.length > 1 && shuffled[0]?.id === previousId) {
    shuffled.push(shuffled.shift())
  }
  return shuffled
}
