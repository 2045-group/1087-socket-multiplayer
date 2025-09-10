import React, { useEffect, useRef, useState } from 'react'
import { socket } from '../socket'

const ARENA_W = 1400
const ARENA_H = 600
const MOVE_SPEED = 15
const MOVE_INTERVAL = 50 // ms
const MIN_SIZE = 56 // Minimum bubble size
const MAX_SIZE = 200 // Maximum bubble size

const Bubble = () => {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [foodPos, setFoodPos] = useState({ x: 0, y: 0 })
  const [gameStats, setGameStats] = useState({
    topScore: 0,
    lastAction: null
  })

  const keysPressed = useRef(new Set())
  const moveInterval = useRef(null)

  // Calculate bubble size based on score
  const calculateBubbleSize = (score) => {
    return Math.min(MIN_SIZE + (score * 8), MAX_SIZE)
  }

  // Join game
  useEffect(() => {
    socket.emit('join_game', { name: 'Bekzod' })
  }, [])

  // Socket listeners
  useEffect(() => {
    const handleNewUser = (list) => {
      setUsers(list)
      // Update top score when users change
      if (list.length > 0) {
        const maxScore = Math.max(...list.map(u => u.score || 0))
        setGameStats(prev => ({ ...prev, topScore: maxScore }))
      }
    }
    
    const handleUserMoved = (list) => {
      setUsers(list)
      // Update top score when users move (scores might change)
      if (list.length > 0) {
        const maxScore = Math.max(...list.map(u => u.score || 0))
        setGameStats(prev => ({ ...prev, topScore: maxScore }))
      }
    }
    
    const handleFoodUpdate = (newFoodPos) => {
      setFoodPos(newFoodPos)
    }
    
    const handleFoodEaten = (data) => {
      // Update food position
      setFoodPos(data.newFood)
      // Update game stats
      setGameStats(prev => ({
        topScore: Math.max(prev.topScore, data.newScore),
        lastAction: `🍗 ${data.playerName} ate food! Score: ${data.newScore}`
      }))
      console.log(`${data.playerName} ate food! New score: ${data.newScore}`)
    }

    const handlePlayerEaten = (data) => {
      // Update game stats with player eating event
      setGameStats(prev => ({
        ...prev,
        topScore: Math.max(prev.topScore, data.eaterNewScore),
        lastAction: `💀 ${data.eaterName} (${data.eaterNewScore}) ate ${data.victimName} (${data.victimOldScore})!`
      }))
      console.log(`${data.eaterName} ate ${data.victimName}! ${data.eaterName} score: ${data.eaterNewScore}`)
    }

    socket.on('new_user', handleNewUser)
    socket.on('user_moved', handleUserMoved)
    socket.on('food_update', handleFoodUpdate)
    socket.on('food_eaten', handleFoodEaten)
    socket.on('player_eaten', handlePlayerEaten)

    return () => {
      socket.off('new_user', handleNewUser)
      socket.off('user_moved', handleUserMoved)
      socket.off('food_update', handleFoodUpdate)
      socket.off('food_eaten', handleFoodEaten)
      socket.off('player_eaten', handlePlayerEaten)
    }
  }, [])

  // Update currentUser
  useEffect(() => {
    const me = users.find((u) => u.id === socket.id) || null
    setCurrentUser(me)
  }, [users])

  // Movement function
  const moveUser = () => {
    if (!currentUser || keysPressed.current.size === 0) return

    let dx = 0, dy = 0
    if (keysPressed.current.has('w')) dy -= MOVE_SPEED
    if (keysPressed.current.has('s')) dy += MOVE_SPEED
    if (keysPressed.current.has('a')) dx -= MOVE_SPEED
    if (keysPressed.current.has('d')) dx += MOVE_SPEED

    if (dx !== 0 || dy !== 0) {
      socket.emit('move_user', { deltaX: dx, deltaY: dy })
    }
  }

  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase()
    if (['w','a','s','d'].includes(key)) {
      e.preventDefault()
      if (!keysPressed.current.has(key)) {
        keysPressed.current.add(key)
      }
      if (!moveInterval.current) {
        moveInterval.current = setInterval(moveUser, MOVE_INTERVAL)
      }
    }
  }

  const handleKeyUp = (e) => {
    const key = e.key.toLowerCase()
    if (['w','a','s','d'].includes(key)) {
      keysPressed.current.delete(key)
      if (keysPressed.current.size === 0 && moveInterval.current) {
        clearInterval(moveInterval.current)
        moveInterval.current = null
      }
    }
  }

  // Keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      if (moveInterval.current) {
        clearInterval(moveInterval.current)
      }
    }
  }, [currentUser])

  // Get color based on score (bigger = more dangerous)
  const getBubbleColor = (score, isCurrentUser) => {
    if (isCurrentUser) {
      if (score >= 20) return 'border-purple-400 bg-purple-950 text-purple-200'
      if (score >= 10) return 'border-blue-400 bg-blue-950 text-blue-200'
      return 'border-cyan-400 bg-cyan-950 text-cyan-200'
    } else {
      if (score >= 20) return 'border-red-600 bg-red-900 text-red-200'
      if (score >= 10) return 'border-orange-400 bg-orange-900 text-orange-200'
      return 'border-red-400 bg-red-800 text-red-200'
    }
  }

  return (
    <div className='p-5 h-screen flex flex-col' tabIndex={0}>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <p className='text-lg font-semibold'>Players: {users.length}</p>
          <p className='text-sm text-gray-600'>Your Score: {currentUser?.score || 0}</p>
          <p className='text-xs text-gray-500'>Size: {calculateBubbleSize(currentUser?.score || 0)}px</p>
        </div>
        <div className='text-right'>
          <p className='text-sm text-yellow-600 font-medium'>Top Score: {gameStats.topScore}</p>
          {gameStats.lastAction && (
            <p className='text-xs text-green-600 max-w-xs truncate'>{gameStats.lastAction}</p>
          )}
        </div>
      </div>
      
      <div className='instructions mb-4 text-sm text-gray-600'>
        <p>🎮 Use WASD to move • 🍗 Eat food to grow • 💀 Eat smaller players to get their score!</p>
        <p className='text-xs text-yellow-600 mt-1'>
          ⚠️ Bigger players can eat you! Stay away from larger bubbles!
        </p>
      </div>

      <div className='border max-w-[1400px] h-[600px] mx-auto w-full border-red-400 flex-1 rounded-xl relative overflow-hidden bg-gray-900'>
        {users.length > 0 && users.map((user) => {
          const bubbleSize = calculateBubbleSize(user.score || 0)
          const isCurrentUser = user.id === socket.id
          const colorClass = getBubbleColor(user.score || 0, isCurrentUser)
          
          return (
            <div
              key={user.id}
              className={`absolute flex flex-col items-center justify-center rounded-full border-2 text-xs font-medium transition-all duration-200 ${colorClass} ${
                isCurrentUser ? 'ring-2 ring-white ring-opacity-50' : ''
              }`}
              style={{
                left: `${user.x}px`,
                top: `${user.y}px`,
                width: `${bubbleSize}px`,
                height: `${bubbleSize}px`,
                transform: 'translate(-50%, -50%)',
                fontSize: Math.max(10, Math.min(14, bubbleSize / 6)) + 'px'
              }}
            >
              <div className='font-bold truncate max-w-full px-1'>{user.name}</div>
              <div className='text-yellow-300 font-semibold'>{user.score || 0}</div>
              {bubbleSize > 100 && (
                <div className='text-xs opacity-75 mt-1'>
                  {bubbleSize}px
                </div>
              )}
            </div>
          )
        })}

        {/* Food - now managed by server */}
        <div
          className='size-8 text-2xl rounded-full flex items-center justify-center absolute animate-bounce z-10'
          style={{
            left: `${foodPos.x}px`,
            top: `${foodPos.y}px`,
            transform: 'translate(-50%, -50%)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,0,0.5))'
          }}
        >
          🍗
        </div>

        {/* Grid lines for better spatial awareness */}
        <div className='absolute inset-0 opacity-10'>
          {Array.from({length: Math.floor(ARENA_W / 100)}).map((_, i) => (
            <div
              key={`v-${i}`}
              className='absolute top-0 bottom-0 w-px bg-gray-400'
              style={{ left: `${i * 100}px` }}
            />
          ))}
          {Array.from({length: Math.floor(ARENA_H / 100)}).map((_, i) => (
            <div
              key={`h-${i}`}
              className='absolute left-0 right-0 h-px bg-gray-400'
              style={{ top: `${i * 100}px` }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Leaderboard */}
      {users.length > 0 && (
        <div className='mt-4 max-w-md mx-auto'>
          <h3 className='text-lg font-semibold mb-2 flex items-center gap-2'>
            🏆 Leaderboard
          </h3>
          <div className='space-y-1 max-h-40 overflow-y-auto'>
            {users
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .slice(0, 10)
              .map((user, index) => {
                const isCurrentUser = user.id === socket.id
                const bubbleSize = calculateBubbleSize(user.score || 0)
                
                return (
                  <div
                    key={user.id}
                    className={`flex justify-between items-center p-2 rounded transition-colors ${
                      isCurrentUser ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-100'
                    }`}
                  >
                    <div className='flex items-center gap-2'>
                      <span className={`font-bold text-sm ${index < 3 ? 'text-yellow-600' : ''}`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </span>
                      <span className='font-medium truncate max-w-24'>
                        {user.name}
                      </span>
                      <span className='text-xs text-gray-500'>
                        ({bubbleSize}px)
                      </span>
                    </div>
                    <span className='text-yellow-600 font-semibold'>
                      {user.score || 0}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Bubble