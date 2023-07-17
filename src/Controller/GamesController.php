<?php

namespace App\Controller;

use App\Entity\Games;
use App\Repository\AccountRepository;
use App\Repository\GamesRepository;
use App\Repository\ThemeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

#[Route('/api/games', name: 'api_games_')]
class GamesController extends AbstractController
{
    private $entityManager;
    private $tokenStorage;
    private $gamesRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        TokenStorageInterface $tokenStorage,
        GamesRepository $gamesRepository,
        
    )
    {
        $this->entityManager = $entityManager;
        $this->tokenStorage = $tokenStorage;
        $this->gamesRepository = $gamesRepository;
    }

    #[Route('/save', name: 'save', methods:['POST'])]
    public function saveGame(
        Request $request,
        AccountRepository $accountRepository,
        ThemeRepository $themeRepository,
    ): JsonResponse
    {

        $data = json_decode($request->getContent(), true);

        $game = new Games();
        $account = $accountRepository->find($data['accountId']);
        $theme = $themeRepository->find($data['themeId']);
        $game->addAccount($account);
        $game->addTheme($theme);
        $game->setCorrectAnswersCount($data['correctAnswersCount']);
        $game->setUsedJokersCount($data['usedJokersCount']);
        $game->setGain($data['earnedAmount']);

        $this->entityManager->persist($game);
        $this->entityManager->flush();
        return new JsonResponse(['message' => 'La partie a était enregistré avec succès'], JsonResponse::HTTP_OK);


    }

    #[Route('/admin/getAll', name:'admin_getAll', methods:['GET'])]
    public function adminGetAll(): JsonResponse
    {

    }
}
