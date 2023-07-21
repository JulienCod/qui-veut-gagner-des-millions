<?php

namespace App\Controller;

use App\Entity\Account;
use App\Repository\AccountRepository;
use App\Repository\ThemeRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RequestStack;

#[Route('/api/account', name: 'app_account_')]
class AccountController extends AbstractController
{
    private $entityManager;
    private $accountRepository;
    private $userRepository;
    private $validator;
    private $requestStack;
    private $themeRepository;
    public function __construct(
        EntityManagerInterface $entityManager,
        AccountRepository $accountRepository,
        UserRepository $userRepository,
        ValidatorInterface $validator,
        RequestStack $requestStack,
        ThemeRepository $themeRepository,
    ) {
        $this->entityManager = $entityManager;
        $this->accountRepository = $accountRepository;
        $this->userRepository = $userRepository;
        $this->validator = $validator;
        $this->requestStack = $requestStack;
        $this->themeRepository = $themeRepository;
    }
    #[Route('/create', name: 'app_account_create', methods:['POST'])]
    public function create(Request $request): JsonResponse
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

        // récupération des données de création d'un compte
        $data = json_decode($request->getContent(), true);

        //création d'un nouveau compte
        $account = new Account();
        $account->setName($data['account']);
        $account->setWallet(0);
        $account->setUser($user);

        // recherche du thème numéro 1 pour l'ajout par défault
        $theme = $this->themeRepository->find(1);
        $account->addThemeId($theme);

        //validation des données du compte
        $errors = $this->validator->validate($account);
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

        return new JsonResponse(['message' => 'Le compte a été créé avec succès','account'=>$account->getName()], JsonResponse::HTTP_OK);
    }

    #[Route('/user', name: 'user', methods:['GET'])]
    public function getAccountByUser(): JsonResponse
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

        //créé un tableau de tout les comptes présent pour l'utilisateur
        $accounts = $user->getAccounts()->toArray();

        // création d'un tableau vide pour récupérer les informations de chaque comptes
        $accountDatas = [];

        // parcours le tableau de comptes pour enregistrer les informations
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

        // retour les comptes au front
        return new JsonResponse($accountDatas, JsonResponse::HTTP_OK);
    }

    #[Route("/{id}", name: "id", methods: ['GET'])]
    public function accountId(
        $id,
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

        //créé un tableau de tout les comptes présent pour l'utilisateur
        $accounts = $user->getAccounts()->toArray();
        // parcours le tableau de comptes pour enregistrer les informations
        foreach ($accounts as $account) {

            // Vérifier si l'utilisateur courant est le propriétaire du compte
            if ($account->getId() == $id) {

                // Récupérer les informations du compte
                $data = $this->accountRepository->find($id);
                $accountInfo = [
                    "id" => $account->getId(),
                    "name" => $data->getName(),
                    "wallet" => $data->getWallet(),
                ];

                // Récupérer tous les thèmes
                $dataThemes = $this->themeRepository->findAll();

                // créé un tableau vide pour enregistré les informations des thèmes
                $themes = [];

                // parcours chaque thèmes pour récupérer les informations du thème
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
                $accountInfo['themes'] = $themes;
                // Récupérer les jeux associés à ce compte
                $games = [];
                foreach ($account->getGames() as $datagame) {
                    $themeAssociated = $datagame->getThemeId();
                    $games[] = [
                        "id" => $datagame->getId(),
                        "date" => $datagame->getCreatedAt()->format('Y-m-d h:i:s'),
                        "correct_answers_count" => $datagame->getCorrectAnswersCount(),
                        "gain" => $datagame->getGain(),
                        "used_jokers__count" => $datagame->getUsedJokersCount(),
                        "theme_id" => [
                            "name" => $themeAssociated->getName(),
                        ],
                    ];
                }
                $accountInfo['games'] = $games;

                return new JsonResponse($accountInfo, JsonResponse::HTTP_OK);

            }
        }
    }

    #[Route("/gain/{id}", name:"gain_account", methods:['POST'])]
    public function gainAccount(
        $id,
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

        // récupération du compte avec l'identition passé en parametre
        $account = $this->accountRepository->find($id);

        // contrôle si le compte existe
        if (!$account) {
            return new JsonResponse(["message" => "Le compte n\'existe pas"], JsonResponse::HTTP_NOT_FOUND);
        }

        // on vérifie que l'identifiant utilisateur du compte correspond bien à l'identifiant de l'utilisateur courant dans le token
        if($account->getUser()->getId() != $user->getId()) {
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

        return new JsonResponse(['message' =>'Les gains ont étaient enregistré en base de données'], JsonResponse::HTTP_OK);

    }

    #[Route("/delete/{id}", name: "delete_account", methods:['DELETE'])]
    public function deleteAccount ($id): JsonResponse
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

        // recherche du compte dans la base de données
        $account = $this->accountRepository->find($id);

        // contrôle si le compte existe
        if(!$account) {
            return new JsonResponse(['message' => 'Le compte n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }

        // on vérifie que l'identifiant utilisateur du compte correspond bien à l'identifiant de l'utilisateur courant dans le token
        if($account->getUser()->getId() != $user->getId()) {
            return new JsonResponse(['message' => 'Vous n\'avez pas accès à ce compte'], JsonResponse::HTTP_FORBIDDEN);
        }

        $this->entityManager->remove($account);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Le compte a été supprimer avec succès'], JsonResponse::HTTP_OK);
    }
}
