'use client';

import React from 'react';
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
      mt={12}
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Text fontSize={'lg'} fontWeight={'bold'}>
                АвиаРегистрация
              </Text>
            </Box>
            <Text fontSize={'sm'}>
              © {new Date().getFullYear()} Сервис групповой регистрации на авиарейсы. Все права защищены.
            </Text>
          </Stack>
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
              Компания
            </Text>
            <Link href={'/about'}>О нас</Link>
            <Link href={'/contacts'}>Контакты</Link>
            <Link href={'/partners'}>Партнеры</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
              Сервисы
            </Text>
            <Link href={'/services/check-in'}>Регистрация на рейс</Link>
            <Link href={'/services/additional'}>Дополнительные услуги</Link>
            <Link href={'/services/faq'}>Часто задаваемые вопросы</Link>
          </Stack>
          <Stack align={'flex-start'}>
            <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
              Правовая информация
            </Text>
            <Link href={'/legal/terms'}>Условия использования</Link>
            <Link href={'/legal/privacy'}>Политика конфиденциальности</Link>
            <Link href={'/legal/cookie'}>Использование cookie</Link>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  );
} 