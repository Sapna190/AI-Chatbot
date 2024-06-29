
import React from 'react'

const Header = () => {
  return (
    <div className='chatbot'>
      <header><h1>AI-Chatbot</h1></header>
      <h1>AI-Chatbot</h1>
      <textarea value={question} onChange={(e) => setQuestion(e.target.value)} col="100" row="20"></textarea>
      <button onClick={generateAnswer}>Generate answer</button>
      <pre>{answer}</pre>
    </div>
    
  )
}

export default Header

