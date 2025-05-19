import React from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from './components/Editor/Editor';
import Header from './components/header/Header';

function App() {
  return (
    <div className="App">
      {/* <Header></Header> */}
      <Editor></Editor>
    </div>
  );
}

export default App;
