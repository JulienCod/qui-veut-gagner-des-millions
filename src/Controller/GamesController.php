<?php

namespace App\Controller;

use App\Entity\Games;
use App\Repository\AccountRepository;
use App\Repository\GamesRepository;
use App\Repository\ThemeRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\RequestStack;

#[Route('/api/games', name: 'api_games_')]
class GamesController extends AbstractController
{
    private $entityManager;
    private $gamesRepository;
    private $accountRepository;
    private $themeRepository;
    private $requestStack;
    private $userRepository;
    private $validator;


    public function __construct(
        EntityManagerInterface $entityManager,
        GamesRepository $gamesRepository,
        AccountRepository $accountRepository,
        ThemeRepository $themeRepository,
        RequestStack $requestStack,
        UserRepository $userRepository,
        ValidatorInterface $validator,
    ) {
        $this->entityManager = $entityManager;
        $this->gamesRepository = $gamesRepository;
        $this->accountRepository = $accountRepository;
        $this->themeRepository = $themeRepository;
        $this->requestStack = $requestStack;
        $this->userRepository = $userRepository;
        $this->validator = $validator;

    }

    #[Route('/save', name: 'save', methods:['POST'])]
    public function saveGame(
        Request $request,
    ): JsonResponse {

        // récupération de la session
        $session = $this->requestStack->getSession();

        //récupération de l'identifiant de l'utilisateur via le cookie de session
        $currentUserId = $session->get('user_id');

        //récupération de l'utilisateur
        $user = $this->userRepository->find($currentUserId);

        //si l'utilisateur n'est pas trouvé retourner une erreur
        if(!$user) {
            return new JsonResponse(["message" => "L'utilisateur n'existe pas"], JsonResponse::HTTP_NOT_FOUND);
        }

        //récupération des datas du front
        $data = json_decode($request->getContent(), true);

        // récupération de l'identifiant du compte passé dans le body
        $account = $this->accountRepository->find($data['accountId']);

        // contrôle si le compte existe
        if(!$account) {
            return new JsonResponse(['message' => 'Le compte n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }

        // on vérifie que l'identifiant utilisateur du compte correspond bien à l'identifiant de l'utilisateur courant dans le token
        if($account->getUser()->getId() != $user->getId()) {
            return new JsonResponse(['message' => 'Vous n\'avez pas accès à ce compte'], JsonResponse::HTTP_FORBIDDEN);
        }

        // recherche du thème
        $theme = $this->themeRepository->find($data['themeId']);

        //si le thème n'existe pas envoi une erreur
        if (!$theme) {
            return $this->json(['message' => 'Le thème demandé n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }

        $game = new Games();
        $game->setAccountId($account);
        $game->setThemeId($theme);
        $game->setCorrectAnswersCount($data['correctAnswersCount']);
        $game->setUsedJokersCount($data['usedJokersCount']);
        $game->setGain($data['earnedAmount']);

                //valider les données de la partie
                $errors = $this->validator->validate($game);
                if (count($errors) > 0) {
                    // il y a des erreurs de validation
                    $errorsMessages = [];
                    foreach ($errorsMessages as $error) {
                        $errorMessage = $error->getMessage();
                    }
                    return new JsonResponse(['message' => $errorMessage], JsonResponse::HTTP_BAD_REQUEST);
                }

        $this->entityManager->persist($game);
        $this->entityManager->flush();
        return new JsonResponse(['message' => 'La partie a était enregistré avec succès'], JsonResponse::HTTP_OK);


    }

    #[Route('/getAccount/{id}', name:'getAccount', methods:['GET'])]
    public function getAccountId($id): JsonResponse
    {
        // récupération de la session
        $session = $this->requestStack->getSession();

        //récupération de l'identifiant de l'utilisateur via le cookie de session
        $currentUserId = $session->get('user_id');

        //récupération de l'utilisateur
        $user = $this->userRepository->find($currentUserId);

        //si l'utilisateur n'est pas trouvé retourner une erreur
        if(!$user) {
            return new JsonResponse(["message" => "L'utilisateur n'existe pas"], JsonResponse::HTTP_NOT_FOUND);
        }

        // récupération de l'identifiant du compte passé dans le body
        $account = $this->accountRepository->find($id);

        // contrôle si le compte existe
        if(!$account) {
            return new JsonResponse(['message' => 'Le compte n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }

        // on vérifie que l'identifiant utilisateur du compte correspond bien à l'identifiant de l'utilisateur courant dans le token
        if($account->getUser()->getId() != $user->getId()) {
            return new JsonResponse(['message' => 'Vous n\'avez pas accès à ce compte'], JsonResponse::HTTP_FORBIDDEN);
        }
    }
    #[Route('/admin/getAll', name:'admin_getAll', methods:['GET'])]
    public function adminGetAll(): JsonResponse
    {
        // récupération de la session
        $session = $this->requestStack->getSession();

        //récupération de l'identifiant de l'utilisateur via le cookie de session
        $currentUserId = $session->get('user_id');

        //récupération de l'utilisateur
        $user = $this->userRepository->find($currentUserId);

        //si l'utilisateur n'est pas trouvé retourner une erreur
        if(!$user) {
            return new JsonResponse(["message" => "L'utilisateur n'existe pas"], JsonResponse::HTTP_NOT_FOUND);
        }

        //récupération du role de l'utilisateur
        $currentUserRole = $session->get('user_role')[0];

        // si l'utilisateur n'a pas le role admin renvoi une erreur
        if ($currentUserRole != 'ROLE_ADMIN') {
            return new JsonResponse(["message" => "Vous n'êtes pas autorisé à ajouter des thèmes"], JsonResponse::HTTP_FORBIDDEN);
        }
    }
}
