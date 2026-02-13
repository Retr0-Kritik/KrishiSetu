import { useState, useEffect, useCallback } from 'react'

/**
 * Countdown timer hook.
 * @param {number|null} startedAt - Timestamp (ms) when the countdown started, or null if inactive.
 * @param {number} duration - Total countdown duration in ms (default: 15 minutes).
 * @returns {{ timeRemaining: number, formatTime: (ms: number) => string, isActive: boolean }}
 */
export function useCountdown(startedAt, duration = 15 * 60 * 1000) {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (!startedAt) return 0
    const elapsed = Date.now() - startedAt
    return Math.max(0, duration - elapsed)
  })

  useEffect(() => {
    if (!startedAt) {
      setTimeRemaining(0)
      return
    }

    const tick = () => {
      const elapsed = Date.now() - startedAt
      const remaining = Math.max(0, duration - elapsed)
      setTimeRemaining(remaining)
      if (remaining <= 0) clearInterval(interval)
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [startedAt, duration])

  const formatTime = useCallback((ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }, [])

  return { timeRemaining, formatTime, isActive: timeRemaining > 0 }
}
