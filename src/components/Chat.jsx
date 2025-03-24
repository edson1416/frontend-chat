import React, {useEffect} from 'react';
import BasicScrollToBottom from "react-scroll-to-bottom";

const Chat = ({socket, userName, room}) => {

    const [currentMessage, setCurrentMessage] = React.useState('');
    const [messages, setMessages] = React.useState([]);

    const sendMessage = async () => {
        if (userName && currentMessage) {
            const info = {
                messages: currentMessage,
                room: room,
                author: userName,
                time: new Date(Date.now()).getHours() + ":" + (new Date()).getMinutes(),
            }

            await socket.emit('send_message', info);
            setMessages((list) => [...list, info]);
            setCurrentMessage('')
        }
    }

    const messageHandle = (data) => {
        setMessages((list) => [...list, data]);
        console.log(data);
    }

    useEffect(() => {
        socket.on('receive_message', messageHandle);
        return () => socket.off('receive_message', messageHandle);
    }, [socket])

    return (
        <div className="flex w-full justify-center p-4">
            <div className="bg-gray-200 flex flex-col p-6 sm:w-full md:w-2/4 lg:w-2/5 space-y-6 rounded-lg shadow-lg">
                <section className="chat-header flex flex-col items-center">
                    <p className="text-3xl font-semibold">Chat</p>
                    <p className="font-thin">room : {room}</p>
                    <p className="font-thin">user: {userName}</p>
                </section>
                <BasicScrollToBottom>
                    <section className="flex flex-col space-y-3 max-h-[300px] p-6">
                        {
                            messages.map((item, index) => {
                                if (room === item.room) {
                                    return (
                                        <div key={index}
                                             className={`flex ${userName === item.author ? 'justify-end' : 'justify-start'}`}>
                                            <div
                                                className={`${userName === item.author ? 'bg-blue-400' : 'bg-white'} p-3 rounded-md md:w-2/3 sm:w-full w-full shadow-md`}>
                                                <h1 className="font-semibold">{userName === item.author ? 'you' : item.author}</h1>
                                                <div className="flex flex-row p-1 justify-between">
                                                    <h1 className="break-words max-w-[70%]">{item.messages}</h1>
                                                    <h1 className="flex items-end">{item.time}</h1>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                }

                            })
                        }

                    </section>
                </BasicScrollToBottom>
                <section className="chat-footer flex justify-between space-x-4">
                    <input className="bg-white p-2 rounded-md w-3/4" type="text" placeholder="message ..."
                           value={currentMessage}
                           onChange={e => setCurrentMessage(e.target.value)}
                           onKeyPress={e => e.key === 'Enter' && sendMessage()}/>
                    <button className="bg-blue-500 text-white p-2 w-1/4 rounded-md hover:bg-blue-600 cursor-pointer"
                            onClick={sendMessage}>Send &#9658;</button>
                </section>
            </div>
        </div>
    );
};

export default Chat;