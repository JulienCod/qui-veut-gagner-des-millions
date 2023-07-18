<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230717143032 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE account DROP FOREIGN KEY FK_7D3656A4E48FD905');
        $this->addSql('DROP INDEX IDX_7D3656A4E48FD905 ON account');
        $this->addSql('ALTER TABLE account DROP game_id');
        $this->addSql('ALTER TABLE games ADD account_id_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE games ADD CONSTRAINT FK_FF232B3149CB4726 FOREIGN KEY (account_id_id) REFERENCES account (id)');
        $this->addSql('CREATE INDEX IDX_FF232B3149CB4726 ON games (account_id_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE account ADD game_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE account ADD CONSTRAINT FK_7D3656A4E48FD905 FOREIGN KEY (game_id) REFERENCES games (id)');
        $this->addSql('CREATE INDEX IDX_7D3656A4E48FD905 ON account (game_id)');
        $this->addSql('ALTER TABLE games DROP FOREIGN KEY FK_FF232B3149CB4726');
        $this->addSql('DROP INDEX IDX_FF232B3149CB4726 ON games');
        $this->addSql('ALTER TABLE games DROP account_id_id');
    }
}
