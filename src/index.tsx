import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Main } from "./pages/Main";
import { Dashboard } from "./pages/Dashboard";
import { Stats } from "./pages/Stats";

if (!("process" in window)) {
  // @ts-ignore
  window.process = {};
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/Stats" element={<Stats />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/About" element={<Main tabIndex={2} />} />
      <Route path="/Resources" element={<Main tabIndex={1} />} />
      <Route path="/" element={<Main />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
