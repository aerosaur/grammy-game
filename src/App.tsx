import { useState, useEffect, useCallback } from 'react'
import { supabase, subscribeToWinners, unsubscribeFromChannel } from './lib/supabase'
import type { Winner } from './lib/supabase'
import { categories, totalCategories } from './data/nominees'
import type { Category } from './data/nominees'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import './App.css'

type Predictions = Record<string, string>
type Winners = Record<string, string>
type ViewMode = 'predictions' | 'results'

// Lockout time constant: Feb 1, 2026 at 7:45pm ET = Feb 2, 2026 00:45 UTC
const LOCKOUT_TIME = new Date('2026-02-02T00:45:00Z')

// Helper to find category and nominee details
function getCategoryById(categoryId: string): Category | undefined {
  return categories.find(c => c.id === categoryId)
}

function getNomineeName(categoryId: string, nomineeId: string): { artist: string; work?: string } | undefined {
  const category = getCategoryById(categoryId)
  if (!category) return undefined
  return category.nominees.find(n => n.id === nomineeId)
}

// Check if predictions should be locked based on time
// Lockout time: 7:45pm ET on February 1, 2026
function isPastLockoutTime(): boolean {
  return new Date() >= LOCKOUT_TIME
}

// Calculate time remaining until lockout
function getTimeRemaining(): { hours: number; minutes: number; seconds: number; total: number } {
  const now = new Date()
  const total = LOCKOUT_TIME.getTime() - now.getTime()

  if (total <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0 }
  }

  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor(total / 1000 / 60 / 60)

  return { hours, minutes, seconds, total }
}

// Format countdown for display
function formatCountdown(time: { hours: number; minutes: number; seconds: number; total: number }): string {
  if (time.total <= 0) return ''

  const pad = (n: number) => n.toString().padStart(2, '0')

  if (time.hours > 0) {
    return `${time.hours}h ${pad(time.minutes)}m ${pad(time.seconds)}s`
  }
  return `${pad(time.minutes)}m ${pad(time.seconds)}s`
}

function App() {
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [predictions, setPredictions] = useState<Predictions>({})
  const [winners, setWinners] = useState<Winners>({})
  const [locked, setLocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [timeLocked, setTimeLocked] = useState(isPastLockoutTime())
  const [viewMode, setViewMode] = useState<ViewMode>('predictions')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(getTimeRemaining())

  // Handle real-time winner updates
  const handleWinnerChange = useCallback((payload: RealtimePostgresChangesPayload<Winner>) => {
    console.log('Real-time winner update:', payload)
    setLastUpdate(new Date())

    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      const newWinner = payload.new as Winner
      setWinners(prev => ({
        ...prev,
        [newWinner.category]: newWinner.nominee
      }))
      setRevealed(true)
    } else if (payload.eventType === 'DELETE') {
      const oldWinner = payload.old as Winner
      setWinners(prev => {
        const updated = { ...prev }
        delete updated[oldWinner.category]
        return updated
      })
    }
  }, [])

  // Load saved state from localStorage and set up real-time subscription
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

    // Set up real-time subscription
    const channel = subscribeToWinners(handleWinnerChange)

    // Update countdown every second and check for time lock
    const updateCountdown = () => {
      const remaining = getTimeRemaining()
      setCountdown(remaining)
      if (remaining.total <= 0) {
        setTimeLocked(true)
      }
    }
    const interval = setInterval(updateCountdown, 1000)

    // Cleanup
    return () => {
      clearInterval(interval)
      if (channel) {
        unsubscribeFromChannel(channel)
      }
    }
  }, [handleWinnerChange])

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
    if (locked || timeLocked) return

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
      alert(`Select all ${totalCategories} categories before locking. Currently: ${selectedCount}/${totalCategories}`)
      return
    }

    setLocked(true)
    localStorage.setItem('grammy-locked', 'true')
  }

  const resetGame = async () => {
    if (!confirm('Reset all predictions?')) return

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

  // Separate categories into announced and pending
  const announcedCategories = categories.filter(c => winners[c.id])
  const pendingCategories = categories.filter(c => !winners[c.id])

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Grammy Predictions</h1>
          <p className="subtitle">68th Annual Grammy Awards / 2026.02.01</p>
          {timeLocked ? (
            <div className="time-locked-message">
              <p className="locked-title">Predictions Closed</p>
              <p className="locked-subtitle">The show has started. New entries are no longer accepted.</p>
              <p className="locked-info">If you already made predictions, log in to view them.</p>
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn-gold">
                  View Predictions
                </button>
              </form>
            </div>
          ) : (
            <>
              {countdown.total > 0 && (
                <div className="countdown-banner">
                  <span className="countdown-label">Lockout in</span>
                  <span className="countdown-time">{formatCountdown(countdown)}</span>
                </div>
              )}
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn-gold">
                  Start
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    )
  }

  // Results View Component
  const ResultsView = () => (
    <div className="results-view">
      {/* Announced Winners Section */}
      <div className="results-section">
        <h2 className="results-section-title">
          Announced Winners ({announcedCategories.length}/{totalCategories})
        </h2>
        {announcedCategories.length === 0 ? (
          <div className="no-winners">
            <p>No winners announced yet</p>
            <p className="no-winners-subtitle">Results will appear here in real-time as they're announced</p>
          </div>
        ) : (
          <div className="winners-list">
            {announcedCategories.map(category => {
              const winnerNominee = getNomineeName(category.id, winners[category.id])
              const userPrediction = predictions[category.id]
              const isCorrect = userPrediction === winners[category.id]

              return (
                <div key={category.id} className={`winner-card ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="winner-category">
                    <span className="category-name">{category.name}</span>
                  </div>
                  <div className="winner-details">
                    <div className="winner-name">
                      <span className="artist">{winnerNominee?.artist}</span>
                      {winnerNominee?.work && <span className="work">{winnerNominee.work}</span>}
                    </div>
                    <div className="your-pick">
                      {isCorrect ? (
                        <span className="pick-correct">Correct</span>
                      ) : userPrediction ? (
                        <span className="pick-incorrect">
                          Your pick: {getNomineeName(category.id, userPrediction)?.artist}
                        </span>
                      ) : (
                        <span className="pick-none">No prediction</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pending Categories Section */}
      {pendingCategories.length > 0 && (
        <div className="results-section pending">
          <h2 className="results-section-title">
            Pending ({pendingCategories.length} remaining)
          </h2>
          <div className="pending-list">
            {pendingCategories.map(category => {
              const userPrediction = predictions[category.id]
              const predictedNominee = userPrediction ? getNomineeName(category.id, userPrediction) : null

              return (
                <div key={category.id} className="pending-card">
                  <div className="pending-category">
                    <span className="category-name">{category.name}</span>
                  </div>
                  {predictedNominee && (
                    <div className="your-prediction">
                      Your pick: <strong>{predictedNominee.artist}</strong>
                      {predictedNominee.work && <span className="work"> - {predictedNominee.work}</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="container">
      <header>
        <h1>Grammy Predictions</h1>
        <p className="subtitle">68th Annual Grammy Awards / 2026.02.01</p>
      </header>

      <div className="score-board">
        <div className="user-info">
          <span className="username">{username}</span>
          <button className="btn-small" onClick={logout}>Exit</button>
        </div>
        <div className="score-display">
          {revealed ? (
            <>Score: <span className="score">{score}</span>/{revealedCount}</>
          ) : (
            <>Selected: <span className="score">{selectedCount}</span>/{totalCategories}</>
          )}
        </div>
        <div className="buttons">
          {timeLocked ? (
            <span className="locked-badge">Time Locked</span>
          ) : !locked ? (
            <button className="btn-gold" onClick={lockPredictions} disabled={loading}>
              Lock In
            </button>
          ) : (
            <span className="locked-badge">Locked</span>
          )}
          {!timeLocked && <button className="btn-outline" onClick={resetGame}>Reset</button>}
        </div>
      </div>

      {/* View Toggle */}
      <div className="view-toggle">
        <button
          className={`toggle-btn ${viewMode === 'predictions' ? 'active' : ''}`}
          onClick={() => setViewMode('predictions')}
        >
          My Predictions
        </button>
        <button
          className={`toggle-btn ${viewMode === 'results' ? 'active' : ''}`}
          onClick={() => setViewMode('results')}
        >
          Results {revealedCount > 0 && `(${revealedCount})`}
        </button>
      </div>

      {/* Real-time indicator */}
      {lastUpdate && (
        <div className="realtime-indicator">
          <span className="pulse"></span>
          Live / Last update: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      <div className={`status-bar ${locked || timeLocked ? 'locked' : ''}`}>
        {timeLocked ? (
          <>
            Predictions are now locked. The show has started.
            <div className="progress-text">
              {revealedCount > 0
                ? `${revealedCount}/${totalCategories} announced / Score: ${score}/${revealedCount}`
                : 'Awaiting results'}
            </div>
          </>
        ) : locked ? (
          <>
            Predictions locked. Check back as winners are announced.
            <div className="progress-text">
              {revealedCount > 0
                ? `${revealedCount}/${totalCategories} announced / Score: ${score}/${revealedCount}`
                : 'Awaiting results'}
            </div>
          </>
        ) : (
          <>
            <div className="status-row">
              <span>Select your prediction for each category</span>
              {countdown.total > 0 && (
                <span className="countdown">
                  Locks in {formatCountdown(countdown)}
                </span>
              )}
            </div>
            <div className="progress-text">{selectedCount}/{totalCategories} categories</div>
          </>
        )}
      </div>

      {viewMode === 'results' ? (
        <ResultsView />
      ) : (
        <div className={`categories ${locked || timeLocked ? 'locked' : ''}`}>
          {categories.map((category) => (
            <div key={category.id} className="category">
              <h2>{category.name}</h2>
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
                      {nominee.work && <div className="work">{nominee.work}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <footer>
        CBS / 8PM ET / Good luck
      </footer>
    </div>
  )
}

export default App
