<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/users', name:'api_user')]
class UserController extends AbstractController
{
    private $userRepository;
    private $tokenStorage;

    public function __construct(
        UserRepository $userRepository,
    TokenStorageInterface $tokenStorage){
        $this->userRepository = $userRepository;
        $this->tokenStorage = $tokenStorage;
    }

    /**
     * @return JsonResponse
     */
    #[Route('/', name: 'get', methods: ['GET'])]
    public function index(): JsonResponse
    {
        // récupérateur de l'utilisateur courant par le token

        $currentUser = $this->tokenStorage->getToken()->getUser();
        if ($currentUser->getRoles() != ['ROLE_ADMIN','ROLE_USER']) {
            return $this->json(['message' => 'Vous n\'avez pas accès à ce contenu'], JsonResponse::HTTP_FORBIDDEN);
        }
        $users = $this->userRepository->findAll();
        return $this->json(['users' => $users, 'message' => 'Liste des utilisateurs récupérée avec succès']);
    }

    /**
     * @param $id
     * @return JsonResponse
     */
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show($id): JsonResponse
    {
        // récupération de l'utilisateur par l'identifiant passé en paramètre
        $user = $this->userRepository->find($id);
        // récupérateur de l'utilisateur courant par le token
        $currentUser = $this->tokenStorage->getToken()->getUser();

        //vérification que un utilisateur et trouvé en base de donné
        if (!$user) {
            return $this->json(['message' => 'l\'utilisateur n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }

        // vérification que l'utilisateur courant ne soit pas administrateur
        if ($currentUser->getRoles() != ['ROLE_ADMIN','ROLE_USER']) {
            // vérification que le l'utilisateur courant soit bien le propriétaire du compte
            if ($currentUser->getEmail() !== $user->getEmail()) {
                return $this->json(['message' => 'Vous n\'avez pas accès à ce contenu'], JsonResponse::HTTP_FORBIDDEN);
            }
        }

        // accès au données
        $userData = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ];

        // réponse
        return $this->json(['user' => $userData], JsonResponse::HTTP_OK);
    }

   /* #[Route('/{id}/edit', name: 'edit', methods: ['GET', 'POST'])]
    public function edit(
        Request $request,
        $id,
        ValidatorInterface $validator): JsonResponse
    {

        // récupération de l'utilisateur par l'identifiant passé en paramètre
        $user = $this->userRepository->find($id);
        // récupérateur de l'utilisateur courant par le token
        $currentUser = $this->tokenStorage->getToken()->getUser();

        //vérification que un utilisateur et trouvé en base de donné
        if (!$user) {
            return $this->json(['message' => 'l\'utilisateur n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }

        // vérification que l'utilisateur courant ne soit pas administrateur
        if ($currentUser->getRoles() != ['ROLE_ADMIN','ROLE_USER']) {
            // vérification que le l'utilisateur courant soit bien le propriétaire du compte
            if ($currentUser->getEmail() !== $user->getEmail()) {
                return $this->json(['message' => 'Vous n\'avez pas accès à ce contenu'], JsonResponse::HTTP_FORBIDDEN);
            }
        }
        // Récupérer les données de modification depuis la requête
        $data = json_decode($request->getContent(), true);

        $user->setEmail($data['email']);

        // Valider les données de modification
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            // Il y a des erreurs de validation, vous pouvez les traiter ici

            $errorMessages = [];
            foreach ($errorMessages as $error) {
                $errorMessage = $error->getMessage();
            }
            return new JsonResponse(['message' => $errorMessage], JsonResponse::HTTP_BAD_REQUEST);
        }

    }*/

    /**
     * @param $id
     * @return JsonResponse
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete($id): JsonResponse
    {
        // récupération de l'utilisateur par l'identifiant passé en paramètre
        $user = $this->userRepository->find($id);
        // récupérateur de l'utilisateur courant par le token
        $currentUser = $this->tokenStorage->getToken()->getUser();

        //vérification que un utilisateur et trouvé en base de donné
        if (!$user) {
            return $this->json(['message' => 'l\'utilisateur n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }

        // vérification que l'utilisateur courant ne soit pas administrateur
        if ($currentUser->getRoles() != ['ROLE_ADMIN','ROLE_USER']) {
            // vérification que le l'utilisateur courant soit bien le propriétaire du compte
            if ($currentUser->getEmail() !== $user->getEmail()) {
                return $this->json(['message' => 'Vous n\'avez pas accès à ce contenu'], JsonResponse::HTTP_FORBIDDEN);
            }
        }
            $this->userRepository->remove($user, true);
        return $this->json(['message' => 'L\utilisateur a été supprimé avec succès'], JsonResponse::HTTP_OK);

    }
}
