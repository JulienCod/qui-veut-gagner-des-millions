<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/users', name:'api_user')]
class UserController extends AbstractController
{
    private $userRepository;

    public function __construct(
        UserRepository $userRepository,

    ){
        $this->userRepository = $userRepository;
    }



    #[Route('/me', name: 'me', methods: ['GET'])]
    public function me(Session $session): JsonResponse
    {
        // Récupérer les informations de l'utilisateur à partir de la session
    $userId = $session->get('user_id');
    $userEmail = $session->get('user_email');
    $userRole = $session->get('user_role');

    if ($userEmail == null && $userId == null && $userRole == null){
        return new JsonResponse(['message' => 'Vous n\'êtes pas connecté.'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    $user = $this->userRepository->findBy(["id" => $userId, "email" => $userEmail]);
    
    if (!$user){
        return new JsonResponse(['message' =>"l'utilisateur n'existe pas"], JsonResponse::HTTP_FOUND);
    }

    return new JsonResponse(['user_id' => $userId, 'user_email' => $userEmail, 'user_role' => $userRole],JsonResponse::HTTP_OK);
    }

}