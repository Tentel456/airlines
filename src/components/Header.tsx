'use client';

import React from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  useColorModeValue,
  Button,
  Avatar,
  Text,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';

// Временные данные пользователя для демонстрации
const mockUser = {
  name: 'Иван Иванов',
  email: 'ivan@example.com',
  avatar: 'https://bit.ly/ivan-ivanov',
};

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    // В реальном приложении здесь будет логика выхода
    router.push('/login');
  };

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex="sticky"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      py={4}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center">
          <Link href="/" passHref>
            <Box
              fontSize="xl"
              fontWeight="bold"
              color={useColorModeValue('blue.500', 'blue.300')}
              cursor="pointer"
            >
              Групповая регистрация
            </Box>
          </Link>

          <HStack spacing={4}>
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
            />

            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={<HamburgerIcon />}
                display={{ base: 'block', md: 'none' }}
              >
                Меню
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} href="/dashboard">
                  Панель управления
                </MenuItem>
                <MenuItem as={Link} href="/dashboard/groups/new">
                  Создать группу
                </MenuItem>
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
              </MenuList>
            </Menu>

            <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
              <Link href="/dashboard" passHref>
                <Button variant="ghost">Панель управления</Button>
              </Link>
              <Link href="/dashboard/groups/new" passHref>
                <Button variant="ghost">Создать группу</Button>
              </Link>
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  leftIcon={<Avatar size="sm" src={mockUser.avatar} />}
                >
                  <Text display={{ base: 'none', md: 'block' }}>{mockUser.name}</Text>
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
} 