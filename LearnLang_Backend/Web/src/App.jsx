import React from 'react'
import Login from './pages/Login';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DataUser from './pages/DataUser';
import DataQuiz from './pages/DataQuiz';
import DataArticle from './pages/DataArticle';
import Home from './pages/Home';
import AddAdmin from './pages/AddAdmin';
import AddUser from './pages/AddUser';
import AddArticle from './pages/AddArticle';
import AddSpelling from './pages/AddSpelling';
import AddPronunciation from './pages/AddPronunciation';

function App() {
  return (
   <BrowserRouter>
    <Routes>
    <Route path="/" element={<Dashboard />}>
    <Route path="" element={<Home />}></Route>
    <Route path="user" element={<DataUser />}></Route>
    <Route path="adduser" element={<AddUser />}></Route>
    <Route path="addadmin" element={<AddAdmin />}></Route>
    <Route path="quiz" element={<DataQuiz />}></Route>
    <Route path="addSpelling" element={<AddSpelling />}></Route>
    <Route path="addPronunciation" element={<AddPronunciation />}></Route>
    <Route path="article" element={<DataArticle />}></Route>
    <Route path="addarticle" element={<AddArticle />}></Route>
  </Route>
  <Route path="/login" element={<Login />}></Route>
</Routes>

    
   </BrowserRouter>
     
   
  )
}

export default App
