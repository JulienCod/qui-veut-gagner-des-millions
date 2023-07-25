<?php 

namespace App\Service;

use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
class SendMailService
{
    private $mailer;

     public function __construct(MailerInterface $mailer){
        $this->mailer = $mailer;
    }

    public function send(
        string $from,
        string $to,
        string $subject,
        string $template,
        array $context,
    ): void
    {
        // création du mail
        $email = (new TemplatedEmail())
            ->from($from) // de qui vient le message
            ->to($to)   // pour qui est le message
           ->subject($subject) // sujet du message
            ->htmlTemplate("email/$template.html.twig") // template
            ->context($context); // context du message

        // envoie du mail
        $this->mailer->send($email);
    }


}