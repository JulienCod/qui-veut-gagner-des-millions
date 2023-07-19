<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230718192503 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE account (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, name VARCHAR(255) NOT NULL, wallet INT NOT NULL, INDEX IDX_7D3656A4A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE account_theme (account_id INT NOT NULL, theme_id INT NOT NULL, INDEX IDX_A1FA3E799B6B5FBA (account_id), INDEX IDX_A1FA3E7959027487 (theme_id), PRIMARY KEY(account_id, theme_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE answers (id INT AUTO_INCREMENT NOT NULL, question_id_id INT NOT NULL, answer VARCHAR(255) NOT NULL, right_answer TINYINT(1) NOT NULL, INDEX IDX_50D0C6064FAF8F53 (question_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE games (id INT AUTO_INCREMENT NOT NULL, account_id_id INT DEFAULT NULL, theme_id_id INT DEFAULT NULL, correct_answers_count INT NOT NULL, gain INT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', used_jokers_count INT NOT NULL, INDEX IDX_FF232B3149CB4726 (account_id_id), INDEX IDX_FF232B31276615B2 (theme_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE questions (id INT AUTO_INCREMENT NOT NULL, question VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE refresh_tokens (id INT AUTO_INCREMENT NOT NULL, refresh_token VARCHAR(128) NOT NULL, username VARCHAR(255) NOT NULL, valid DATETIME NOT NULL, UNIQUE INDEX UNIQ_9BACE7E1C74F2195 (refresh_token), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE theme (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, value INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE theme_questions (theme_id INT NOT NULL, questions_id INT NOT NULL, INDEX IDX_441F8E5859027487 (theme_id), INDEX IDX_441F8E58BCB134CE (questions_id), PRIMARY KEY(theme_id, questions_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', password VARCHAR(255) NOT NULL, reset_password_token VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE account ADD CONSTRAINT FK_7D3656A4A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE account_theme ADD CONSTRAINT FK_A1FA3E799B6B5FBA FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE account_theme ADD CONSTRAINT FK_A1FA3E7959027487 FOREIGN KEY (theme_id) REFERENCES theme (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE answers ADD CONSTRAINT FK_50D0C6064FAF8F53 FOREIGN KEY (question_id_id) REFERENCES questions (id)');
        $this->addSql('ALTER TABLE games ADD CONSTRAINT FK_FF232B3149CB4726 FOREIGN KEY (account_id_id) REFERENCES account (id)');
        $this->addSql('ALTER TABLE games ADD CONSTRAINT FK_FF232B31276615B2 FOREIGN KEY (theme_id_id) REFERENCES theme (id)');
        $this->addSql('ALTER TABLE theme_questions ADD CONSTRAINT FK_441F8E5859027487 FOREIGN KEY (theme_id) REFERENCES theme (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE theme_questions ADD CONSTRAINT FK_441F8E58BCB134CE FOREIGN KEY (questions_id) REFERENCES questions (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE account DROP FOREIGN KEY FK_7D3656A4A76ED395');
        $this->addSql('ALTER TABLE account_theme DROP FOREIGN KEY FK_A1FA3E799B6B5FBA');
        $this->addSql('ALTER TABLE account_theme DROP FOREIGN KEY FK_A1FA3E7959027487');
        $this->addSql('ALTER TABLE answers DROP FOREIGN KEY FK_50D0C6064FAF8F53');
        $this->addSql('ALTER TABLE games DROP FOREIGN KEY FK_FF232B3149CB4726');
        $this->addSql('ALTER TABLE games DROP FOREIGN KEY FK_FF232B31276615B2');
        $this->addSql('ALTER TABLE theme_questions DROP FOREIGN KEY FK_441F8E5859027487');
        $this->addSql('ALTER TABLE theme_questions DROP FOREIGN KEY FK_441F8E58BCB134CE');
        $this->addSql('DROP TABLE account');
        $this->addSql('DROP TABLE account_theme');
        $this->addSql('DROP TABLE answers');
        $this->addSql('DROP TABLE games');
        $this->addSql('DROP TABLE questions');
        $this->addSql('DROP TABLE refresh_tokens');
        $this->addSql('DROP TABLE theme');
        $this->addSql('DROP TABLE theme_questions');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
