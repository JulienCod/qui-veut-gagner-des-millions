<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230704204507 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE theme_questions (theme_id INT NOT NULL, questions_id INT NOT NULL, INDEX IDX_441F8E5859027487 (theme_id), INDEX IDX_441F8E58BCB134CE (questions_id), PRIMARY KEY(theme_id, questions_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE theme_questions ADD CONSTRAINT FK_441F8E5859027487 FOREIGN KEY (theme_id) REFERENCES theme (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE theme_questions ADD CONSTRAINT FK_441F8E58BCB134CE FOREIGN KEY (questions_id) REFERENCES questions (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE answers ADD questions_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE answers ADD CONSTRAINT FK_50D0C606BCB134CE FOREIGN KEY (questions_id) REFERENCES questions (id)');
        $this->addSql('CREATE INDEX IDX_50D0C606BCB134CE ON answers (questions_id)');
        $this->addSql('ALTER TABLE games ADD user_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE games ADD CONSTRAINT FK_FF232B319D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_FF232B319D86650F ON games (user_id_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE theme_questions DROP FOREIGN KEY FK_441F8E5859027487');
        $this->addSql('ALTER TABLE theme_questions DROP FOREIGN KEY FK_441F8E58BCB134CE');
        $this->addSql('DROP TABLE theme_questions');
        $this->addSql('ALTER TABLE answers DROP FOREIGN KEY FK_50D0C606BCB134CE');
        $this->addSql('DROP INDEX IDX_50D0C606BCB134CE ON answers');
        $this->addSql('ALTER TABLE answers DROP questions_id');
        $this->addSql('ALTER TABLE games DROP FOREIGN KEY FK_FF232B319D86650F');
        $this->addSql('DROP INDEX IDX_FF232B319D86650F ON games');
        $this->addSql('ALTER TABLE games DROP user_id_id');
    }
}
