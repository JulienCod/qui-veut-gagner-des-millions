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

    #[ORM\ManyToMany(targetEntity: Account::class, mappedBy: 'games')]
    private Collection $accounts;

    #[ORM\ManyToMany(targetEntity: Theme::class, inversedBy: 'games')]
    private Collection $themes;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?int $used_jokers_count = null;

    public function __construct()
    {
        $this->accounts = new ArrayCollection();
        $this->themes = new ArrayCollection();
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

    /**
     * @return Collection<int, Account>
     */
    public function getAccounts(): Collection
    {
        return $this->accounts;
    }

    public function addAccount(Account $account): static
    {
        if (!$this->accounts->contains($account)) {
            $this->accounts->add($account);
            $account->addGame($this);
        }

        return $this;
    }

    public function removeAccount(Account $account): static
    {
        if ($this->accounts->removeElement($account)) {
            $account->removeGame($this);
        }

        return $this;
    }

    /**
     * @return Collection<int, Theme>
     */
    public function getThemes(): Collection
    {
        return $this->themes;
    }

    public function addTheme(Theme $theme): static
    {
        if (!$this->themes->contains($theme)) {
            $this->themes->add($theme);
        }

        return $this;
    }

    public function removeTheme(Theme $theme): static
    {
        $this->themes->removeElement($theme);

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

}
