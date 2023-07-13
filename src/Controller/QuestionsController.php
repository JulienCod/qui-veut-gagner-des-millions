<?php

namespace App\Controller;

use App\Entity\Answers;
use App\Entity\Questions;
use App\Entity\Theme;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\Response\JsonMockResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/questions', name: 'app_questions_')]
class QuestionsController extends AbstractController
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
        $data = json_decode($request->getContent(), true);

        $errors = [];
        $createdQuestions = [];
        
        foreach ($data as $questionData) {
            $theme = $this->entityManager->getRepository(Theme::class)->find($questionData['theme']);

            if (!$theme) {
                $errors[] = 'Le thème demandé n\'existe pas';
                continue;
            }

            $question = new Questions();
            $question->setQuestion($questionData['question']);
            $question->addTheme($theme);

            $validationErrors = $validator->validate($question);
            if (count($validationErrors) > 0) {
                $errors[] = 'Erreur de validation pour la question : ' . $questionData['question'];
                continue;
            }

            $existingQuestion = $this->entityManager->getRepository(Questions::class)->findOneBy(['Question' => $questionData['question']]);
            if ($existingQuestion) {
                $errors[] = 'La question existe déjà : ' . $questionData['question'];
                continue;
            }

            foreach ($questionData['answers'] as $index => $answerText) {
                $answer = new Answers();
                $answer->setAnswer($answerText);
                $answer->setQuestionId($question);

                if ($index === $questionData['correctAnswer']) {
                    $answer->setRightAnswer(true);
                }else{
                    $answer->setRightAnswer(false);
                }

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


}
