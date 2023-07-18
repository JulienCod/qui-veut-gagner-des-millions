<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230717142708 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE account_games DROP FOREIGN KEY FK_C9ACF24097FFC673');
        $this->addSql('ALTER TABLE account_games DROP FOREIGN KEY FK_C9ACF2409B6B5FBA');
        $this->addSql('DROP TABLE account_games');
        $this->addSql('ALTER TABLE account ADD game_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE account ADD CONSTRAINT FK_7D3656A4E48FD905 FOREIGN KEY (game_id) REFERENCES games (id)');
        $this->addSql('CREATE INDEX IDX_7D3656A4E48FD905 ON account (game_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE account_games (account_id INT NOT NULL, games_id INT NOT NULL, INDEX IDX_C9ACF2409B6B5FBA (account_id), INDEX IDX_C9ACF24097FFC673 (games_id), PRIMARY KEY(account_id, games_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE account_games ADD CONSTRAINT FK_C9ACF24097FFC673 FOREIGN KEY (games_id) REFERENCES games (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE account_games ADD CONSTRAINT FK_C9ACF2409B6B5FBA FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE account DROP FOREIGN KEY FK_7D3656A4E48FD905');
        $this->addSql('DROP INDEX IDX_7D3656A4E48FD905 ON account');
        $this->addSql('ALTER TABLE account DROP game_id');
    }
}
