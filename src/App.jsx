import './App.css'
import io from 'socket.io-client'
import {useState} from "react";
import Chat from "./components/Chat.jsx";

const socket = io.connect("http://localhost:3000");

function App() {

    const [userName, setUserName] = useState('')
    const [room, setRoom] = useState('')
    const [showChat, setShowChat] = useState(false);

    const joinRoom = async () => {
        if (userName !== '' && room !== '') {
            socket.emit('join_room', room)
            setShowChat(true);
        }
    }

    return (
        <>
            {!showChat ?
                <div className="flex w-full justify-center p-4">
                    <div className="bg-gray-200 flex flex-col items-center w-2/6 p-6 space-y-6 rounded-lg shadow-lg">
                        <div className="flex justify-center">
                            <h1 className="text-2xl font-semibold">Join to chat</h1>
                        </div>
                        <input className="bg-white p-2 rounded-md w-2/3" type="text" placeholder="User name"
                               onChange={e => setUserName(e.target.value)}/>

                        <input className="bg-white p-2 rounded-md w-2/3" type="text" placeholder="ID Room" onChange={e => setRoom(e.target.value)}/>

                        <button className="bg-blue-500 text-white w-2/3 p-2 rounded-lg hover:bg-blue-600 cursor-pointer" onClick={joinRoom}>Join</button>
                    </div>

                </div>
                : <Chat socket={socket} userName={userName} room={room}/>}
        </>
    )
}

export default App
