import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./Page/Header/Header";
import Schedule from "./Page/Schedule/Schedule";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/workdayscheduler" element={<Schedule />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;