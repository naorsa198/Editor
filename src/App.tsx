import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header/header';
import Editor from './components/Editor/Editor';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Editor></Editor>
    </div>
  );
}

export default App;
