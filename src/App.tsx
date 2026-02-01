import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { categories, totalCategories } from './data/nominees'
import './App.css'

type Predictions = Record<string, string>
type Winners = Record<string, string>

function App() {
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [predictions, setPredictions] = useState<Predictions>({})
  const [winners, setWinners] = useState<Winners>({})
  const [locked, setLocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [revealed, setRevealed] = useState(false)

  // Load saved state from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('grammy-username')
    const savedLocked = localStorage.getItem('grammy-locked')

    if (savedUsername) {
      setUsername(savedUsername)
      setIsLoggedIn(true)
      loadPredictions(savedUsername)
    }

    if (savedLocked === 'true') {
      setLocked(true)
    }

    loadWinners()
  }, [])

  const loadPredictions = async (user: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('predictions')
      .select('*')
      .eq('username', user)

    if (data) {
      const preds: Predictions = {}
      data.forEach((p: { category: string; nominee: string }) => {
        preds[p.category] = p.nominee
      })
      setPredictions(preds)
    }
    setLoading(false)
  }

  const loadWinners = async () => {
    const { data } = await supabase
      .from('winners')
      .select('*')

    if (data) {
      const wins: Winners = {}
      data.forEach((w: { category: string; nominee: string }) => {
        wins[w.category] = w.nominee
      })
      setWinners(wins)

      if (Object.keys(wins).length > 0) {
        setRevealed(true)
      }
    }
  }

  // Calculate score when predictions or winners change
  useEffect(() => {
    let newScore = 0
    Object.keys(winners).forEach(category => {
      if (predictions[category] === winners[category]) {
        newScore++
      }
    })
    setScore(newScore)
  }, [predictions, winners])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      localStorage.setItem('grammy-username', username.trim())
      setIsLoggedIn(true)
      loadPredictions(username.trim())
    }
  }

  const selectNominee = async (categoryId: string, nomineeId: string) => {
    if (locked) return

    const newPredictions = { ...predictions, [categoryId]: nomineeId }
    setPredictions(newPredictions)

    // Save to Supabase
    await supabase
      .from('predictions')
      .upsert({
        username,
        category: categoryId,
        nominee: nomineeId,
      }, {
        onConflict: 'username,category'
      })
  }

  const lockPredictions = async () => {
    const selectedCount = Object.keys(predictions).length
    if (selectedCount < totalCategories) {
      alert(`Please make a prediction for all ${totalCategories} categories before locking! (${selectedCount}/${totalCategories} selected)`)
      return
    }

    setLocked(true)
    localStorage.setItem('grammy-locked', 'true')
  }

  const resetGame = async () => {
    if (!confirm('Are you sure you want to reset all your predictions?')) return

    await supabase
      .from('predictions')
      .delete()
      .eq('username', username)

    setPredictions({})
    setLocked(false)
    localStorage.removeItem('grammy-locked')
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setPredictions({})
    setLocked(false)
    localStorage.removeItem('grammy-username')
    localStorage.removeItem('grammy-locked')
  }

  const selectedCount = Object.keys(predictions).length
  const revealedCount = Object.keys(winners).length

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>🏆 Grammy Predictions 🎵</h1>
          <p className="subtitle">68th Annual Grammy Awards • February 1, 2026</p>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-gold">
              Start Playing
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <header>
        <h1>🏆 Grammy Predictions 🎵</h1>
        <p className="subtitle">68th Annual Grammy Awards • February 1, 2026</p>
      </header>

      <div className="score-board">
        <div className="user-info">
          <span className="username">👤 {username}</span>
          <button className="btn-small" onClick={logout}>Logout</button>
        </div>
        <div className="score-display">
          {revealed ? (
            <>Score: <span className="score">{score}</span> / <span>{revealedCount}</span></>
          ) : (
            <>Selected: <span className="score">{selectedCount}</span> / <span>{totalCategories}</span></>
          )}
        </div>
        <div className="buttons">
          {!locked ? (
            <button className="btn-gold" onClick={lockPredictions} disabled={loading}>
              🔒 Lock Predictions
            </button>
          ) : (
            <span className="locked-badge">🔒 Locked</span>
          )}
          <button className="btn-outline" onClick={resetGame}>Reset</button>
        </div>
      </div>

      <div className={`status-bar ${locked ? 'locked' : ''}`}>
        {locked ? (
          <>
            🔒 Predictions locked! Watch the show and check back as winners are announced.
            <div className="progress-text">
              {revealedCount > 0
                ? `${revealedCount} of ${totalCategories} winners announced • Your score: ${score}/${revealedCount}`
                : 'No winners announced yet'}
            </div>
          </>
        ) : (
          <>
            Pick your predictions for each category below
            <div className="progress-text">{selectedCount} of {totalCategories} categories selected</div>
          </>
        )}
      </div>

      <div className={`categories ${locked ? 'locked' : ''}`}>
        {categories.map((category) => (
          <div key={category.id} className="category">
            <h2>{category.emoji} {category.name}</h2>
            <div className="nominees">
              {category.nominees.map((nominee) => {
                const isSelected = predictions[category.id] === nominee.id
                const isWinner = winners[category.id] === nominee.id
                const isCorrect = isSelected && isWinner
                const isIncorrect = isSelected && winners[category.id] && !isWinner

                return (
                  <div
                    key={nominee.id}
                    className={`nominee ${isSelected ? 'selected' : ''} ${isWinner ? 'winner' : ''} ${isCorrect ? 'correct' : ''} ${isIncorrect ? 'incorrect' : ''}`}
                    onClick={() => selectNominee(category.id, nominee.id)}
                  >
                    <div className="artist">{nominee.artist}</div>
                    {nominee.work && <div className="work">"{nominee.work}"</div>}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <footer>
        🎵 Good luck! Winners announced live on CBS at 8pm ET
      </footer>
    </div>
  )
}

export default App
