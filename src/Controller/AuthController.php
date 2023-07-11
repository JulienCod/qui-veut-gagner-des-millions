<?php

namespace App\Controller;

use App\Entity\Theme;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/', name:'api_')]
class AuthController extends AbstractController
{
    private $entityManager;
    private $passwordHasher;

    public function __construct(
        EntityManagerInterface      $entityManager,
        UserPasswordHasherInterface $passwordHasher,
    )
    {
        $this->passwordHasher = $passwordHasher;
        $this->entityManager = $entityManager;
    }

    /**
     * @param Request $request
     * @param ValidatorInterface $validator
     * @return JsonResponse
     */
    #[Route('register', name: 'register', methods: ['POST'])]
    public function register(
        Request            $request,
        ValidatorInterface $validator): JsonResponse
    {
        // Récupérer les données d'inscription depuis la requête
        $data = json_decode($request->getContent(), true);
        $theme = $this->entityManager->getRepository(Theme::class)->find(1);
        // Créer un nouvel utilisateur
        $user = new User();
        $user->setEmail($data['email']);
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($data['password']);
        $user->setWallet(0);
        $user->addThemeId($theme);
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
}