<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api', name:'api_')]
class AuthController extends AbstractController
{
    private $entityManager;
    private $passwordHasher;

    public function __construct(
        EntityManagerInterface      $entityManager,
        UserPasswordHasherInterface $passwordHasher,
    ) {
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager;
    }

    /**
     * Register User
     *
     * @param Request $request
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request            $request,
        ValidatorInterface $validator
    ): JsonResponse {
        // Récupérer les données d'inscription depuis la requête
        $data = json_decode($request->getContent(), true);
        // Créer un nouvel utilisateur
        $user = new User();
        $user->setEmail($data['email']);
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($data['password']);
        // Valider les données d'inscription
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            // Il y a des erreurs de validation
            $errorMessages = [];
            foreach ($errorMessages as $error) {
                $errorMessage = $error->getMessage();
            }
            return new JsonResponse(['message' => $errorMessage], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Vérifier si l'adresse e-mail existe déjà
        $userRepository = $this->entityManager->getRepository(User::class);

        $existingUser = $userRepository->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            // L'utilisateur existe déjà, renvoyez une réponse d'erreur appropriée
            return new JsonResponse(['message' => 'Adresse e-mail déjà utilisée'], JsonResponse::HTTP_CONFLICT);
        }
        // Hacher le mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);


        // Enregistrer l'utilisateur dans la base de données
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Répondre avec un message de succès
        return new JsonResponse(['message' => 'Inscription réussie'], JsonResponse::HTTP_CREATED);
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