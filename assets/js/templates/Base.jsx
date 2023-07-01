// Base.js

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

export default function Base({isAuthenticated, isGameActive}) {
    return (
        <>
            <Header isGameActive={isGameActive} isAuthenticated={isAuthenticated} />
            <main className="container-2xl">
                <Outlet />
            </main>
            <Footer isGameActive={isGameActive}/>
        </>
    );
}