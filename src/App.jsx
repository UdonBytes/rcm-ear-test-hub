import { useEffect, useRef, useState } from 'react'
import { levelActivities, levelIntervals } from './data/curriculum'
import { approvedExercises } from './data/approvedExercises'
import { ApprovedPractice, ChordProgressions, Chords, Intervals } from './components/GeneratedActivities'

const activityMap = {
  intervals: Intervals,
  chords: Chords,
  clapback: props => <ApprovedPractice {...props} activity="clapback" />,
  playback: props => <ApprovedPractice {...props} activity="playback" />,
  combined: props => <ApprovedPractice {...props} activity="combined" />,
  progressions: ChordProgressions,
}

function LevelDropdown({ level, setLevel }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const levels = Object.keys(levelIntervals).map(Number)

  useEffect(() => {
    const closeOnOutsideClick = event => {
      if (!menuRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [])

  const chooseLevel = nextLevel => {
    setLevel(nextLevel)
    setOpen(false)
  }

  const handleButtonKeyDown = event => {
    if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
      event.preventDefault()
      setOpen(true)
    }
    if (event.key === 'Escape') setOpen(false)
  }

  return <div className="level-dropdown" ref={menuRef}>
    <button
      type="button"
      className={`level-dropdown-button ${open ? 'open' : ''}`}
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen(value => !value)}
      onKeyDown={handleButtonKeyDown}
    >
      <span>Level {level}</span><svg className="dropdown-arrow" aria-hidden="true" viewBox="0 0 16 16"><path d="M4 6.25 8 10l4-3.75" /></svg>
    </button>
    {open && <div className="level-dropdown-menu" role="listbox" aria-label="Choose level">
      {levels.map(item => <button
        type="button"
        className={item === level ? 'selected' : ''}
        key={item}
        role="option"
        aria-selected={item === level}
        onClick={() => chooseLevel(item)}
        onKeyDown={event => {
          if (event.key === 'Escape') {
            event.preventDefault()
            setOpen(false)
          }
        }}
      >
        Level {item}
      </button>)}
    </div>}
  </div>
}

function Home({ level, setLevel, openActivity }) {
  const activityBuckets = {
    intervals: 'intervals', chords: 'chords', progressions: 'chordProgressions',
    clapback: 'rhythmClapback', playback: 'melodyPlayback',
    combined: 'combinedClapbackPlayback',
  }
  const availableActivities = levelActivities[level].filter(
    activity => ['intervals', 'chords'].includes(activity.id)
      || approvedExercises[level][activityBuckets[activity.id]].length > 0
  )
  return <main>
    <section className="hero">
      <div className="hero-copy"><div className="brand-mark">♫</div><h1>RCM Ear Test Hub</h1></div>
      <div className="mascot" aria-hidden="true"><div className="sparkle one">✦</div><div className="sparkle two">♪</div><div className="piano-face"><span>•ᴗ•</span><i></i><i></i><i></i><i></i><i></i></div></div>
    </section>
    <section className="activities-section"><div className="section-title"><div><p className="eyebrow">Level {level}</p><h2>Ear tests for this level</h2></div><LevelDropdown level={level} setLevel={setLevel} /></div>
      <div className={`activity-grid count-${availableActivities.length}`}>{availableActivities.map(section => <button className={`activity-card ${section.color}`} key={section.id} onClick={() => openActivity(section.id)}><span className="card-icon">{section.icon}</span><span className="card-copy"><strong>{section.title}</strong><small>{section.blurb}</small></span><span className="round-arrow">→</span></button>)}</div>
    </section>
    <aside className="tip"><span>💡</span><div><strong>Tip:</strong><p>Sing your answer. Your voice helps your ears remember!</p></div></aside>
  </main>
}

export default function App() {
  const [level, setLevel] = useState(1)
  const [activity, setActivity] = useState(null)
  const Activity = activity ? activityMap[activity] : null
  return <div className="app-shell">
    <header><button className="logo" onClick={() => setActivity(null)}><span>♫</span><strong>Ear Test Hub</strong></button></header>
    {Activity ? <Activity level={level} onBack={() => setActivity(null)} /> : <Home level={level} setLevel={setLevel} openActivity={setActivity} />}
    <footer><span>Created by Jane Hong (UdonBytes)</span></footer>
  </div>
}
