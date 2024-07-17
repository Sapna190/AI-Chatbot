import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const chatInputRef = useRef(null); // Ref for the chat input
  const chatBoxRef = useRef(null); // Ref for the chat box

  useEffect(() => {
    const chatInput = chatInputRef.current;
    const inputInitHeight = chatInput.scrollHeight;

    const adjustHeight = () => {
      chatInput.style.height = `${inputInitHeight}px`;
      chatInput.style.height = `${chatInput.scrollHeight}px`;
    };

    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleChat();
      }
    };

    chatInput.addEventListener("input", adjustHeight);
    chatInput.addEventListener("keydown", handleKeyDown);

    return () => {
      chatInput.removeEventListener("input", adjustHeight);
      chatInput.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const createChatLi = (message, className) => {
    const chatLi = document.createElement("p");
    chatLi.classList.add("chat", className);
    if (className === "incoming") {
      chatLi.innerHTML = `<img src="logo8.png" alt="Profile" className="profile-icon" /> <p></p>`;
    } else {
      chatLi.innerHTML = `<p></p>`;
    }
    chatLi.querySelector("p").textContent = message;
    return chatLi;
  };

  async function generateAnswer(incomingChatLi){
    const messageElement = incomingChatLi.querySelector("p");
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY",
        method: "post",
        data: { contents: [{ parts: [{ text: question }] }] }
      });
      setAnswer(response.data.candidates[0].content.parts[0].text);
      messageElement.innerHTML = response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      setAnswer("Sorry, there was an error.");
      messageElement.innerHTML = "Sorry, there was an error.";
    } finally {
      chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
    }
  }

  const handleChat = () => {
    const chatInput = chatInputRef.current;
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    const chatBox = chatBoxRef.current;
    const outgoingChat = createChatLi(userMessage, "outgoing");
    chatBox.appendChild(outgoingChat);
    chatInput.value = "";
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {
      const incomingChatLi = createChatLi("Thinking...", "incoming");
      chatBox.appendChild(incomingChatLi);
      chatBox.scrollTo(0, chatBox.scrollHeight);
      generateAnswer(incomingChatLi);
    }, 600);
  };

  return (
    <>
      <div className='chatbot'>
        <header>AI-Chatbot</header>
        <div className='ai'>
          <img src="icon3.png" alt="robot" />
          <p>Hii....there!<br />This is your AI assistant.</p>
        </div>
        <div className="chatbox" ref={chatBoxRef}>
          <ul>
            <li className="chat incoming"></li>
          </ul>
        </div>
        <div className="chat-input">
          <textarea
            ref={chatInputRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter here..."
            required
          ></textarea>
          <span
            id="sendbtn"
            className='send-btn'
            onClick={() => { handleChat(); generateAnswer(); }}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </span>
        </div>
      </div>
    </>
  );
}

export default App;
