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
        <p>Hii....there!<br></br>
        This is your AI assistant</p>
        </div>
        
        <ul className='chatbox'>
          <li className='chat incoming'>
            <span className='material-symbols-outlined'></span>
          </li>
        </ul>
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} col="100" row="20"></textarea>
      </div>
     
    </>
) 
}

export default App


