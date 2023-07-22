import React from "react";

export default function Footer({ isGameActive }) {
  return isGameActive ? null : (
    <footer className="bg-gradient-to-b p-4 from-[#10053e] to-[#020009] w-full">
      <div className="container px-4 mx-auto flex items-center justify-between">
        <div>
          <img
            src="/images/logo/logo.webp"
            className="h-8 mr-3"
            alt="Qui veut gagner des millions Logo"
          />
        </div>
        <div className="text-gray-200 text-base font-bold">
          réalisé par{" "}
          <a
            href="https://www.julien-webandco.fr"
            target="_blank"
            className="text-gray-200 font-bold hover:underline hover:text-[#C6598E]"
          >
            Julien Web&Co
          </a>
        </div>
        <div>
          <img
            src="/images/logo/logo.webp"
            className="h-8 mr-3"
            alt="Qui veut gagner des millions Logo"
          />
        </div>
      </div>
    </footer>
  );
}
