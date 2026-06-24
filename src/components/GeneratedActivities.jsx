import { useEffect, useMemo, useState } from 'react'
import QuizShell, { Choices, Feedback, PlayButton } from './QuizShell'
import { approvedExercises } from '../data/approvedExercises'
import { getChordSampleMidis, getIntervalSampleMidis, playApprovedAudio, playChordQuality, playChordTone, playIntervalQuestion, preloadPianoSamples, stopAudio } from '../audio/audioController'
import { generateChordQuestion, generateIntervalQuestion, shuffleQueue } from '../utils/questionGenerators'

function useStopAudioOnUnmount() {
  useEffect(() => () => stopAudio(), [])
}

function useGeneratedQuestion(level, generator) {
  const [question, setQuestion] = useState(() => generator(level))
  useEffect(() => {
    stopAudio()
    setQuestion(generator(level))
  }, [generator, level])
  const next = () => {
    stopAudio()
    setQuestion(current => generator(level, current))
  }
  return { question, next }
}

function useSamplePreload(question, getSampleMidis) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let active = true
    setReady(false)
    stopAudio()
    preloadPianoSamples(getSampleMidis(question))
      .then(() => { if (active) setReady(true) })
      .catch(error => {
        console.error('Could not preload piano samples', error)
        if (active) setReady(false)
      })
    return () => { active = false }
  }, [question, getSampleMidis])
  return ready
}

function useApprovedQueue(level, bucket) {
  const examples = useMemo(() => approvedExercises[level][bucket], [bucket, level])
  const [queue, setQueue] = useState(() => shuffleQueue(examples))
  const [index, setIndex] = useState(0)

  useEffect(() => {
    stopAudio()
    setQueue(shuffleQueue(examples))
    setIndex(0)
  }, [examples])

  const example = queue[index]
  const next = () => {
    stopAudio()
    if (index < queue.length - 1) {
      setIndex(value => value + 1)
      return
    }
    setQueue(shuffleQueue(examples, example?.id))
    setIndex(0)
  }
  return { example, next }
}

export function Intervals({ level, onBack }) {
  useStopAudioOnUnmount()
  const { question, next: nextQuestion } = useGeneratedQuestion(level, generateIntervalQuestion)
  const audioReady = useSamplePreload(question, getIntervalSampleMidis)
  const [selected, setSelected] = useState(null)
  const choose = choice => { stopAudio(); setSelected(choice) }
  const next = () => { nextQuestion(); setSelected(null) }
  return <QuizShell icon="🌈" title="Intervals" subtitle={`Level ${level}`} onBack={onBack}>
    <PlayButton onClick={() => playIntervalQuestion(question)} label={audioReady ? 'Play' : 'Loading…'} disabled={!audioReady} />
    <p className="prompt">What interval did you hear?</p>
    <Choices choices={question.choices} answer={question.answer} selected={selected} onChoose={choose} />
    <Feedback selected={selected} answer={question.answer} onNext={next} nextLabel="Next example" />
  </QuizShell>
}

function SingleStepChord({ question, onNext, audioReady }) {
  const [selected, setSelected] = useState(null)
  useEffect(() => setSelected(null), [question.id])
  const choose = choice => { stopAudio(); setSelected(choice) }
  const next = () => { onNext(); setSelected(null) }
  return <>
    <PlayButton onClick={() => playChordQuality(question)} label={audioReady ? 'Play' : 'Loading…'} disabled={!audioReady} />
    {question.playback === 'brokenThenSolid' && <p className="level-note">Listen for the separate notes, then the solid chord.</p>}
    <p className="prompt">Which chord did you hear?</p>
    <Choices choices={question.choices} answer={question.answer} selected={selected} onChoose={choose} className="chord-choices" />
    <Feedback selected={selected} answer={question.answer} onNext={next} nextLabel="Next example" />
  </>
}

function TwoStepChord({ question, onNext, audioReady }) {
  const [qualitySelected, setQualitySelected] = useState(null)
  const [toneSelected, setToneSelected] = useState(null)
  useEffect(() => {
    setQualitySelected(null)
    setToneSelected(null)
  }, [question.id])
  const chooseQuality = choice => { stopAudio(); setQualitySelected(choice) }
  const chooseTone = choice => { stopAudio(); setToneSelected(choice) }
  const next = () => { onNext(); setQualitySelected(null); setToneSelected(null) }

  return <>
    <section className="chord-first-section">
      <PlayButton onClick={() => playChordQuality(question)} label={audioReady ? 'Play' : 'Loading…'} disabled={!audioReady} />
      <p className="prompt">Which chord did you hear?</p>
      <Choices choices={question.choices} answer={question.answer} selected={qualitySelected} onChoose={chooseQuality} className="chord-choices" />
    </section>
    <Feedback selected={qualitySelected} answer={question.answer} />
    {qualitySelected && <section className="chord-tone-section">
      <p className="tone-kicker">Now listen for one chord tone.</p>
      <PlayButton onClick={() => playChordTone(question)} label={audioReady ? 'Play broken chord' : 'Loading…'} disabled={!audioReady} />
      <p className="prompt">Which chord tone did you hear?</p>
      <Choices choices={question.toneChoices} answer={question.toneAnswer} selected={toneSelected} onChoose={chooseTone} className="chord-tone-choices" />
      <Feedback selected={toneSelected} answer={question.toneAnswer} onNext={next} nextLabel="Next example" />
    </section>}
  </>
}

export function Chords({ level, onBack }) {
  useStopAudioOnUnmount()
  const { question, next } = useGeneratedQuestion(level, generateChordQuestion)
  const audioReady = useSamplePreload(question, getChordSampleMidis)
  return <QuizShell icon="🎹" title="Chords" subtitle={`Level ${level}`} onBack={onBack}>
    {question.identifyTone
      ? <TwoStepChord question={question} onNext={next} audioReady={audioReady} />
      : <SingleStepChord question={question} onNext={next} audioReady={audioReady} />}
  </QuizShell>
}

export function ChordProgressions({ level, onBack }) {
  useStopAudioOnUnmount()
  const { example, next } = useApprovedQueue(level, 'chordProgressions')
  const [selected, setSelected] = useState(null)
  useEffect(() => setSelected(null), [example.id])
  const choose = choice => { stopAudio(); setSelected(choice) }
  const advance = () => { next(); setSelected(null) }
  return <QuizShell icon="🏡" title="Chord Progressions" subtitle={`Level ${level}`} onBack={onBack}>
    <PlayButton onClick={() => playApprovedAudio(example.audio)} label="Play" />
    <p className="prompt">Which progression did you hear?</p>
    <Choices choices={example.choices} answer={example.answer} selected={selected} onChoose={choose} />
    <Feedback selected={selected} answer={example.answer} onNext={advance} nextLabel="Next example" />
  </QuizShell>
}

export function ApprovedPractice({ level, onBack, activity }) {
  useStopAudioOnUnmount()
  const bucket = activity === 'combined'
    ? 'combinedClapbackPlayback'
    : activity === 'clapback' ? 'rhythmClapback' : 'melodyPlayback'
  const { example, next } = useApprovedQueue(level, bucket)
  const title = activity === 'combined' ? 'Clapback / Playback' : activity === 'clapback' ? 'Clapback' : 'Playback'
  const icon = activity === 'clapback' ? '👏' : '🎵'
  return <QuizShell icon={icon} title={title} subtitle={`Level ${level}`} onBack={onBack}>
    <div className="example-meta"><span><small>Key</small><strong>{example.key}</strong></span><span><small>Time signature</small><strong>{example.timeSignature}</strong></span></div>
    {example.clapbackAudio && <PlayButton onClick={() => playApprovedAudio(example.clapbackAudio)} label={example.playbackAudio ? 'Play clapback' : 'Play'} />}
    {example.playbackAudio && <div className={example.clapbackAudio ? 'second-player' : ''}><PlayButton onClick={() => playApprovedAudio(example.playbackAudio)} label={example.clapbackAudio ? 'Play playback' : 'Play'} /></div>}
    <button className="next-link" onClick={next}>Next example</button>
  </QuizShell>
}
