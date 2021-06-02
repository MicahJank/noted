/* global chrome */
import React, { useState, useEffect } from 'react';
import Top from './components/Top.js';

function App() {
  const [notes, setNotes] = useState([]);


  useEffect(() => {
    fetch('https://my.api.mockaroo.com/notes.json?key=0523bb20')
    .then(res => {
      return res.json();
    })
    .then(res => {
      console.log(res);
      setNotes(res);
    })
    .catch(err => {
      console.log(err);
    })
  },[])

  return (
    <div className="App">
       <h3>Test</h3>
      <Top/>
      {notes.map(note => {
        return (
        <div className="note-card">
          <h3>{note.title}</h3>
          <p>{note.comment}</p>
          <img className="note-img" src={note.imgStr} />
        </div>)
      })}
    </div>
  );
}

export default App;
