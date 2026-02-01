import { useState, useEffect, useCallback } from 'react'
import { supabase, subscribeToWinners, unsubscribeFromChannel } from './lib/supabase'
import type { Winner } from './lib/supabase'
import { categories, totalCategories } from './data/nominees'
import type { Category } from './data/nominees'
import type { RealtimePostgresChangesPayload, User } from '@supabase/supabase-js'
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
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
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

  // Check auth state and set up subscriptions
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadPredictions(session.user.id)
        const savedLocked = localStorage.getItem(`grammy-locked-${session.user.id}`)
        if (savedLocked === 'true') {
          setLocked(true)
        }
      }
      setAuthLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadPredictions(session.user.id)
        const savedLocked = localStorage.getItem(`grammy-locked-${session.user.id}`)
        if (savedLocked === 'true') {
          setLocked(true)
        }
      } else {
        setPredictions({})
        setLocked(false)
      }
    })

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
      subscription.unsubscribe()
      if (channel) {
        unsubscribeFromChannel(channel)
      }
    }
  }, [handleWinnerChange])

  const loadPredictions = async (userId: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userId)

    if (data) {
      const preds: Predictions = {}
      data.forEach((p: { category: string; nominee: string }) => {
        preds[p.category] = p.nominee
      })
      setPredictions(preds)
    }
    setLoading(false)
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
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

  const selectNominee = async (categoryId: string, nomineeId: string) => {
    if (locked || timeLocked || !user) return

    const newPredictions = { ...predictions, [categoryId]: nomineeId }
    setPredictions(newPredictions)

    // Save to Supabase
    await supabase
      .from('predictions')
      .upsert({
        user_id: user.id,
        category: categoryId,
        nominee: nomineeId,
      }, {
        onConflict: 'user_id,category'
      })
  }

  const lockPredictions = async () => {
    if (!user) return
    const selectedCount = Object.keys(predictions).length
    if (selectedCount < totalCategories) {
      alert(`Select all ${totalCategories} categories before locking. Currently: ${selectedCount}/${totalCategories}`)
      return
    }

    setLocked(true)
    localStorage.setItem(`grammy-locked-${user.id}`, 'true')
  }

  const resetGame = async () => {
    if (!user) return
    if (!confirm('Reset all predictions?')) return

    await supabase
      .from('predictions')
      .delete()
      .eq('user_id', user.id)

    setPredictions({})
    setLocked(false)
    localStorage.removeItem(`grammy-locked-${user.id}`)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setPredictions({})
    setLocked(false)
  }

  const selectedCount = Object.keys(predictions).length
  const revealedCount = Object.keys(winners).length

  // Separate categories into announced and pending
  const announcedCategories = categories.filter(c => winners[c.id])
  const pendingCategories = categories.filter(c => !winners[c.id])

  // Get display name from user
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Player'

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Grammy Predictions</h1>
          <p className="subtitle">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="login-container">
        {/* Vinyl Record Graphic */}
        <div className="vinyl-graphic">
          <div className="vinyl-record">
            <div className="vinyl-grooves"></div>
            <div className="vinyl-label">
              <div className="vinyl-label-text">68</div>
            </div>
            <div className="vinyl-hole"></div>
          </div>
          <div className="tonearm">
            <div className="tonearm-base"></div>
            <div className="tonearm-arm"></div>
            <div className="tonearm-head"></div>
          </div>
        </div>

        <div className="login-box">
          <div className="login-header">
            <h1>Grammy</h1>
            <h1 className="login-title-accent">Predictions</h1>
          </div>
          <div className="login-meta">
            <span className="login-meta-item">68th Annual</span>
            <span className="login-meta-divider">/</span>
            <span className="login-meta-item">2026.02.01</span>
            <span className="login-meta-divider">/</span>
            <span className="login-meta-item">CBS 8PM ET</span>
          </div>

          {timeLocked ? (
            <div className="time-locked-message">
              <p className="locked-title">Predictions Closed</p>
              <p className="locked-subtitle">The show has started</p>
              <button onClick={signInWithGoogle} className="btn-google">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                View My Predictions
              </button>
            </div>
          ) : (
            <>
              {countdown.total > 0 && (
                <div className="countdown-banner">
                  <span className="countdown-label">Locks in</span>
                  <span className="countdown-time">{formatCountdown(countdown)}</span>
                </div>
              )}
              <button onClick={signInWithGoogle} className="btn-google">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Enter with Google
              </button>
              <p className="login-tagline">Pick winners. Track your score. Compete with friends.</p>
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
          <span className="username">{displayName}</span>
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
