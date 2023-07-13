<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230711132911 extends AbstractMigration
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
        $this->addSql('ALTER TABLE account ADD CONSTRAINT FK_7D3656A4A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE account_theme ADD CONSTRAINT FK_A1FA3E799B6B5FBA FOREIGN KEY (account_id) REFERENCES account (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE account_theme ADD CONSTRAINT FK_A1FA3E7959027487 FOREIGN KEY (theme_id) REFERENCES theme (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_theme DROP FOREIGN KEY FK_75B71C50A76ED395');
        $this->addSql('ALTER TABLE user_theme DROP FOREIGN KEY FK_75B71C5059027487');
        $this->addSql('DROP TABLE user_theme');
        $this->addSql('ALTER TABLE user DROP wallet');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_theme (user_id INT NOT NULL, theme_id INT NOT NULL, INDEX IDX_75B71C50A76ED395 (user_id), INDEX IDX_75B71C5059027487 (theme_id), PRIMARY KEY(user_id, theme_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE user_theme ADD CONSTRAINT FK_75B71C50A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_theme ADD CONSTRAINT FK_75B71C5059027487 FOREIGN KEY (theme_id) REFERENCES theme (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE account DROP FOREIGN KEY FK_7D3656A4A76ED395');
        $this->addSql('ALTER TABLE account_theme DROP FOREIGN KEY FK_A1FA3E799B6B5FBA');
        $this->addSql('ALTER TABLE account_theme DROP FOREIGN KEY FK_A1FA3E7959027487');
        $this->addSql('DROP TABLE account');
        $this->addSql('DROP TABLE account_theme');
        $this->addSql('ALTER TABLE user ADD wallet INT NOT NULL');
    }
}
