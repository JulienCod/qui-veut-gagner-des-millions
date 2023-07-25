import React, { useState } from "react";
import FetchApi from "../../services/fetchApi";
import Swal from "sweetalert2";

export default function Contact() {
    const [email, setEmail] = useState();
    const [subject, SetSubject] = useState();
    const [message, SetMessage] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await FetchApi('/api/contact', ['POST'], {
                email: email,
                subject: subject,
                message: message
            })
            if (response.response.ok) {
                Swal.fire({
                    title:'Contact',
                    Text: response.data.message,
                    timer:2000,
                    icon:'success',
                    showConfirmButton:false,
                    position:'center',
                })
            }else{
                const errors = response.data.errors
                console.log(errors)
                Swal.fire({
                    title:'Contact',
                    Text: response.data.errors,
                    timer:2000,
                    icon:'error',
                    showConfirmButton:false,
                    position:'center',
                })
            }
        } catch (error) {
            console.log(error)
            console.error(error);
        }
    }
  return (
    <section >
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-200 ">
          Contact
        </h1>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-200  sm:text-xl">
          Vous rencontrez des problèmes sur le jeu ? Vous avez une question ? Vous souhaitez avoir un thème bien précis ?  Ou tout autres questions ?<br /> <br />
          Contactez-moi via le formulaire ci-dessous.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label
              for="email"
              className="block mb-2 text-sm font-medium text-gray-200 "
            >
              Votre email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 "
              placeholder="email@email.fr"
              required
            />
          </div>
          <div>
            <label
              for="subject"
              className="block mb-2 text-sm font-medium text-gray-200 "
            >
              Sujet
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => SetSubject(e.target.value)}
              className="block p-3 w-full text-sm text-black bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 "
              placeholder="ex: ajouter un thème, un problème sur le jeu, etc..."
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              for="message"
              className="block mb-2 text-sm font-medium text-gray-200 "
            >
              Votre message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => SetMessage(e.target.value)}
              rows="6"
              className="block p-2.5 w-full text-sm text-black bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 "
              placeholder="Écrivez votre message"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-gray-500 hover:bg-gray-300 text-white hover:text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Envoyer le message
          </button>
        </form>
      </div>
    </section>
  );
}
