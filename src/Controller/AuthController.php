<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\JWTService;
use App\Service\SendMailService;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[Route('/api', name:'api_')]
class AuthController extends AbstractController
{
    private $entityManager;
    private $passwordHasher;
    private $jwt;
    private $reactAppUrl;
    private $userRepository;
    private $validator;
    private $mail;


    public function __construct(
        EntityManagerInterface      $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        JWTService $jwt,
        ParameterBagInterface $parameterBag,
        UserRepository $userRepository,
        ValidatorInterface $validator,
        SendMailService $mail,
    ) {
        $this->passwordHasher = $passwordHasher;
        $this->userRepository = $userRepository;
        $this->validator = $validator;
        $this->mail = $mail;
        $this->entityManager = $entityManager;
        $this->jwt = $jwt;
        $this->reactAppUrl = $parameterBag->get('app.react_app_url');
    }

    /**
     * Register User
     *
     * @param Request $request
     * @return JsonResponse
     */
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request,
    ): JsonResponse {
        // Récupérer les données d'inscription depuis la requête
        $data = json_decode($request->getContent(), true);

        // Vérifier si l'adresse e-mail existe déjà
        $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            // L'utilisateur existe déjà, renvoyez une réponse d'erreur appropriée
            return new JsonResponse(['message' => 'Adresse e-mail déjà utilisée'], JsonResponse::HTTP_CONFLICT);
        }
        // Créer un nouvel utilisateur
        $user = new User();
        $user->setEmail($data['email']);
        $user->setRoles(['ROLE_USER']);
        $user->setIsVerified(false);
        $user->setPassword($data['password']);
        // Valider les données d'inscription
        $errors = $this->validator->validate($user);
        if (count($errors) > 0) {
            // Il y a des erreurs de validation
            $errorMessages = [];
            foreach ($errorMessages as $error) {
                $errorMessage = $error->getMessage();
            }
            return new JsonResponse(['message' => $errorMessage], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Hacher le mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        // Enregistrer l'utilisateur dans la base de données
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // on génère le jwt de l'utilisateur
        // on créer le header
        $header =[
            'typ' => 'JWT',
            'alg' => 'HS256',
        ];

        // on créer le payload
        $payload = [
            'user_id' => $user->getId(),
        ];

        // on génère le token
        $token = $this->jwt->generate($header, $payload, $this->getParameter('app.jwtsecret'));

        // on envoie le mail

        $this->mail->send(
            'contact-qui-veut-gagner-des-millions@julien-webandco.fr',
            $user->getEmail(),
            'Activation de votre compte sur qui veut gagner des millions',
            'register',
            [
                'user' => $user,
                'token' => $token,
            ]
        );

        // Répondre avec un message de succès
        return new JsonResponse(['message' => 'Inscription réussie'], JsonResponse::HTTP_CREATED);
    }

    /**
     * verif User
     *
     * @param $token
     * @return JsonResponse
     */
    #[Route('/verif/{token}', name: 'verify_user', methods:['GET'])]
    public function verifyUser($token): JsonResponse
     {
        // on vérifie si le token est valide, n'a pas expiré et n'a pas été modifié
        if ($this->jwt->isValid($token) && !$this->jwt->isExpired($token) &&
        $this->jwt->check($token, $this->getParameter('app.jwtsecret'))) {
            // on récupère le payload
            $payload = $this->jwt->getPayload($token);

            // on récupère le user du token
            $user = $this->userRepository->find($payload['user_id']);

            // on vérifie que l'utilisateur existe et n'a pas encore activé son compte
            if ($user && !$user->isIsVerified()) {
                $user->setIsVerified(true);
                $this->entityManager->persist($user);
                $this->entityManager->flush();
                return new JsonResponse(['message' => 'Votre adresse e-mail à bien était activé'], JsonResponse::HTTP_OK);
            }

        }
        // ici un problème se pose dans le token
        return new JsonResponse(['message' => 'Le token est invalide ou a expiré'], JsonResponse::HTTP_FORBIDDEN);
    }

    /**
     * oubli-pass user generate token
     *
     * @param Request $request
     * @param TokenGeneratorInterface $tokenGenerator
     * @return JsonResponse
     */
    #[Route(path: '/oubli-pass', name: 'forgotten_password', methods:['POST'])]
    public function forgottenPassword(
        Request $request,
        TokenGeneratorInterface $tokenGenerator,
    ): JsonResponse {
        // récupération des données du front
        $data = json_decode($request->getContent(), true);

        // recherche de l'existance de l'utilisateur dans la base de données
        $user =$this->userRepository->findOneByEmail($data['email']);

        //on vérifie si on a un utilisateur
        if ($user) {
            // on génère un token de réinitialisation
            $token = $tokenGenerator->generateToken();
            $user->setResetPasswordToken($token);
            $this->entityManager->persist($user);
            $this->entityManager->flush();

            // on génère un lien de réinitialisation du mot de passe
            $url = $this->reactAppUrl.'/oubli-pass/'.$token;

            // on crée les données du mail
            $context = compact('url', 'user');

            //envoi du mail
            $this->mail->send(
                'contact-qui-veut-gagner-des-millions@julien-webandco.fr',
                $user->getEmail(),
                'Réinitialisation de mot de passe',
                'password_reset',
                $context
            );

            return new JsonResponse(['message'=> 'Email envoyé sur votre boite mail'], JsonResponse::HTTP_OK);
        }
        //user est null
        return new JsonResponse(['message' => "L'utilisateur n'existe pas"], JsonResponse::HTTP_NOT_FOUND);
    }

    /**
     * oubli-pass User control token
     *
     * @param $token
     * @param Request $request
     * @return JsonResponse
     */
    #[Route(path: '/oubli-pass/{token}', name:'reset_pass', methods:['POST'])]
    public function resetPass(
        string $token,
        Request $request,
    ): JsonResponse {
        // on vérifie si on a ce token en base de données
        $user = $this->userRepository->findOneBy(['resetPasswordToken' => $token]);

        if ($user) {
            $data= json_decode($request->getContent(), true);

            $user->setResetPasswordToken('');
            $user->setPassword(
                $this->passwordHasher->hashPassword($user, $data['password'])
            );

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            return new JsonResponse(['message' => 'Le mot de passe a été changer avec succès'], JsonResponse::HTTP_OK);
        }

        return new JsonResponse(['message' => 'Le jeton est invalide'],JsonResponse::HTTP_FORBIDDEN);
    }

    /**
     * Login User
     *
     * @param Request $request
     * @param Session $session
     * @return JsonResponse
     */
    #[Route("/login", name:"login", methods:['POST'])]
    public function login(
        Request $request,
        Session $session
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        // Récupérer les informations de connexion depuis la requête
        $email = $data['email'];
        $password = $data['password'];

        // Authentification via les informations de connexion
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if (!$user || !$this->passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['message' => 'Email ou mot de passe incorrect'], JsonResponse::HTTP_UNAUTHORIZED);
        }
        // Stocker les informations de l'utilisateur en cookie de session
        $session->set('user_id', $user->getId());
        $session->set('user_email', $user->getEmail());
        $session->set('user_role', $user->getRoles());

        return new JsonResponse(['message' => 'Authentification réussie'], JsonResponse::HTTP_OK);
    }

    /**
     * logout User
     *
     * @param SessionInterface $session
     * @return JsonResponse
     */
    #[Route("/logout", name:"logout", methods:['POST'])]
    public function logout(SessionInterface $session): JsonResponse
    {
        try {
            // Supprimer les informations de la session
            $session->clear();

            return new JsonResponse([null], JsonResponse::HTTP_OK);
        } catch (\Throwable $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}
