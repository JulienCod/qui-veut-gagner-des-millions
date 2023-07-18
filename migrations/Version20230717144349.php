<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230717144349 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE games_theme DROP FOREIGN KEY FK_6865F5B497FFC673');
        $this->addSql('ALTER TABLE games_theme DROP FOREIGN KEY FK_6865F5B459027487');
        $this->addSql('DROP TABLE games_theme');
        $this->addSql('ALTER TABLE games ADD theme_id_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE games ADD CONSTRAINT FK_FF232B31276615B2 FOREIGN KEY (theme_id_id) REFERENCES theme (id)');
        $this->addSql('CREATE INDEX IDX_FF232B31276615B2 ON games (theme_id_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE games_theme (games_id INT NOT NULL, theme_id INT NOT NULL, INDEX IDX_6865F5B497FFC673 (games_id), INDEX IDX_6865F5B459027487 (theme_id), PRIMARY KEY(games_id, theme_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE games_theme ADD CONSTRAINT FK_6865F5B497FFC673 FOREIGN KEY (games_id) REFERENCES games (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE games_theme ADD CONSTRAINT FK_6865F5B459027487 FOREIGN KEY (theme_id) REFERENCES theme (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE games DROP FOREIGN KEY FK_FF232B31276615B2');
        $this->addSql('DROP INDEX IDX_FF232B31276615B2 ON games');
        $this->addSql('ALTER TABLE games DROP theme_id_id');
    }
}
