import React, { use, useEffect } from 'react'
import { socket } from '../socket'

const Bubble = () => {
    const [users, setUsers] = React.useState([])

    useEffect(() => {
        socket.emit("join_game", { name: "Bekzod" })
    },[])

    useEffect(() => {
        console.log("users: ", typeof users)
    }, [users])

    useEffect(() => {
        socket.on("new_user", (malumot) => {
            setUsers([...users, malumot])
        })

        return () => {
            socket.off("new_user")
        }
    },[])

    return (
        <div className='p-5 h-screen'>
            <p>Users {users.length}</p>
            <div className='border border-red-400 h-full rounded-xl'>
                {users.length > 0 && users.map((user, index) => <div key={index} className='flex items-center justify-center gap-2 rounded-full size-14 border border-red-400 m-2'>{user.name}</div>)}
            </div>
        </div>
    )
}

export default Bubble