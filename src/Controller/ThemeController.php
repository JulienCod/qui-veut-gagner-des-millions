<?php

namespace App\Controller;

use App\Entity\Theme;
use App\Repository\ThemeRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
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
    )
    {
        $this->themeRepository = $themeRepository;
        $this->tokenStorage = $tokenStorage;
        $this->entityManager = $entityManager;
    }
    #[Route('/ajout', name: 'add', methods: ['POST'])]
    public function addTheme(
        Request $request,
        ValidatorInterface $validator,
    ): JsonResponse
    {
        // récupération des données de création d'un thème
        $data = json_decode($request->getContent(),true);

        // création d'un nouveau thème
        $theme = new Theme();
        $theme->setName($data['name']);
        $theme->setValue($data['value']);

        //valider les données du theme
        $errors = $validator->validate($theme);
        if (count($errors) > 0){
            // il y a des erreurs de validation
            $errorsMessages = [];
            foreach ($errorsMessages as $error){
                $errorMessage = $error->getMessage();
            }
            return new JsonResponse(['message' => $errorMessage], JsonResponse::HTTP_BAD_REQUEST);
        }

        // vérifier si le theme existe déjà
        $existingTheme = $this->themeRepository->findOneBy(['name' => $data['name']]);
        if ($existingTheme){
            //le theme existe déjà, renvoi une réponse d'erreur
            return new JsonResponse(['message' => 'Le theme existe déjà'], JsonResponse::HTTP_CONFLICT);
        }

        //enregistrer le theme dans la base de données
        $this->entityManager->persist($theme);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Le thème a été créé avec succès'], JsonResponse::HTTP_OK);
    }

    #[Route('/get/{id}', name: 'show', methods: ['GET'])]
    public function getTheme(
        $id,
        UserRepository $userRepository
    ): JsonResponse {
        // recherche du theme par l'identifiant passé en paramètre
        $theme = $this->themeRepository->find($id);
        if (!$theme) {
            return $this->json(['message' => 'Le thème demandé n\'existe pas'], JsonResponse::HTTP_NOT_FOUND);
        }

        // récupération de l'identifiant de l'utilisateur courant par le token
        $currentUser = $this->tokenStorage->getToken()->getUser()->getId();

        // on recherche les informations de l'utilisateur dans la base de données
        $user = $userRepository->find($currentUser);

        // Création d'un tableau d'identifiants de thèmes accessibles par l'utilisateur
        $themeIds = $user->getThemeId()->map(fn($theme) => $theme->getId())->toArray();

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
    #[Route('/getAll', name: 'getAll', methods: ['GET'])]
    public function getAll(): JsonResponse
    {
        $currentUser = $this->tokenStorage->getToken()->getUser()->getId();
        $datas = $this->themeRepository->findAll();;
        $themes = [];
        foreach ($datas as $data) {
            $users = [];
            foreach ($data->getUsers() as $user) {
                $users[] = [
                    'id' => $user->getId()
                ];
            }
            $isActive = in_array($currentUser, array_column($users, 'id'));
            $themes[] = [
                'id' => $data->getId(),
                'name' => $data->getName(),
                'value' => $data->getValue(),
                'actif' => $isActive,
            ];
        }
        return new JsonResponse(['themes' => $themes], JsonResponse::HTTP_OK);
    }

    #[Route('/delete/{id}',name:'delete', methods:['DELETE'])]
    public function delete($id):JsonResponse
    {
        $theme = $this->entityManager->getRepository(Theme::class)->find($id);
        if (!$theme){
            return new JsonResponse(['message' => 'Le thème demandé n\'a pas été trouvé'], JsonResponse::HTTP_NOT_FOUND);
        }
        $this->entityManager->remove($theme);
        $this->cache->invalidateTags(["themes_all"]);

        return new JsonResponse(null, JsonResponse::HTTP_OK);
    }
}
