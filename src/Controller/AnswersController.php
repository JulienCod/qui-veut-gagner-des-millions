<?php

namespace App\Controller;

use App\Entity\Answers;
use App\Entity\Questions;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

    #[Route('/api/answers', name: 'api_answers_', methods: ['POST'])]
class AnswersController extends AbstractController
{
    private $entityManager;

    public function __construct(
        EntityManagerInterface $entityManager,
    ){
        $this->entityManager = $entityManager;
    }
        #[Route('/ajout', name: 'add', methods: ['POST'])]
        public function add(Request $request, ValidatorInterface $validator): JsonResponse
        {
            // Récupération des données JSON du corps de la requête
            $jsonData = json_decode($request->getContent(), true);

            // Vérification si les données JSON sont valides
            if ($jsonData === null) {
                return new JsonResponse(['message' => 'Format JSON invalide'], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Création d'un tableau pour stocker les réponses ajoutées
            $addedAnswers = [];

            // Boucle pour traiter chaque réponse
            foreach ($jsonData as $answerData) {
                // Création d'une nouvelle réponse
                $answer = new Answers();
                $answer->setAnswer($answerData['answer']);
                $answer->setRightAnswer($answerData['isRightAnswer']);

                // Récupération de la question
                $question = $this->entityManager->getRepository(Questions::class)->find($answerData['question']);
                $answer->setQuestionId($question);

                // Ajout de la réponse au tableau des réponses ajoutées
                $addedAnswers[] = $answer;
            }

            // Validation globale du tableau des réponses ajoutées
            $errors = $validator->validate($addedAnswers);

            if (count($errors) > 0) {
                // Il y a des erreurs de validation
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                return new JsonResponse(['message' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Persist et flush des réponses ajoutées
            foreach ($addedAnswers as $answer) {
                $this->entityManager->persist($answer);
            }
            $this->entityManager->flush();

            return new JsonResponse(['message' => 'Réponses ajoutées avec succès', 'answers' => $addedAnswers], JsonResponse::HTTP_CREATED);
        }
}
