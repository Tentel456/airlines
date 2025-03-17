'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // В реальном приложении здесь будет запрос к API для авторизации
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Ошибка при авторизации');
      // }
      
      // Для демонстрации просто имитируем успешную авторизацию
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Успешная авторизация',
        description: 'Вы успешно вошли в систему',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Перенаправляем на страницу дашборда
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: 'Ошибка авторизации',
        description: error instanceof Error ? error.message : 'Произошла ошибка при входе',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container maxW='xl' py={12}>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <Heading fontSize={'2xl'} textAlign={'center'}>
              Вход в аккаунт
            </Heading>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl id="password" isRequired>
                  <FormLabel>Пароль</FormLabel>
                  <Input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}
                  >
                    <Link href="/forgot-password" passHref>
                      <Text color={'blue.400'}>Забыли пароль?</Text>
                    </Link>
                  </Stack>
                  <Button
                    bg={'blue.400'}
                    color={'white'}
                    _hover={{
                      bg: 'blue.500',
                    }}
                    type="submit"
                    isLoading={isLoading}
                  >
                    Войти
                  </Button>
                </Stack>
              </Stack>
            </form>
            <Stack pt={6}>
              <Text align={'center'}>
                Еще нет аккаунта?{' '}
                <Link href="/register" passHref>
                  <Text as="span" color={'blue.400'}>
                    Зарегистрироваться
                  </Text>
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Container>
      <Footer />
    </>
  );
} 