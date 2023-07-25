<?php

namespace App\Controller;

use App\Entity\Answers;
use App\Entity\Questions;
use App\Entity\Theme;
use App\Repository\QuestionsRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\RequestStack;

#[Route('/api/questions', name: 'app_questions_')]
class QuestionsController extends AbstractController
{
    private $entityManager;
    private $questionsRepository;
    private $tokenStorage;
    private $validator;
    private $requestStack;
    private $userRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        QuestionsRepository $questionsRepository,
        TokenStorageInterface $tokenStorage,
        ValidatorInterface $validator,
        RequestStack $requestStack,
        UserRepository $userRepository,
    ) {
        $this->entityManager = $entityManager;
        $this->questionsRepository = $questionsRepository;
        $this->tokenStorage = $tokenStorage;
        $this->validator = $validator;
        $this->requestStack = $requestStack;
        $this->userRepository = $userRepository;
    }

    #[Route('/admin/ajout', name: 'admin_add_question', methods: ['POST'])]
    public function add(Request $request): JsonResponse
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

        // récupération des datas du front
        $data = json_decode($request->getContent(), true);

        // création d'un tableau vide pour enregistrer les erreurs
        $errors = [];

        // création d'un tableau vide pour enregistrer les questions
        $createdQuestions = [];

        //bouclé sur les réponses pour enregistrer chaue données une à une
        foreach ($data as $questionData) {
            // recherche le theme
            $theme = $this->entityManager->getRepository(Theme::class)->find($questionData['theme']);
            if (!$theme) {
                $errors[] = 'Le thème demandé n\'existe pas';
                continue;
            }

            // contrôle si la question existe déjà
            $existingQuestion = $this->entityManager->getRepository(Questions::class)->findOneBy(['Question' => $questionData['question']]);
            if (!$existingQuestion) {
                // création d'une question
                $question = new Questions();
                $question->setQuestion($questionData['question']);
                $question->addTheme($theme);
                $question->setChecked(false);

                // valider les données saisi pour la question
                $validationErrors = $this->validator->validate($question);
                if (count($validationErrors) > 0) {
                    $errors[] = 'Erreur de validation pour la question : ' . $questionData['question'];
                    continue;
                }
            } else {
                $errors[] = 'La question existe déjà : ' . $questionData['question'];
                continue;
            }

            foreach ($questionData['answers'] as $answerText) {
                $answer = new Answers();
                $answer->setAnswer($answerText['answer']);
                $answer->setQuestionId($question);
                $answer->setRightAnswer($answerText['correct']);


                $this->entityManager->persist($answer);
                $question->addAnswer($answer);
            }

            $this->entityManager->persist($question);
            $createdQuestions[] = $question;
        }

        $this->entityManager->flush();

        if (count($errors) > 0) {
            return new JsonResponse(['errors' => $errors], JsonResponse::HTTP_BAD_REQUEST);
        }

        return new JsonResponse(['message' => 'Les questions et réponses ont été créées avec succès', 'questions' => $createdQuestions], JsonResponse::HTTP_OK);
    }

    #[Route("/admin/delete/{id}", name:"admin_delete", methods:['DELETE'])]
    public function deleteQuestion($id): JsonResponse
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

        // récupération de la question avec l'identifiant passé en parametre
        $question = $this->questionsRepository->find($id);
        // controle si la question est présente en base de données
        if (!$question) {
            return new JsonResponse(['message' => "La question demandé n'existe pas"], JsonResponse::HTTP_NOT_FOUND);
        }

        //suppresion de la question en base de données
        $this->entityManager->remove($question);
        $this->entityManager->flush();

        return new JsonResponse(['message' => "La question a bien été supprimé"], JsonResponse::HTTP_OK);
    }

    #[Route("/admin/update/{id}", name: "admin_update", methods: ['PUT', 'POST'])]
    public function updateQuestion($id, Request $request): JsonResponse
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

        // Récupération de la question avec l'identifiant passé en paramètre
        $question = $this->questionsRepository->find($id);
        // Contrôle si la question est présente en base de données
        if (!$question) {
            return new JsonResponse(['message' => "La question demandée n'existe pas"], JsonResponse::HTTP_NOT_FOUND);
        }

        // Récupération des données du front
        $data = json_decode($request->getContent(), true);
        $errors = [];

        // Modification de la question
        $question->setQuestion($data['question']);
        // $question->setChecked($data['checked']);

        $validationErrors = $this->validator->validate($question);
        if (count($validationErrors) > 0) {
            $errors[] = 'Erreur de validation pour la question : ' . $data['question'];
        }

        foreach ($question->getAnswers() as $answer) {
            foreach ($data['answers'] as $answerData) {
                // Vérifier si l'ID de la réponse correspond à celui trouvé dans $data['answers']
                if ($answer->getId() === $answerData['id']) {
                    // Mettre à jour la réponse avec les nouvelles données
                    $answer->setAnswer($answerData['answer']);
                    $answer->setRightAnswer($answerData['correct']);
                    // Enregistrer les modifications dans l'EntityManager
                    $this->entityManager->persist($answer);
                }
            }
        }

        $this->entityManager->persist($question);
        $this->entityManager->flush();

        if (count($errors) > 0) {
            return new JsonResponse(['errors' => $errors], JsonResponse::HTTP_BAD_REQUEST);
        }

        return new JsonResponse(['message' => 'La question et les réponses ont été modifiées avec succès'], JsonResponse::HTTP_OK);
    }
}