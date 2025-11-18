import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../views/Home";
import New from "../views/New";

export default function router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/new" element={<New />} />
      </Routes>
    </BrowserRouter>
  );
}
