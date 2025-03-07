import React, { useState, useRef, useEffect } from "react";
import './App.css';
import logo from './logohuss.webp';

function App() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef(null);

    const sendMessage = async () => {
        if (message.trim() === "" || isLoading) return;

        const userMessage = message;
        setMessage("");

        // Thêm tin nhắn người dùng và tin nhắn tạm chờ của bot
        setChat(prevChat => [
            ...prevChat,
            { sender: "user", message: userMessage },
            { sender: "bot", message: "Bot đang trả lời..." }
        ]);

        setIsLoading(true);

        try {
            const response = await fetch("https://chatbot-hfwq.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();

            // Cập nhật tin nhắn bot khi có kết quả
            setChat(prevChat => {
                const newChat = [...prevChat];
                newChat[newChat.length - 1].message = data.response;
                return newChat;
            });
        } catch (error) {
            setChat(prevChat => {
                const newChat = [...prevChat];
                newChat[newChat.length - 1].message = "Bot gặp lỗi, vui lòng thử lại sau!";
                return newChat;
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
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
                <h1 className="title">Chatbot tuyển sinh Hus</h1>

                <div className="chatBox" ref={chatBoxRef}>
                    {chat.map((item, index) => (
                        <div key={index} className={`message ${item.sender}`}>
                            {item.sender === "user" ? <strong>Bạn:</strong> : <strong>Bot:</strong>} {item.message}
                            {isLoading && item.message === "Bot đang trả lời..." && (
                                <span className="loadingSpinner"></span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="inputContainer">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập câu hỏi và nhấn Enter để gửi..."
                        className="input"
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        disabled={isLoading}
                    />
                    <button onClick={sendMessage} className="button" disabled={isLoading}>
                        Gửi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
