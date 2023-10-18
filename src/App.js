import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "../src/style/app.css"
import Schedule from "./page/schedule/schedule";
import Sidebar from "./page/sidebar/sidebar";
import Parttime from "./page/parttime/parttime";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
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