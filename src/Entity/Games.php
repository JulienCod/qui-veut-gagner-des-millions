<?php

namespace App\Entity;

use App\Repository\GamesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GamesRepository::class)]
class Games
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $Correct_Answers_Count = null;

    #[ORM\Column]
    private ?int $Gain = null;

    #[ORM\ManyToOne(inversedBy: 'games')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $userId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCorrectAnswersCount(): ?int
    {
        return $this->Correct_Answers_Count;
    }

    public function setCorrectAnswersCount(int $Correct_Answers_Count): static
    {
        $this->Correct_Answers_Count = $Correct_Answers_Count;

        return $this;
    }

    public function getGain(): ?int
    {
        return $this->Gain;
    }

    public function setGain(int $Gain): static
    {
        $this->Gain = $Gain;

        return $this;
    }

    public function getUserId(): ?User
    {
        return $this->userId;
    }

    public function setUserId(?User $userId): static
    {
        $this->userId = $userId;

        return $this;
    }
}
