import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css"
import Header from "./Page/Header/Header";
import Sidebar from "./Page/Sidebar/Sidebar";
import Schedule from "./Page/Schedule/Schedule";
import Parttime from "./Page/Parttime/Parttime";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
        <div className="Routediv">
          <div>
            <Sidebar className="Sidebar"/>
          </div>
          <Routes className="Route">
            <Route path="/workdayscheduler" element={<Schedule/>}/>
            <Route path="/parttime" element={<Parttime/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;