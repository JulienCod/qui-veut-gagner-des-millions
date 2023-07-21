// Base.js

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function Base({
  isGameActive,
}) {
  const bg = "/images/bg.jpg";
  return (
    <>
      <Header
        isGameActive={isGameActive}
      />
      <main
      style={isGameActive? { backgroundImage: `url(${bg})` }: null}
        className={isGameActive ? "h-[100vh]  container-2xl" : "bg-gradient-to-b from-purple-900 to-indigo-900 min-h-[calc(100vh-72px-52px)] container-2xl"}
      >
        <Outlet />
      </main>
      <Footer isGameActive={isGameActive} />
    </>
  );
}
