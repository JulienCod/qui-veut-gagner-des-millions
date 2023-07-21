// Base.js

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function Base({
  isGameActive,
}) {
  return (
    <>
      <Header
        isGameActive={isGameActive}
      />
      <main
        className={isGameActive ? "h-[100%] container-2xl" : "h-[calc(100%-65px)] container-2xl"}
      >
        <Outlet />
      </main>
      <Footer isGameActive={isGameActive} />
    </>
  );
}
