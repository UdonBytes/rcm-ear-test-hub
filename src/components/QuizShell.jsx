export default function QuizShell({ icon, title, subtitle, onBack, children }) {
  const titleClass = title.includes('/') ? 'long-title' : ''
  const activityClass = title === 'Chords' ? 'chord-practice' : ''
  return <main className={`practice-wrap ${activityClass}`.trim()}>
    <button className="back-button" onClick={onBack}>← All activities</button>
    <section className="practice-card">
      <div className="practice-heading"><span className="big-icon">{icon}</span><div><p className="eyebrow">Your listening studio</p><h1 className={titleClass}>{title}</h1><p>{subtitle}</p></div></div>
      {children}
    </section>
  </main>
}

export function PlayButton({ onClick, label = 'Play sound' }) {
  return <button className="play-button" onClick={onClick}><span>▶</span>{label}</button>
}

export function Choices({ choices, answer, selected, onChoose, className = '' }) {
  return <div className={`choices ${className}`.trim()}>{choices.map(choice => {
    const state = selected ? choice === answer ? 'correct' : choice === selected ? 'wrong' : 'dim' : ''
    return <button key={choice} className={state} disabled={Boolean(selected)} onClick={() => onChoose(choice)}>{choice}</button>
  })}</div>
}

export function Feedback({ selected, answer, onNext, nextLabel = 'Next example' }) {
  if (!selected) return null
  const right = selected === answer
  return <div className={`feedback ${right ? 'yay' : 'try'}`} role="status">
    <div><strong>{right ? '✨ You got it!' : 'Almost! Keep listening.'}</strong><span>{right ? ' Lovely ears at work.' : ` The answer was ${answer}.`}</span></div>
    {onNext && <button onClick={onNext}>{nextLabel}</button>}
  </div>
}
