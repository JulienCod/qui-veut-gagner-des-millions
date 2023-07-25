import React from "react";
export default function Accueil() {
    const facebookPageLink = "https://www.facebook.com/profile.php?id=100089078507150";
    const instagramAccountLink="https://www.instagram.com/julienwebandco/";
  return (
    <section className="text-gray-200 py-8 px-4 container-2xl">
      <h1 className="text-center text-xl sm:text-3xl font-bold">
        Bienvenue à "Qui veut gagner des Millions"
      </h1>
      <div className="max-w-5xl mx-auto mt-8">
        <h2 className="text-lg md:text-2xl font-bold mb-4">Êtes-vous prêt à relever le défi ?</h2>
        <p>
          Dans ce jeu passionnant, votre objectif est de répondre à 15 questions sans faire de fautes, afin de remporter la somme de <span>1 000 000 €.</span>
        </p>
        <br />
        <p>
          Vous aurez 45 secondes pour chaque question, avec 4 réponses possibles par question. N'oubliez pas, vous disposerez de 3 jokers pour vous aider en cas de besoin :
        </p>
        <br />
        <ul className="list-disc pl-6">
          <li>
            Le joker "50/50" : il éliminera 2 mauvaises réponses parmi les 4 proposées, vous laissant ainsi avec deux options.
          </li>
          <li>
            Le joker "Appel à un ami" : une réponse vous sera suggérée en suivant le choix d'un ami.
          </li>
          <li>
            Le joker "Vote du public" : vous pourrez voir un pourcentage pour chaque réponse restante, vous permettant de suivre ou de prendre votre propre décision.
          </li>
        </ul>
        <br />
        <p >
          À la fin de chaque partie, vos gains fictifs seront crédités sur votre profil. Vous pouvez choisir votre profil avant de commencer la partie. Et si vous accumulez suffisamment d'argent, vous pourrez débloquer de nouveaux thèmes passionnants dans la rubrique "Compte" et détails du profil.
        </p>
        <br />
        <p>
          Pour jouer au jeu et profiter de toutes ses fonctionnalités, vous devez créer un compte et ensuite créer un profil. Ne vous inquiétez pas, cela ne prendra qu'une minute !
        </p>
        <br />
        <p >
          Nous voulons vous rassurer, ce jeu est entièrement gratuit et tout l'argent utilisé dans le jeu est purement fictif. Vous pouvez profiter de l'expérience de jeu sans aucun risque financier !
        </p>
        <br />
        <p>
          Si vous avez des questions, des idées de nouveaux thèmes ou si vous rencontrez un problème avec une réponse qui vous semble juste, n'hésitez pas à me contacter via la page de contact.
        </p>
        <br />
        <p>
          N'hésitez pas à capturer vos moments les plus excitants du jeu et à les partager sur votre page Facebook et Instagram ! Partagez votre progression, vos gains et vos exploits avec vos amis pour rendre l'expérience encore plus amusante et compétitive.
        </p>
        <br />
        <p>
          Pour partager vos captures d'écran sur Facebook, rendez-vous sur ma <a className="text-[#C6598E] hover:underline" href={facebookPageLink} target="_blank" rel="noopener noreferrer">page de Facebook</a> et publiez-les sur notre mur. N'oubliez pas de taguer vos amis pour qu'ils puissent également découvrir le jeu !
        </p>
        <br />
        <p>
          Pour Instagram, téléchargez vos captures d'écran sur votre compte en utilisant le hashtag #QuiVeutGagnerDesMillions et mentionnez mon <a className="text-[#C6598E] hover:underline" href={instagramAccountLink} target="_blank" rel="noopener noreferrer">compte Instagram</a> pour que nous puissions les repartager dans nos histoires !
        </p>
        <br />
        <p >
          N'hésitez pas à inviter vos amis, votre famille et votre entourage à jouer au jeu ! Plus on est de fous, plus on rit. Partagez l'expérience du jeu avec vos proches pour rendre cette aventure encore plus excitante et amusante !
        </p>
        <br />
        <p>
          Bonne chance et amusez-vous bien !
        </p>
      </div>
    </section>
  );
}
