import React, { useEffect, useRef, useState } from 'react'
import { socket } from '../socket'

const ARENA_W = 1400
const ARENA_H = 600
const MOVE_SPEED = 15
const MOVE_INTERVAL = 50 // ms

const Bubble = () => {
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [foodPos, setFoodPos] = useState({ x: 0, y: 0 })
  const [gameStats, setGameStats] = useState({
    topScore: 0,
    lastEaten: null
  })

  const keysPressed = useRef(new Set())
  const moveInterval = useRef(null)

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
        lastEaten: `${data.playerName} ate food! Score: ${data.newScore}`
      }))
      console.log(`${data.playerName} ate food! New score: ${data.newScore}`)
    }

    socket.on('new_user', handleNewUser)
    socket.on('user_moved', handleUserMoved)
    socket.on('food_update', handleFoodUpdate)
    socket.on('food_eaten', handleFoodEaten)

    return () => {
      socket.off('new_user', handleNewUser)
      socket.off('user_moved', handleUserMoved)
      socket.off('food_update', handleFoodUpdate)
      socket.off('food_eaten', handleFoodEaten)
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

  return (
    <div className='p-5 h-screen flex flex-col' tabIndex={0}>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <p className='text-lg font-semibold'>Players: {users.length}</p>
          <p className='text-sm text-gray-600'>Your Score: {currentUser?.score || 0}</p>
        </div>
        <div className='text-right'>
          <p className='text-sm text-yellow-600 font-medium'>Top Score: {gameStats.topScore}</p>
          {gameStats.lastEaten && (
            <p className='text-xs text-green-600'>{gameStats.lastEaten}</p>
          )}
        </div>
      </div>
      
      <div className='instructions mb-4 text-sm text-gray-600'>
        Use WASD keys to move your bubble and eat food to increase your score!
      </div>

      <div className='border max-w-[1400px] h-[600px] mx-auto w-full border-red-400 flex-1 rounded-xl relative overflow-hidden'>
        {users.length > 0 && users.map((user) => (
          <div
            key={user.id}
            className={`absolute flex flex-col items-center justify-center rounded-full size-14 border text-xs transition-all duration-75 ${
              user.id === socket.id ? 'border-blue-400 bg-blue-950' : 'border-red-400'
            }`}
            style={{
              left: `${user.x}px`,
              top: `${user.y}px`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className='font-semibold'>{user.name}</div>
            <div className='text-xs text-yellow-400'>{user.score || 0}</div>
          </div>
        ))}

        {/* Food - now managed by server */}
        <div
          className='size-10 text-3xl rounded-full flex items-center justify-center absolute animate-pulse'
          style={{
            left: `${foodPos.x}px`,
            top: `${foodPos.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          🍗
        </div>
      </div>

      {/* Leaderboard */}
      {users.length > 0 && (
        <div className='mt-4 max-w-md mx-auto'>
          <h3 className='text-lg font-semibold mb-2'>Leaderboard</h3>
          <div className='space-y-1 flex items-center gap-5'>
            {users
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .slice(0, 5)
              .map((user, index) => (
                <div
                  key={user.id}
                  className={`flex justify-between items-center text-nowrap gap-2 p-2 rounded ${
                    user.id === socket.id ? 'bg-blue-400' : 'bg-gray-400'
                  }`}
                >
                  <span className='font-medium'>
                    {index + 1}. {user.name}: 
                  </span>
                  <span className='text-red-600 font-semibold'>
                    {user.score || 0}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Bubble