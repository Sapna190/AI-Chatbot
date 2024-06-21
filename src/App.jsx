import { useState } from 'react';
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
      <h1>AI-Chatbot</h1>
      <textarea value={question} onChange={(e) => setQuestion(e.target.value)} col="100" row="20"></textarea>
      <button onClick={generateAnswer}>Generate answer</button>
      <pre></pre>
      <div></div>
    </>
  )
}

export default App
