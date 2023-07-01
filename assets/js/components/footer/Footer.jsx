import React from "react";

export default function Footer({isGameActive})
{
    return (
        isGameActive?(null)
            :
        (<footer className="bg-gray-800 fixed bottom-0 w-full">
            <div className="container px-4 mx-auto flex items-center justify-between">
                <div>
                    <div>
                        <a href="https://votre-site.com">
                            <img src="/chemin/vers/votre/logo.png" alt="Logo" />
                        </a>
                    </div>
                    <a href="https://votre-site.com" className="text-white text-xl font-bold">
                        Mon Site
                    </a>
                </div>
                <div>
                    {/* Ajoutez ici d'autres informations dans le footer */}
                </div>
            </div>
        </footer>)
    );
}