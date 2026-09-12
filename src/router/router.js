import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../views/Home";
import New from "../views/New";

export default function router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 3D site */}
        <Route path="/" element={<New />} />
        {/* Previous 2D site */}
        <Route path="/old" element={<Home />} />
        {/* Keep old links to the 3D preview working */}
        <Route path="/new" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
