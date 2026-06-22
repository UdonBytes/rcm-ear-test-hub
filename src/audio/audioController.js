let activeAudio = null
let audioContext = null
let activeSources = []
const sampleCache = new Map()

export function stopAudio() {
  if (activeAudio) {
    activeAudio.pause()
    activeAudio.currentTime = 0
    activeAudio = null
  }
  for (const source of activeSources) {
    try { source.stop() } catch {}
  }
  activeSources = []
}

export async function playApprovedAudio(path) {
  stopAudio()
  const audio = new Audio(path)
  activeAudio = audio
  audio.addEventListener('ended', () => {
    if (activeAudio === audio) activeAudio = null
  }, { once: true })
  try {
    await audio.play()
  } catch (error) {
    if (activeAudio === audio) activeAudio = null
    throw error
  }
  return audio
}

async function getContext() {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)()
  if (audioContext.state === 'suspended') await audioContext.resume()
  return audioContext
}

function midiToSampleName(midi) {
  const names = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
  return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`
}

async function loadPianoSample(context, midi) {
  const sample = midiToSampleName(midi)
  if (!sampleCache.has(sample)) {
    sampleCache.set(sample, fetch(`/audio/piano/${sample}.wav`)
      .then(response => {
        if (!response.ok) throw new Error(`Missing piano sample ${sample}`)
        return response.arrayBuffer()
      })
      .then(buffer => context.decodeAudioData(buffer)))
  }
  return sampleCache.get(sample)
}

async function scheduleNote(context, midi, startTime, duration, volume = 0.55) {
  const source = context.createBufferSource()
  const gain = context.createGain()
  source.buffer = await loadPianoSample(context, midi)
  gain.gain.value = volume
  source.connect(gain).connect(context.destination)
  source.start(startTime)
  source.stop(startTime + Math.min(duration, source.buffer.duration))
  activeSources.push(source)
  source.addEventListener('ended', () => {
    activeSources = activeSources.filter(item => item !== source)
  })
}

async function playEvents(events) {
  stopAudio()
  const context = await getContext()
  const start = context.currentTime + 0.08
  const notes = [...new Set(events.flatMap(event => event.notes))]
  await Promise.all(notes.map(note => loadPianoSample(context, note)))
  for (const event of events) {
    for (const note of event.notes) {
      scheduleNote(context, note, start + event.at, event.duration, event.volume)
    }
  }
}

export function playIntervalQuestion(question) {
  const first = question.direction === 'descending' ? question.endMidi : question.startMidi
  const second = question.direction === 'descending' ? question.startMidi : question.endMidi
  if (question.playback === 'connectedAscendingDescending') {
    return playEvents([
      { notes: [question.startMidi], at: 0, duration: 0.62, volume: 0.58 },
      { notes: [question.endMidi], at: 0.72, duration: 0.62, volume: 0.58 },
      { notes: [question.startMidi], at: 1.44, duration: 0.72, volume: 0.58 },
    ])
  }
  return playEvents([
    { notes: [first], at: 0, duration: 0.72, volume: 0.58 },
    { notes: [second], at: 0.92, duration: 0.72, volume: 0.58 },
    { notes: [question.startMidi, question.endMidi], at: 1.95, duration: 1.15, volume: 0.42 },
  ])
}

export function playChordQuality(question) {
  if (question.playback === 'brokenThenSolid') {
    return playEvents([
      ...question.notes.map((note, index) => ({ notes: [note], at: index * 0.72, duration: 0.64, volume: 0.56 })),
      { notes: question.notes, at: question.notes.length * 0.72 + 0.35, duration: 1.2, volume: 0.42 },
    ])
  }
  return playEvents([{ notes: question.notes, at: 0, duration: 1.25, volume: 0.44 }])
}

export function playChordTone(question) {
  return playEvents([
    ...question.notes.slice(0, 3).map((note, index) => ({ notes: [note], at: index * 0.62, duration: 0.55, volume: 0.54 })),
    { notes: [question.toneMidi], at: 2.15, duration: 1.0, volume: 0.58 },
  ])
}
