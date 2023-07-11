<?php

namespace App\Entity;

use App\Repository\ThemeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: ThemeRepository::class)]
class Theme
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Le nom ne peut pas être vide")]
    private string $name;
    
    #[ORM\Column]
    #[Assert\NotBlank(message: "La valeur du thème ne peut pas être vide")]
    private int $value;
    
    #[ORM\ManyToMany(targetEntity: Questions::class, inversedBy: 'themes',cascade:["persist","remove"])]

    private Collection $questionId;

    #[ORM\ManyToMany(targetEntity: Account::class, mappedBy: 'themeId')]

    private Collection $accounts;

    public function __construct()
    {
        $this->questionId = new ArrayCollection();
        $this->accounts = new ArrayCollection();
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

    public function getValue(): ?int
    {
        return $this->value;
    }

    public function setValue(int $value): static
    {
        $this->value = $value;

        return $this;
    }

    /**
     * @return Collection<int, Questions>
     */
    public function getQuestionId(): Collection
    {
        return $this->questionId;
    }

    public function addQuestionId(Questions $questionId): static
    {
        if (!$this->questionId->contains($questionId)) {
            $this->questionId->add($questionId);
        }

        return $this;
    }

    public function removeQuestionId(Questions $questionId): static
    {
        $this->questionId->removeElement($questionId);

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
            $account->addThemeId($this);
        }

        return $this;
    }

    public function removeAccount(Account $account): static
    {
        if ($this->accounts->removeElement($account)) {
            $account->removeThemeId($this);
        }

        return $this;
    }

}
