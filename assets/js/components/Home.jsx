import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Base from "../templates/Base";


function Main() {
    return (
                <Router>
                    <Routes>
                        <Route path="/" element={<Base />}>
                        </Route>
                    </Routes>
                </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>
);