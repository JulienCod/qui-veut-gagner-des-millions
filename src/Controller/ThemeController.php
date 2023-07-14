<?php

namespace App\Controller;

use App\Entity\Theme;
use App\Repository\AccountRepository;
use App\Repository\ThemeRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/theme', name: 'app_theme_')]
class ThemeController extends AbstractController
{
    private $themeRepository;
    private $tokenStorage;
    private $entityManager;
    public function __construct(
        ThemeRepository $themeRepository,
        TokenStorageInterface $tokenStorage,
        EntityManagerInterface $entityManager,
    ) {
        $this->themeRepository = $themeRepository;
        $this->tokenStorage = $tokenStorage;
        $this->entityManager = $entityManager;
    }
    #[Route('/admin/ajout', name: 'admin_add', methods: ['POST'])]
    public function addTheme(
        Request $request,
        ValidatorInterface $validator,
    ): JsonResponse {
        $currentUser = $this->tokenStorage->getToken()->getUser()->getRoles()[0];
        if ($currentUser != 'ROLE_ADMIN') {
            return new JsonResponse(["message" => "Vous n'êtes pas autorisé à ajouter des thèmes"], JsonResponse::HTTP_FORBIDDEN);
        }
        // récupération des données de création d'un thème
        $data = json_decode($request->getContent(), true);

        // création d'un nouveau thème
        $theme = new Theme();
        $theme->setName($data['name']);
        $theme->setValue($data['value']);

        //valider les données du theme
        $errors = $validator->validate($theme);
        if (count($errors) > 0) {
            // il y a des erreurs de validation
            $errorsMessages = [];
            foreach ($errorsMessages as $error) {
                $errorMessage = $error->getMessage();
            }
            return new JsonResponse(['message' => $errorMessage], JsonResponse::HTTP_BAD_REQUEST);
        }

        // vérifier si le theme existe déjà
        $existingTheme = $this->themeRepository->findOneBy(['name' => $data['name']]);
        if ($existingTheme) {
            //le theme existe déjà, renvoi une réponse d'erreur
            return new JsonResponse(['message' => 'Le theme existe déjà'], JsonResponse::HTTP_CONFLICT);
        }

        //enregistrer le theme dans la base de données
        $this->entityManager->persist($theme);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Le thème a été créé avec succès'], JsonResponse::HTTP_OK);
    }

    #[Route('/game/get/{id}', name: 'showGame', methods: ['GET'])]
    public function getTheme(
        $id,
        Request $request,
        AccountRepository $accountRepository,
    ): JsonResponse {
        // récupération de l'identifiant du compte passé en paramètre
        $accountId = $request->query->get('accountId');
        // recherche du compte dans la base de données
        $account = $accountRepository->find($accountId);

        // contrôle si le compte existe
        if(!$account){
            return new JsonResponse(['message' => 'Le compte n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }

        // récupération de l'identifiant de l'utilisateur courant par le token
        $currentUser = $this->tokenStorage->getToken()->getUser()->getId();

        // on vérifie que l'identifiant utilisateur du compte correspond bien à l'identifiant de l'utilisateur courant dans le token
        if($account->getUser()->getId() != $currentUser) {
            return new JsonResponse(['message' => 'Vous n\'avez pas accès à ce compte'], JsonResponse::HTTP_FORBIDDEN);
        }

        // recherche du theme par l'identifiant passé en paramètre
        $theme = $this->themeRepository->find($id);
        if (!$theme) {
            return $this->json(['message' => 'Le thème demandé n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }
        // Création d'un tableau d'identifiants de thèmes accessibles par l'utilisateur
        $themeIds = $account->getThemeId()->map(fn ($theme) => $theme->getId())->toArray();

        // Contrôle que l'utilisateur a accès au thème
        if (!in_array($id, $themeIds)) {
            return $this->json(['message' => 'Vous n\'avez pas accès à ce thème'], JsonResponse::HTTP_FORBIDDEN);
        }

        // récupérer toutes les questions du thème
        $questions = $theme->getQuestionId()->toArray();

        // compter le nombre total de questions
        $totalQuestions = count($questions);
        // choisir aléatoirement 15 questions (ou moins si le nombre total est inférieur à 15)
        $randomQuestions = [];
        if ($totalQuestions > 0) {
            $randomIndexes = array_rand($questions, min(15, $totalQuestions));
            foreach ($randomIndexes as $index) {
                $randomQuestions[] = $questions[$index];
            }
        }

        // formater les données des questions et des réponses
        $questionsWithAnswers = [];
        foreach ($randomQuestions as $question) {
            $questionData = [
                'question' => $question->getQuestion(),
                'answers' => []
            ];

            foreach ($question->getAnswers() as $answer) {
                $answerData = [
                    'answer' => $answer->getAnswer(),
                    'correct' => $answer->isRightAnswer()
                ];
                $questionData['answers'][] = $answerData;
            }

            +// Mélanger l'ordre des réponses
            shuffle($questionData['answers']);
            $questionsWithAnswers[] = $questionData;
        }

        return new JsonResponse($questionsWithAnswers, JsonResponse::HTTP_OK);
    }
    #[Route('/game/getAll', name: 'gameGetAll', methods: ['GET'])]
    public function getAllAccountID(
        AccountRepository $accountRepository,
        Request $request): JsonResponse
    {

        // récupération de l'identifiant du compte passé en paramètre
        $accountId = $request->query->get('accountId');
        // récupération de l'identifiant de l'utilisateur courant dans le token
        $currentUser = $this->tokenStorage->getToken()->getUser()->getId();
        // récupération du profil passé en paramètre
        $account = $accountRepository->find($accountId);

        // si le profil n'existe pas
        if(!$account){
            return new JsonResponse(['message' => 'Le profil demandé n\existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }

        // on vérifie que l'identifiant utilisateur du compte correspond bien à l'identifiant de l'utilisateur courant dans le token
        if($account->getUser()->getId() != $currentUser) {
            return new JsonResponse(['message' => 'Vous n\'avez pas accès à ce compte'], JsonResponse::HTTP_FORBIDDEN);
        }

        $datas = $this->themeRepository->findAll();
        $themes = [];
        foreach ($datas as $data) {
            $accounts = [];
            foreach ($data->getAccounts() as $account) {
                $accounts[] = [
                    'id' => $account->getId()
                ];
            }
            $isActive = in_array($currentUser, array_column($accounts, 'id'));
            $themes[] = [
                'id' => $data->getId(),
                'name' => $data->getName(),
                'value' => $data->getValue(),
                'actif' => $isActive,
            ];
        }
        return new JsonResponse(['themes' => $themes], JsonResponse::HTTP_OK);
    }

    #[Route('/admin/delete/{id}', name:'delete', methods:['DELETE'])]
    public function delete($id): JsonResponse
    {
        $theme = $this->entityManager->getRepository(Theme::class)->find($id);
        if (!$theme) {
            return new JsonResponse(['message' => 'Le thème demandé n\'a pas été trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }
        $this->entityManager->remove($theme);

        return new JsonResponse(null, JsonResponse::HTTP_OK);
    }

    #[Route("/buy/{id}", name:"buy", methods:['POST'])]
    public function buy(
        $id,
        Request $request,
        AccountRepository $accountRepository
    ): JsonResponse {
        // récupération du thème
        $theme = $this->themeRepository->find($id);

        // contrôle si le thème existe
        if (!$theme) {
            return new JsonResponse(['message' => 'Le thème n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }

        // récupération de l'identifiant de l'utilisateur courant présent dans le token
        $currentUser = $this->tokenStorage->getToken()->getUser()->getId();

        // récupération des datas envoyé par le front
        $data = json_decode($request->getContent(), true);

        // on récupére le compte à partir de la requête du front
        $account = $accountRepository->find($data['profileId']);

        // on vérifie que le compte existe en base de données
        if(!$account) {
            return new JsonResponse(['message' => 'Le compte n\'éxiste pas'], JsonResponse::HTTP_NOT_FOUND);
        }

        // on vérifie que l'identifiant utilisateur du compte correspond bien à l'identifiant de l'utilisateur courant dans le token
        if($account->getUser()->getId() != $currentUser) {
            return new JsonResponse(['message' => 'Vous n\'avez pas accès à ce compte'], JsonResponse::HTTP_FORBIDDEN);
        }

        // si le compte ne dispose pas de suffisament d'argent l'achat ne peut pas être effectué
        if($account->getWallet() < $theme->getValue()) {
            return new JsonResponse(['message' => 'Vous n\'avez pas assez d\'argent pour acheter ce thème'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Vérifier si le compte dispose déjà du thème
        $themes = $account->getThemeId();
        if ($themes->contains($theme)) {
            return new JsonResponse(['message' => 'Le compte dispose déjà de ce thème'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // calcul du reste du solde pour le profil
        $newWallet = $account->getWallet() - $theme->getValue();

        // ajouter le thème au compte
        $account->addThemeId($theme);

        // mettre à jour le solde du compte
        $account->setWallet($newWallet);

        $this->entityManager->persist($account);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Achat du thème bien effectué'], JsonResponse::HTTP_OK);
    }

    #[Route("/getAll", name:"getAll", methods:['GET'])]
    public function getAll(): JsonResponse
    {
        $datas = $this->themeRepository->findAll();
        $themes = [];
        foreach ($datas as $data){
            $theme = [
                "id" => $data->getId(),
                "name" => $data->getName(),
            ];
            $themes[] = $theme;
        }
        return new JsonResponse(['themes' => $themes], JsonResponse::HTTP_OK);
    }

    #[Route("/admin/get/{id}", name:"getAdmin", methods:['GET'])]
    public function adminGetId(
        $id,
    ): JsonResponse
    {
        $currentUser = $this->tokenStorage->getToken()->getUser()->getRoles()[0];
        if ($currentUser != 'ROLE_ADMIN') {
            return new JsonResponse(["message" => 'Vous n\êtes pas autorisé à accéder à ce contenu'],JsonResponse::HTTP_FORBIDDEN);
        }

        $theme = $this->themeRepository->find($id);

        if (!$theme) {
            return new JsonResponse(['message' => 'Le thème demandé n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        $questions = [];
        foreach ($theme->getQuestionId() as $question) {
            $questionData = [
                'question' => $question->getQuestion(),
                'answers' => []
            ];
    
            foreach ($question->getAnswers() as $answer) {
                $answerData = [
                    'answer' => $answer->getAnswer(),
                    'correct' => $answer->isRightAnswer()
                ];
                $questionData['answers'][] = $answerData;
            }
    
            $questions[] = $questionData;
        }
    
        return new JsonResponse($questions, JsonResponse::HTTP_OK);
    }
}