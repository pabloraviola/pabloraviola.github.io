import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../views/Home";

export default function router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
