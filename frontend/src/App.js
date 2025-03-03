import React, { useState } from "react";

function App() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

    const sendMessage = async () => {
        if (message.trim() === "") return;
        // const response = await fetch("http://localhost:8000/chat", {
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
        <div style={styles.container}>
            <h1 style={styles.title}>Chatbot Tư Vấn Tuyển Sinh</h1>
            <div style={styles.chatBox}>
                {chat.map((item, index) => (
                    <div key={index} style={styles.messageContainer}>
                        <div style={styles.userMessage}>
                            <strong>Bạn:</strong> {item.user}
                        </div>
                        <div style={styles.botMessage}>
                            <strong>Bot:</strong> {item.bot}
                        </div>
                    </div>
                ))}
            </div>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập câu hỏi..."
                    style={styles.input}
                />
                <button onClick={sendMessage} style={styles.button}>
                    Gửi
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: 20,
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: "#333",
    },
    chatBox: {
        height: 600,
        width: "80%",
        maxWidth: 1000,
        overflowY: "auto",
        backgroundColor: "#fff",
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        padding: 10,
        border: "1px solid #ddd",
    },
    messageContainer: {
        marginBottom: 10,
    },
    userMessage: {
        backgroundColor: "#d1e7ff",
        padding: 8,
        borderRadius: 5,
        marginBottom: 4,
    },
    botMessage: {
        backgroundColor: "#e2e3e5",
        padding: 8,
        borderRadius: 5,
    },
    inputContainer: {
        display: "flex",
        gap: 10,
        marginTop: 10,
        width: "80%",
        maxWidth: 600,
    },
    input: {
        flex: 1,
        padding: 10,
        border: "1px solid #ccc",
        borderRadius: 5,
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: 5,
        cursor: "pointer",
        transition: "background-color 0.2s",
    },
};

export default App;
