'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Icon,
  HStack,
  VStack,
  Badge,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, CheckCircleIcon, TimeIcon, WarningIcon } from '@chakra-ui/icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Group {
  id: number;
  name: string;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  departureTime: string;
  passengersCount: number;
  passengers?: any[];
}

// Временные данные для демонстрации
const mockGroups = [
  {
    id: 1,
    name: 'Семейная поездка в Сочи',
    airline: 'Аэрофлот',
    flightNumber: 'SU1234',
    departureDate: '2023-06-15T10:30:00',
    passengerCount: 4,
    status: 'completed', // completed, pending, processing
  },
  {
    id: 2,
    name: 'Деловая поездка',
    airline: 'S7 Airlines',
    flightNumber: 'S71234',
    departureDate: '2023-07-20T14:45:00',
    passengerCount: 2,
    status: 'pending',
  },
  {
    id: 3,
    name: 'Школьная экскурсия',
    airline: 'Победа',
    flightNumber: 'DP1234',
    departureDate: '2023-08-05T08:15:00',
    passengerCount: 25,
    status: 'processing',
  },
];

export default function Dashboard() {
  const [groups, setGroups] = useState(mockGroups);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Имитируем задержку загрузки
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Загружаем группы из localStorage
        const savedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
        
        // Загружаем информацию о пассажирах для каждой группы
        const groupPassengers = JSON.parse(localStorage.getItem('groupPassengers') || '{}');
        
        // Обновляем группы с информацией о пассажирах
        const updatedGroups = savedGroups.map((group: Group) => {
          const groupPassengersData = groupPassengers[String(group.id)]?.passengers || [];
          return {
            ...group,
            passengers: groupPassengersData,
          };
        });

        setGroups(updatedGroups);
      } catch (error) {
        toast({
          title: 'Ошибка загрузки',
          description: error instanceof Error ? error.message : 'Не удалось загрузить данные',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Функция для отображения статуса группы
  const renderStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge colorScheme="green" display="flex" alignItems="center">
            <CheckCircleIcon mr={1} />
            Завершена
          </Badge>
        );
      case 'processing':
        return (
          <Badge colorScheme="blue" display="flex" alignItems="center">
            <TimeIcon mr={1} />
            В процессе
          </Badge>
        );
      case 'pending':
        return (
          <Badge colorScheme="yellow" display="flex" alignItems="center">
            <WarningIcon mr={1} />
            Ожидание
          </Badge>
        );
      default:
        return null;
    }
  };

  // Обработчик удаления группы
  const handleDeleteGroup = async (groupId: number) => {
    try {
      // Удаляем группу из localStorage
      const savedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      const updatedGroups = savedGroups.filter((g: Group) => g.id !== groupId);
      localStorage.setItem('groups', JSON.stringify(updatedGroups));

      // Удаляем информацию о пассажирах группы
      const groupPassengers = JSON.parse(localStorage.getItem('groupPassengers') || '{}');
      const { [String(groupId)]: removed, ...remainingPassengers } = groupPassengers;
      localStorage.setItem('groupPassengers', JSON.stringify(remainingPassengers));

      // Удаляем информацию о местах группы
      const groupSeats = JSON.parse(localStorage.getItem('groupSeats') || '{}');
      const { [String(groupId)]: removedSeats, ...remainingSeats } = groupSeats;
      localStorage.setItem('groupSeats', JSON.stringify(remainingSeats));

      // Обновляем состояние
      setGroups(updatedGroups);

      toast({
        title: 'Группа удалена',
        description: 'Группа успешно удалена',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Ошибка удаления',
        description: error instanceof Error ? error.message : 'Не удалось удалить группу',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Header />
      <Container maxW={'6xl'} py={10}>
        <Box mb={10}>
          <Heading as="h1" size="xl" mb={4}>
            Панель управления
          </Heading>
          <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
            Управляйте вашими группами пассажиров, создавайте новые регистрации и отслеживайте статус
          </Text>
        </Box>

        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Heading as="h2" size="lg">
            Ваши группы
          </Heading>
          <Link href="/dashboard/groups/new" passHref>
            <Button
              colorScheme="blue"
              leftIcon={<AddIcon />}
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
            >
              Создать новую группу
            </Button>
          </Link>
        </Flex>

        {groups.length === 0 ? (
          <Box
            p={10}
            textAlign="center"
            rounded="md"
            borderWidth={1}
            borderStyle="dashed"
            borderColor={useColorModeValue('gray.300', 'gray.600')}
          >
            <VStack spacing={4}>
              <Icon as={AddIcon} w={10} h={10} color="blue.400" />
              <Heading as="h3" size="md">
                У вас пока нет групп
              </Heading>
              <Text color={useColorModeValue('gray.600', 'gray.400')}>
                Создайте свою первую группу пассажиров для регистрации на рейс
              </Text>
              <Link href="/dashboard/groups/new" passHref>
                <Button colorScheme="blue" leftIcon={<AddIcon />}>
                  Создать группу
                </Button>
              </Link>
            </VStack>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {groups.map((group) => (
              <Box
                key={group.id}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'md'}
                rounded={'lg'}
                p={6}
                overflow={'hidden'}
                _hover={{
                  transform: 'translateY(-5px)',
                  transition: 'all .2s ease-in-out',
                  boxShadow: 'xl',
                }}
              >
                <Stack spacing={4}>
                  <Flex justifyContent="space-between" alignItems="flex-start">
                    <Heading as="h3" size="md" fontWeight="bold" noOfLines={2}>
                      {group.name}
                    </Heading>
                    {renderStatus(group.status)}
                  </Flex>
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <Text fontWeight="bold">Авиакомпания:</Text>
                      <Text>{group.airline}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">Рейс:</Text>
                      <Text>{group.flightNumber}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">Дата вылета:</Text>
                      <Text>{new Date(group.departureDate).toLocaleString('ru-RU')}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">Количество пассажиров:</Text>
                      <Text>{group.passengerCount}</Text>
                    </HStack>
                  </VStack>
                  <Flex mt={4} justifyContent="space-between">
                    <Link href={`/dashboard/groups/${group.id}`} passHref>
                      <Button colorScheme="blue" variant="outline" size="sm">
                        Подробнее
                      </Button>
                    </Link>
                    {group.status === 'completed' && (
                      <Link href={`/dashboard/groups/${group.id}/boarding-passes`} passHref>
                        <Button colorScheme="green" size="sm">
                          Посадочные талоны
                        </Button>
                      </Link>
                    )}
                  </Flex>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Container>
      <Footer />
    </>
  );
} 