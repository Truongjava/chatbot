import React, { useState, useRef, useEffect } from "react";
import './App.css';
import logo from './logohuss.jpg';

function App() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const chatBoxRef = useRef(null);

    const sendMessage = async () => {
        if (message.trim() === "") return;

        setChat([...chat, { user: message, bot: "Bot đang trả lời..." }]);
        setMessage("");
        setIsLoading(true);

        try {
            const response = await fetch("https://chatbot-hfwq.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();

            setChat((prevChat) => {
                const newChat = [...prevChat];
                newChat[newChat.length - 1].bot = data.response;
                return newChat;
            });
        } catch (error) {
            setChat((prevChat) => {
                const newChat = [...prevChat];
                newChat[newChat.length - 1].bot = "Bot gặp lỗi, vui lòng thử lại!";
                return newChat;
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chat]);

    return (
        <div className="appContainer">
            <div className="logoContainer">
                <img src={logo} alt="Logo HUS" className="logo" />
            </div>

            <div className="chatContainer">
                <h1 className="title">Chatbot Tư Vấn Tuyển Sinh</h1>
                <div className="chatBox" ref={chatBoxRef}>
                    {chat.map((item, index) => (
                        <div key={index} className="messageContainer">
                            <div className="botMessage">
                                <strong>Bot:</strong> {item.bot === "Bot đang trả lời..." ? <span className="spinner"></span> : item.bot}
                            </div>
                            <div className="userMessage">
                                <strong>Bạn:</strong> {item.user}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="inputContainer">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập câu hỏi..."
                        className="input"
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        disabled={isLoading}
                    />
                    <button onClick={sendMessage} className="button" disabled={isLoading}>
                        {isLoading ? <span className="spinner"></span> : "Gửi"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
