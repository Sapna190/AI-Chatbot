import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  async function generateAnswer(){
    console.log("Loading...");
    const response = await axios({
      url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBinPBcEPyRSIxghwfG8QNW-rvcZ97KRAc",
      method:"post",
      data:{contents:[{parts:[{text:"What is an API?"}]}]}
    });
    console.log(response['data']['candidates'][0]['content']['parts'][0]['text']);
  }








  return (
    <>
      <h1>AI-Chatbot</h1>
      <button onClick={generateAnswer}>Generate answer</button>
    </>
  )
}

export default App
