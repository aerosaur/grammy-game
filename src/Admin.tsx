import { useState, useEffect, useCallback } from 'react'
import { supabase, subscribeToWinners, unsubscribeFromChannel } from './lib/supabase'
import type { Winner } from './lib/supabase'
import { categories, totalCategories } from './data/nominees'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import './App.css'

type Winners = Record<string, string>

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Remember341256!'

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [winners, setWinners] = useState<Winners>({})
  const [loading, setLoading] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Handle real-time winner updates
  const handleWinnerChange = useCallback((payload: RealtimePostgresChangesPayload<Winner>) => {
    console.log('Admin: Real-time winner update:', payload)
    setLastUpdate(new Date())

    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
      const newWinner = payload.new as Winner
      setWinners(prev => ({
        ...prev,
        [newWinner.category]: newWinner.nominee
      }))
    } else if (payload.eventType === 'DELETE') {
      const oldWinner = payload.old as Winner
      setWinners(prev => {
        const updated = { ...prev }
        delete updated[oldWinner.category]
        return updated
      })
    }
  }, [])

  // Load winners and set up real-time subscription
  useEffect(() => {
    if (!isAuthenticated) return

    loadWinners()

    const channel = subscribeToWinners(handleWinnerChange)

    return () => {
      if (channel) {
        unsubscribeFromChannel(channel)
      }
    }
  }, [isAuthenticated, handleWinnerChange])

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
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const setWinner = async (categoryId: string, nomineeId: string) => {
    setLoading(categoryId)

    // Upsert the winner
    const { error } = await supabase
      .from('winners')
      .upsert({
        category: categoryId,
        nominee: nomineeId,
        announced_at: new Date().toISOString()
      }, {
        onConflict: 'category'
      })

    if (error) {
      console.error('Error setting winner:', error)
      alert('Error setting winner. Check console for details.')
    }

    setLoading(null)
  }

  const removeWinner = async (categoryId: string) => {
    if (!confirm('Remove winner for this category?')) return

    setLoading(categoryId)

    const { error } = await supabase
      .from('winners')
      .delete()
      .eq('category', categoryId)

    if (error) {
      console.error('Error removing winner:', error)
      alert('Error removing winner. Check console for details.')
    }

    setLoading(null)
  }

  const winnersCount = Object.keys(winners).length

  // Password login screen
  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Admin Access</h1>
          <p className="subtitle">Grammy Predictions / Winner Management</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError(false)
              }}
              autoFocus
              className={passwordError ? 'error' : ''}
            />
            {passwordError && (
              <p className="error-text">Incorrect password</p>
            )}
            <button type="submit" className="btn-gold">
              Access Admin
            </button>
          </form>
          <a href="/" className="admin-back-link">Back to predictions</a>
        </div>
      </div>
    )
  }

  return (
    <div className="container admin-container">
      <header>
        <div className="admin-header">
          <div>
            <h1>Admin / Winner Management</h1>
            <p className="subtitle">68th Annual Grammy Awards / 2026.02.01</p>
          </div>
          <a href="/" className="btn-small">Exit Admin</a>
        </div>
      </header>

      <div className="admin-status-bar">
        <div className="admin-progress">
          <span className="admin-count">{winnersCount}</span>/{totalCategories} winners announced
        </div>
        {lastUpdate && (
          <div className="admin-realtime">
            <span className="pulse"></span>
            Live / {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="admin-instructions">
        Click a nominee to mark as winner. Click the X to remove a winner.
      </div>

      <div className="admin-categories">
        {categories.map((category) => {
          const hasWinner = winners[category.id]
          const isLoading = loading === category.id

          return (
            <div
              key={category.id}
              className={`admin-category ${hasWinner ? 'has-winner' : ''} ${isLoading ? 'loading' : ''}`}
            >
              <div className="admin-category-header">
                <h2>{category.name}</h2>
                {hasWinner && (
                  <button
                    className="admin-remove-btn"
                    onClick={() => removeWinner(category.id)}
                    title="Remove winner"
                  >
                    X
                  </button>
                )}
              </div>
              <div className="admin-nominees">
                {category.nominees.map((nominee) => {
                  const isWinner = winners[category.id] === nominee.id

                  return (
                    <button
                      key={nominee.id}
                      className={`admin-nominee ${isWinner ? 'winner' : ''}`}
                      onClick={() => setWinner(category.id, nominee.id)}
                      disabled={isLoading}
                    >
                      <div className="admin-nominee-artist">{nominee.artist}</div>
                      {nominee.work && <div className="admin-nominee-work">{nominee.work}</div>}
                      {isWinner && <span className="admin-winner-badge">W</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <footer>
        Admin Panel / Handle with care
      </footer>
    </div>
  )
}

export default Admin
