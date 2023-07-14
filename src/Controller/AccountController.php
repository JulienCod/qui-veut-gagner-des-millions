<?php

namespace App\Controller;

use App\Entity\Account;
use Doctrine\Common\Lexer\Token;
use App\Repository\AccountRepository;
use App\Repository\ThemeRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Util\Json;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

#[Route('/api/account', name: 'app_account_')]
class AccountController extends AbstractController
{
    private $entityManager;
    private $tokenStorage;
    private $accountRepository;
    public function __construct(
        EntityManagerInterface $entityManager,
        TokenStorageInterface $tokenStorage,
        AccountRepository $accountRepository
    ) {
        $this->entityManager = $entityManager;
        $this->tokenStorage = $tokenStorage;
        $this->accountRepository = $accountRepository;
    }
    #[Route('/create', name: 'app_account_create', methods:['POST'])]
    public function create(
        Request $request,
        ValidatorInterface $validator,
        ThemeRepository $themeRepository,
        UserRepository $userRepository
    ): JsonResponse {
        // récupération des données de création d'un compte
        $data = json_decode($request->getContent(), true);

        //récupération de l'identifiant de l'utilisateur via le token
        $currentUser = $this->tokenStorage->getToken()->getUser()->getId();
        //création d'un nouveau compte
        $account = new Account();
        $account->setName($data['account']);
        $account->setWallet(0);

        $user = $userRepository->find($currentUser);
        $account->setUser($user);

        // recherche du thème numéro 1 pour l'ajout par défault
        $theme = $themeRepository->find(1);
        $account->addThemeId($theme);
        //validation des données du compte
        $errors = $validator->validate($account);
        if(count($errors) > 0) {
            // il y a des erreurs de validation
            $errorMessages = [];
            foreach($errorMessages as $error) {
                $errorMessages = $error->getMessages();
            }
            return new JsonResponse(['message'=>$errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        // enregistrer le compte dans la base de données
        $this->entityManager->persist($account);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Le compte a été créé avec succès','account'=>$account], JsonResponse::HTTP_OK);
    }

    #[Route('/user', name: 'user', methods:['GET'])]
    public function getAccountByUser(
        UserRepository $userRepository
    ): JsonResponse {
        $currentUser = $this->tokenStorage->getToken()->getUser()->getId();
        $user = $userRepository->find($currentUser);
        $accounts = $user->getAccounts()->toArray();

        $accountDatas = [];
        foreach ($accounts as $account) {
            $accountData = [
                'id' => $account->getId(),
                'name' => $account->getName(),
                'wallet' => $account->getWallet(),
                'theme' => [],
            ];
            foreach ($account->getThemeId() as $themeId) {
                $theme = [
                    'id' => $themeId->getId(),
                    'name' => $themeId->getName(),
                    'value' => $themeId->getValue(),
                ];
                $accountData['theme'][] = $theme;
            }
            $accountDatas[]= $accountData;
        }

        return new JsonResponse($accountDatas, JsonResponse::HTTP_OK);
    }

    #[Route("/{id}", name: "id", methods: ['GET'])]
    public function accountId(
        $id,
        UserRepository $userRepository,
        AccountRepository $accountRepository,
        ThemeRepository $themeRepository,
    ): JsonResponse {
        $currentUser = $this->tokenStorage->getToken()->getUser()->getId();
        $user = $userRepository->find($currentUser);
        $accounts = $user->getAccounts()->toArray();
        foreach ($accounts as $account) {
            // Vérifier si l'utilisateur courant est le propriétaire du compte
            if ($account->getId() == $id) {
                // Récupérer les informations du compte
                $data = $accountRepository->find($id);
                $accountInfo = [
                    "id" => $account->getId(),
                    "name" => $data->getName(),
                    "wallet" => $data->getWallet(),
                ];

                // Récupérer tous les thèmes
                $dataThemes = $themeRepository->findAll();

                $themes = [];
                foreach ($dataThemes as $dataTheme) {
                    $themeAccounts = $dataTheme->getAccounts()->toArray();
                    $isActive = false;

                    foreach ($themeAccounts as $themeAccount) {
                        if ($themeAccount->getId() == $id) {
                            // Le compte possède ce thème
                            $isActive = true;
                            break;
                        }
                    }

                    $themes[] = [
                        'id' => $dataTheme->getId(),
                        'name' => $dataTheme->getName(),
                        'value' => $dataTheme->getValue(),
                        'actif' => $isActive,
                    ];
                }

                // Ajouter les thèmes au tableau de données du compte
                $accountInfo['themes'] = $themes;

                // Retourner les informations du compte dans la réponse JSON
                return new JsonResponse($accountInfo, JsonResponse::HTTP_OK);
            }
        }

        // Si l'utilisateur courant n'est pas le propriétaire du compte, renvoyer une réponse d'erreur
        return new JsonResponse(['message' => 'Vous n\'avez pas accès au données de ce compte'], JsonResponse::HTTP_UNAUTHORIZED);
    }

    #[Route("/gain/{id}", name:"gain_account", methods:['POST'])]
    public function gainAccount(
        $id,
        Request $request,
    ): JsonResponse {
        // récupération du compte avec l'identition passé en parametre
        $account = $this->accountRepository->find($id);

        // contrôle si le compte existe
        if (!$account) {
            return new JsonResponse(["message" => "Le compte n\'existe pas"], JsonResponse::HTTP_NOT_FOUND);
        }

        // récupération de l'identifiant de l'utilisateur courant par le token
        $currentUser = $this->tokenStorage->getToken()->getUser()->getId();

        // on vérifie que l'identifiant utilisateur du compte correspond bien à l'identifiant de l'utilisateur courant dans le token
        if($account->getUser()->getId() != $currentUser) {
            return new JsonResponse(['message' => 'Vous n\'avez pas accès à ce compte'], JsonResponse::HTTP_FORBIDDEN);
        }

        // récupération des données du front
        $data = json_decode($request->getContent(), true);

        // calcul pour ajouter les nouveaux gains
        $newWallet = $account->getWallet() + $data['gain'];

        // ajout des nouveaux gain à l'entitée
        $account->setWallet($newWallet);

        $this->entityManager->persist($account);
        $this->entityManager->flush();

        return new JsonResponse(['message' =>'Les gains ont étaient enregistré en base de données'],JsonResponse::HTTP_OK);


    }
}
