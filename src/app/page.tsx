'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Heading, 
  Stack, 
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export default function Home() {
  return (
    <Container maxW={'full'} p={0}>
      {/* Hero Section */}
      <Flex
        w={'full'}
        h={'100vh'}
        backgroundImage={`url('/images/hero-bg.jpg')`}
        backgroundSize={'cover'}
        backgroundPosition={'center center'}
      >
        <Box
          w={'full'}
          h={'full'}
          bg={useColorModeValue('blackAlpha.600', 'blackAlpha.800')}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Stack
            as={Box}
            textAlign={'center'}
            spacing={{ base: 8, md: 14 }}
            py={{ base: 20, md: 36 }}
            px={8}
            color={'white'}
          >
            <Heading
              fontWeight={600}
              fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
              lineHeight={'110%'}
            >
              Групповая регистрация <br />
              <Text as={'span'} color={'blue.400'}>
                на авиарейсы
              </Text>
            </Heading>
            <Text fontSize={'xl'}>
              Удобный сервис для регистрации групп пассажиров на авиарейсы.
              Создавайте группы, выбирайте места и управляйте дополнительными услугами.
              Автоматическая генерация и отправка посадочных талонов на электронную почту.
            </Text>
            <Stack
              direction={'column'}
              spacing={3}
              align={'center'}
              alignSelf={'center'}
              position={'relative'}
            >
              <Link href="/register" passHref>
                <Button
                  colorScheme={'blue'}
                  bg={'blue.400'}
                  rounded={'full'}
                  px={6}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  size={'lg'}
                >
                  Регистрация
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button
                  variant={'link'}
                  colorScheme={'white'}
                  size={'lg'}
                >
                  Вход
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Flex>

      {/* Features Section */}
      <Box py={12}>
        <Stack
          direction={'column'}
          spacing={4}
          align={'center'}
          alignSelf={'center'}
          position={'relative'}
        >
          <Heading
            fontSize={{ base: '3xl', md: '4xl' }}
            textAlign={'center'}
            color={useColorModeValue('gray.800', 'white')}
          >
            Упростите процесс регистрации на рейс
          </Heading>
          <Text
            fontSize={{ base: 'xl', md: '2xl' }}
            textAlign={'center'}
            color={useColorModeValue('gray.600', 'gray.300')}
            maxW={'3xl'}
          >
            Наш сервис разработан специально для организаторов групповых поездок
            и путешественников с большими группами
          </Text>
        </Stack>

        <Container maxW={'6xl'} mt={10}>
          <Flex
            flexWrap={'wrap'}
            gridGap={6}
            justify={'center'}
          >
            {/* Feature 1 */}
            <Box
              maxW={'330px'}
              w={'full'}
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow={'2xl'}
              rounded={'lg'}
              p={6}
              textAlign={'center'}
            >
              <Heading fontSize={'2xl'} fontFamily={'body'}>
                Создание группы
              </Heading>
              <Text
                textAlign={'center'}
                color={useColorModeValue('gray.700', 'gray.400')}
                py={3}
              >
                Создавайте группы пассажиров, выбирайте авиакомпанию и рейс,
                указывайте количество пассажиров.
              </Text>
            </Box>

            {/* Feature 2 */}
            <Box
              maxW={'330px'}
              w={'full'}
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow={'2xl'}
              rounded={'lg'}
              p={6}
              textAlign={'center'}
            >
              <Heading fontSize={'2xl'} fontFamily={'body'}>
                Выбор мест
              </Heading>
              <Text
                textAlign={'center'}
                color={useColorModeValue('gray.700', 'gray.400')}
                py={3}
              >
                Удобный выбор мест для каждого пассажира с интерактивной схемой
                салона самолета.
              </Text>
            </Box>

            {/* Feature 3 */}
            <Box
              maxW={'330px'}
              w={'full'}
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow={'2xl'}
              rounded={'lg'}
              p={6}
              textAlign={'center'}
            >
              <Heading fontSize={'2xl'} fontFamily={'body'}>
                Дополнительные услуги
              </Heading>
              <Text
                textAlign={'center'}
                color={useColorModeValue('gray.700', 'gray.400')}
                py={3}
              >
                Добавляйте дополнительные услуги: багаж, специальное питание,
                страховку и другие опции.
              </Text>
            </Box>

            {/* Feature 4 */}
            <Box
              maxW={'330px'}
              w={'full'}
              bg={useColorModeValue('white', 'gray.800')}
              boxShadow={'2xl'}
              rounded={'lg'}
              p={6}
              textAlign={'center'}
            >
              <Heading fontSize={'2xl'} fontFamily={'body'}>
                Посадочные талоны
              </Heading>
              <Text
                textAlign={'center'}
                color={useColorModeValue('gray.700', 'gray.400')}
                py={3}
              >
                Автоматическая генерация и отправка посадочных талонов на
                электронную почту каждому пассажиру.
              </Text>
            </Box>
          </Flex>
        </Container>
      </Box>
    </Container>
  );
} 