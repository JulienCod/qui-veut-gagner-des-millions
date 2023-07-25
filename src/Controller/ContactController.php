<?php

namespace App\Controller;

use App\Service\SendMailService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints as Assert;

class ContactController extends AbstractController
{
    #[Route('/api/contact', name: 'app_contact', methods:['POST'])]
    public function Contact(
        Request $request,
        SendMailService $mail,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Définir les contraintes de validation pour chaque champ
        $constraints = new Assert\Collection([
            'email' => [
                new Assert\NotBlank(),
                new Assert\Email(),
            ],
            'subject' => new Assert\NotBlank(),
            'message' => new Assert\NotBlank(),
        ]);

        // Valider les données avec le validateur Symfony
        $validator = Validation::createValidator();
        $violations = $validator->validate($data, $constraints);

        if (count($violations) > 0) {
            // Il y a des erreurs de validation, renvoyer un message d'erreur
            $errors = [];
            foreach ($violations as $violation) {
                $errors[$violation->getPropertyPath()] = $violation->getMessage();
            }
            return new JsonResponse(['errors' => $errors], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Données valides, envoyer l'e-mail en toute sécurité
        // Utilisez la fonction strip_tags pour supprimer les balises HTML indésirables
        $sanitizedMessage = strip_tags($data['message']);

        $mail->send(
            $data['email'],
            'contact-qui-veut-gagner-des-millions@julien-webandco.fr',
            $data['subject'],
            'contact',
            ["message" => $sanitizedMessage]
        );

        return new JsonResponse(['message' => 'Votre email a été envoyé avec succès. Nous vous répondrons dès que possible.'], JsonResponse::HTTP_OK);
    }
}