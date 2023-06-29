<?php

namespace App\Tests\Entity;

use App\Entity\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{

    public function getUser():User
    {
        return (new User())
            ->setEmail('email@email.fr')
            ->setPassword('Password123')
            ->setResetPasswordToken('string')
            ->setRoles(['ROLE_USER']);
    }

    public function testIsTrue()
    {
        $user = $this->getUser();
        $this->assertTrue($user->getEmail() === 'email@email.fr');
        $this->assertTrue($user->getPassword() === 'Password123');
        $this->assertTrue($user->getResetPasswordToken() === 'string');
        $this->assertTrue($user->getRoles() === ['ROLE_USER']);
    }

    public function testIsFalse()
    {
        $user = $this->getUser();
        $this->assertFalse($user->getEmail() === 'email1@email.fr');
        $this->assertFalse($user->getPassword() === 'Password1234');
        $this->assertFalse($user->getResetPasswordToken() === 'strings');
        $this->assertFalse($user->getRoles() === ['ROLE_USERS']);
    }
}
