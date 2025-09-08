import React, { useEffect, useRef } from 'react'
import { socket } from '../socket'

const Bubble = () => {
    const [users, setUsers] = React.useState([])
    const [currentUser, setCurrentUser] = React.useState(null)
    const keysPressed = useRef(new Set())
    const moveInterval = useRef(null)

    useEffect(() => {
        socket.emit("join_game", { name: "Bekzod" })
    }, [])

    useEffect(() => {
        console.log("users: ", typeof users)
    }, [users])

    useEffect(() => {
        socket.on("new_user", (malumot) => {
            setUsers(malumot)
            // Find current user
            const user = malumot.find(u => u.id === socket.id)
            if (user) {
                setCurrentUser(user)
            }
        })

        socket.on("user_moved", (updatedUsers) => {
            setUsers(updatedUsers)
        })

        return () => {
            socket.off("new_user")
            socket.off("user_moved")
        }
    }, [])

    // Movement speed
    const MOVE_SPEED = 10
    const MOVE_INTERVAL = 50 // milliseconds

    const moveUser = () => {
        if (!currentUser || keysPressed.current.size === 0) return

        let deltaX = 0
        let deltaY = 0

        if (keysPressed.current.has('w') || keysPressed.current.has('W')) deltaY -= MOVE_SPEED
        if (keysPressed.current.has('s') || keysPressed.current.has('S')) deltaY += MOVE_SPEED
        if (keysPressed.current.has('a') || keysPressed.current.has('A')) deltaX -= MOVE_SPEED
        if (keysPressed.current.has('d') || keysPressed.current.has('D')) deltaX += MOVE_SPEED

        if (deltaX !== 0 || deltaY !== 0) {
            socket.emit("move_user", { deltaX, deltaY })
        }
    }

    const handleKeyDown = (event) => {
        const key = event.key.toLowerCase()
        if (['w', 'a', 's', 'd'].includes(key)) {
            event.preventDefault()
            keysPressed.current.add(key)
            
            // Start continuous movement if not already running
            if (!moveInterval.current) {
                moveInterval.current = setInterval(moveUser, MOVE_INTERVAL)
            }
        }
    }

    const handleKeyUp = (event) => {
        const key = event.key.toLowerCase()
        if (['w', 'a', 's', 'd'].includes(key)) {
            keysPressed.current.delete(key)
            
            // Stop movement if no keys are pressed
            if (keysPressed.current.size === 0) {
                clearInterval(moveInterval.current)
                moveInterval.current = null
            }
        }
    }

    // Add event listeners for keyboard
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
            <p>Users {users.length}</p>
            <div className='instructions mb-4 text-sm text-gray-600'>
                Use WASD keys to move your bubble
            </div>
            {/* <div className='py-10 max-w-[1400px] w-full mx-auto bg-blue-400'></div> */}
            <div className='border max-w-[1400px] h-[600px] mx-auto w-full border-red-400  flex-1 rounded-xl relative overflow-hidden'>
                {users.length > 0 && users.map((user, index) => (
                    <div 
                        key={index} 
                        className={`absolute flex items-center justify-center gap-2 rounded-full size-14 border text-xs m-2 transition-all duration-75 ${
                            user.id === socket.id ? 'border-blue-400 bg-blue-100' : 'border-red-400'
                        }`}
                        style={{
                            left: `${user.x}px`,
                            top: `${user.y}px`,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {user.name}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Bubble