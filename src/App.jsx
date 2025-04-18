import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faSun, faMoon, faTimes } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  useEffect(() => {
    const savedChatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    savedChatHistory.forEach(message => {
      const chatBox = chatBoxRef.current;
      const chatLi = createChatLi(message.content, message.className);
      chatBox.appendChild(chatLi);
    });
  }, []);

  const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    if (className === "incoming") {
      chatLi.innerHTML = `<img src="/logo8.png" alt="Profile" className="profile-icon" /> <p></p>`;
    } else {
      chatLi.innerHTML = `<p></p>`;
    }
    chatLi.querySelector("p").textContent = message;
    return chatLi;
  };

  async function generateAnswer(incomingChatLi, question) {
    const messageElement = incomingChatLi.querySelector("p");
    try {
      console.log("question is:", question);

      // Retrieve chat history
      const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

      // Prepare the conversation history for the API
      const conversation = chatHistory.map(message => ({
        role: message.className === 'incoming' ? 'assistant' : 'user',
        content: message.content
      }));

      // Add the latest question
      conversation.push({
        role: 'user',
        content: question
      });

      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDQc9bxkxAYJl8W4tTVBXpocaxqiu-r_dw",
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          contents: conversation.map(conv => ({
            role: conv.role,
            parts: [{ text: conv.content }]
          }))
        })
      });        

      console.log('API Response:', response.data);

      if (response.data.candidates && response.data.candidates[0].content.parts[0]) {
        let answerText = response.data.candidates[0].content.parts[0].text;

        // Clean up the response
        answerText = answerText.replace(/\*+/g, ''); // Remove all asterisks
        answerText = answerText.replace(/\n+/g, '\n').trim(); // Remove extra newlines
        answerText = answerText.split('\n').map(line => line.trim()).join('\n'); // Trim each line

        setAnswer(answerText);
        console.log(answerText);

        messageElement.innerHTML = answerText;
        updateChatHistory({ content: answerText, className: 'incoming' });
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.error?.message || "Sorry, something went wrong.";
      setAnswer(errorMsg);
      messageElement.innerHTML = errorMsg;
    }
     finally {
      chatBoxRef.current.scrollTo(0, chatBoxRef.current.scrollHeight);
    }
  }

  function handleChat(e) {
    if (e) e.preventDefault();
    const chatInput = chatInputRef.current;
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    
    const chatBox = chatBoxRef.current;
    const outgoingChat = createChatLi(userMessage, "outgoing");
    chatBox.appendChild(outgoingChat);
    updateChatHistory({ content: userMessage, className: 'outgoing' });
    chatInput.value = "";
    chatInput.style.height = 'auto'; // Reset the height
    setQuestion(""); // Clear the question state
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {
      const incomingChatLi = createChatLi("Thinking...", "incoming");
      chatBox.appendChild(incomingChatLi);
      chatBox.scrollTo(0, chatBox.scrollHeight);
      generateAnswer(incomingChatLi, userMessage);
    }, 600);
  }

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const updateChatHistory = (message) => {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push(message);
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  };

  const clearChatHistory = () => {
    localStorage.removeItem('chatHistory');
    const chatBox = chatBoxRef.current;
    while (chatBox.firstChild) {
      chatBox.removeChild(chatBox.firstChild);
    }
  };

  return (
    <>
      <div className={`chatbot ${isDarkMode ? 'dark-mode' : ''}`}>
        <header>
          AI-Chatbot  
          <span onClick={toggleDarkMode} className="toggle-dark-mode">
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </span>
          <span onClick={clearChatHistory} className="clear-chat">
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </header>
        
        <div className='ai'>
          <img src="/icon3.png" alt="robot" />
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
            style={{ height: '40px' }} // Set the initial height here
          ></textarea>
          <span
            id="sendbtn"
            className='send-btn'
            onClick={handleChat}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </span>
        </div>
      </div>
    </>
  );
}

export default App;
