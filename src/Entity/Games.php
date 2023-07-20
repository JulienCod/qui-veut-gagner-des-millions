<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\GamesRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

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

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?int $used_jokers_count = null;

    #[ORM\ManyToOne(inversedBy: 'games')]
    private ?Account $account_id = null;

    #[ORM\ManyToOne(inversedBy: 'games')]
    private ?Theme $theme_id = null;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }

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

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUsedJokersCount(): ?int
    {
        return $this->used_jokers_count;
    }

    public function setUsedJokersCount(int $used_jokers_count): static
    {
        $this->used_jokers_count = $used_jokers_count;

        return $this;
    }

    public function getAccountId(): ?Account
    {
        return $this->account_id;
    }

    public function setAccountId(?Account $account_id): static
    {
        $this->account_id = $account_id;

        return $this;
    }

    public function getThemeId(): ?Theme
    {
        return $this->theme_id;
    }

    public function setThemeId(?Theme $theme_id): static
    {
        $this->theme_id = $theme_id;

        return $this;
    }

}
