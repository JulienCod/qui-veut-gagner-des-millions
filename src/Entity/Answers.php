<?php

namespace App\Entity;

use App\Repository\AnswersRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AnswersRepository::class)]
class Answers
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $Answer;

    #[ORM\Column]
    private bool $Right_answer;

    #[ORM\ManyToOne(inversedBy: 'answers')]
    #[ORM\JoinColumn(nullable: false)]
    private Questions $Question_id;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAnswer(): ?string
    {
        return $this->Answer;
    }

    public function setAnswer(string $Answer): static
    {
        $this->Answer = $Answer;

        return $this;
    }

    public function isRightAnswer(): ?bool
    {
        return $this->Right_answer;
    }

    public function setRightAnswer(bool $Right_answer): static
    {
        $this->Right_answer = $Right_answer;

        return $this;
    }

    public function getQuestionId(): ?Questions
    {
        return $this->Question_id;
    }

    public function setQuestionId(?Questions $Question_id): static
    {
        $this->Question_id = $Question_id;

        return $this;
    }
}
