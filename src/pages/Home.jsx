import React, { useCallback, useEffect } from 'react'
import { socket } from '../socket'

const Home = () => {
    const [messages, setMessages] = React.useState([]);
    const [inputValue, setInputValue] = React.useState("");

    const submitHandler = (e) => {
        console.log("BOSILDI")
        socket.emit("habar", { message: inputValue, username: "Bekzod" });
        setInputValue("");
    }

    const handleIncoming = useCallback((data) => {
        if (Array.isArray(data)) {
            // agar server to'liq tarix yuborsa
            setMessages(data);
        } else if (data && typeof data === "object") {
            // agar server bitta xabar yuborsa
            setMessages((prev) => [...prev, data]);
        }
    }, []);

    useEffect(() => {
        socket.on("message", handleIncoming);
        return () => {
            socket.off("message", handleIncoming);
        };
    }, [handleIncoming]);


    return (
        <div className='flex flex-col gap-4 max-w-[60%] h-screen mx-auto py-10'>
            {/* Ro'yxat (CHAT) */}
            <div className='h-[90%] w-full bg-base-300 rounded-xl overflow-y-auto'>
                {
                    messages.map((message, index) => <div key={index} className='px-4 py-2 border-b border-base-200'>{message.username}: {message.message}</div>)
                }
            </div>
            <div className='flex-1 w-full flex gap-1'>
                <input type="text" value={inputValue} className='input input-primary flex-1' onChange={(e) => setInputValue(e.target.value)} />
                <button className='btn btn-soft btn-primary' onClick={submitHandler}>Yuborish</button>
            </div>
        </div>
    )
}

export default Home