import {  useState } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faPaperPlane } from '@fortawesome/free-solid-svg-icons';


function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");


  async function generateAnswer(){
    setAnswer("Loading...");
    const response = await axios({
      url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBinPBcEPyRSIxghwfG8QNW-rvcZ97KRAc",
      method:"post",
      data:{contents:[{parts:[{text:question}]}]}
    });
    (setAnswer(response['data']['candidates'][0]['content']['parts'][0]['text']));
  }

  return (
      <>
      <div className='chatbot'>
        <header>AI-Chatbot</header>
        <div className='ai'>
        <img src="icon3.png" alt="robot"  />
        <p>Hii....there!<br></br>This is your AI assistant.</p>
        </div>

        <div className="chatbox">
        <ul>

            <li className="chat outgoing">
                <p>Hey! How can I assist you today?</p>
            </li>

            <li className="chat incoming">
            <img src="logo8.png" alt="Profile" className="profile-icon" />
                <p>Hey!<br></br> How can I assist you today?</p>
                <pre>{answer}</pre>
            </li>
            
        </ul>
        </div>
        
        <div className="chat-input">
            <textarea  value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Enter here..."   required></textarea>
            <span id="sendbtn" className='send-btn' onClick={generateAnswer}><FontAwesomeIcon icon={faPaperPlane} /></span>
        </div>
      </div>
      
      </>


    
   
);

}

export default App


