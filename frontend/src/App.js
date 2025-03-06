import React, { useState } from "react";
import './App.css';
import logo from './logohuss.jpg';

function App() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

    const sendMessage = async () => {
        if (message.trim() === "") return;
        const response = await fetch("https://chatbot-hfwq.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });
        const data = await response.json();
        setChat([...chat, { user: message, bot: data.response }]);
        setMessage("");
    };

    return (
        <div className="appContainer">
            {/* Logo góc nhỏ bên trái */}
            <div className="logoContainer">
                <img src={logo} alt="Logo HUS" className="logo" />
            </div>

            {/* Phần chat chính */}
            <div className="chatContainer">
                <h1 className="title">Chatbot Tư Vấn Tuyển Sinh</h1>
                <div className="chatBox">
                    {chat.map((item, index) => (
                        <div key={index} className="messageContainer">
                            <div className="userMessage">
                                <strong>Bạn:</strong> {item.user}
                            </div>
                            <div className="botMessage">
                                <strong>Bot:</strong> {item.bot}
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
                    />
                    <button onClick={sendMessage} className="button">
                        Gửi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
