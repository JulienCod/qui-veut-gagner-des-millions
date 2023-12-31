<?php

namespace App\Entity;

use App\Repository\AccountRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AccountRepository::class)]
class Account
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private int $id;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Le nom ne peut pas être vide")]
    private string $name;

    #[ORM\ManyToMany(targetEntity: Theme::class, inversedBy: 'accounts')]
    private Collection $themeId;

    #[ORM\Column]
    private int $wallet = 0;

    #[ORM\ManyToOne(inversedBy: 'accounts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\OneToMany(mappedBy: 'account_id', targetEntity: Games::class)]
    private Collection $games;

    public function __construct()
    {
        $this->themeId = new ArrayCollection();
        $this->games = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, Theme>
     */
    public function getThemeId(): Collection
    {
        return $this->themeId;
    }

    public function addThemeId(Theme $themeId): static
    {
        if (!$this->themeId->contains($themeId)) {
            $this->themeId->add($themeId);
        }

        return $this;
    }

    public function removeThemeId(Theme $themeId): static
    {
        $this->themeId->removeElement($themeId);

        return $this;
    }

    public function getWallet(): ?int
    {
        return $this->wallet;
    }

    public function setWallet(int $wallet): static
    {
        $this->wallet = $wallet;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection<int, Games>
     */
    public function getGames(): Collection
    {
        return $this->games;
    }

    public function addGame(Games $game): static
    {
        if (!$this->games->contains($game)) {
            $this->games->add($game);
            $game->setAccountId($this);
        }

        return $this;
    }

    public function removeGame(Games $game): static
    {
        if ($this->games->removeElement($game)) {
            // set the owning side to null (unless already changed)
            if ($game->getAccountId() === $this) {
                $game->setAccountId(null);
            }
        }

        return $this;
    }
}
