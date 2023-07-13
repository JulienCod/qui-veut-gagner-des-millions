<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230704200835 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_theme (user_id INT NOT NULL, theme_id INT NOT NULL, INDEX IDX_75B71C50A76ED395 (user_id), INDEX IDX_75B71C5059027487 (theme_id), PRIMARY KEY(user_id, theme_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_theme ADD CONSTRAINT FK_75B71C50A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_theme ADD CONSTRAINT FK_75B71C5059027487 FOREIGN KEY (theme_id) REFERENCES theme (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE theme DROP FOREIGN KEY FK_9775E708A76ED395');
        $this->addSql('DROP INDEX IDX_9775E708A76ED395 ON theme');
        $this->addSql('ALTER TABLE theme DROP user_id');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_theme DROP FOREIGN KEY FK_75B71C50A76ED395');
        $this->addSql('ALTER TABLE user_theme DROP FOREIGN KEY FK_75B71C5059027487');
        $this->addSql('DROP TABLE user_theme');
        $this->addSql('ALTER TABLE theme ADD user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE theme ADD CONSTRAINT FK_9775E708A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_9775E708A76ED395 ON theme (user_id)');
    }
}
