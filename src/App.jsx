import {  useState } from 'react';
import axios from 'axios';
import './App.css';


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

        <ul className="chatbox">
            <li className="chat-incoming chat">
                <p>Hey! How can I assist you today?</p>
            </li>
        </ul>
        <div className="chat-input">
            <textarea rows="0"  cols="10"
                      placeholder="Enter a message..."></textarea>
            <button id="sendbtn">Send</button>
        </div>
      </div>
      <div></div>
      </>


    
   
);

}

export default App


