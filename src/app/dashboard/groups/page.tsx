'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  VStack,
  HStack,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, ChevronRightIcon } from '@chakra-ui/icons';
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
  status: 'active' | 'completed' | 'cancelled';
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    const loadMockData = async () => {
      try {
        // Имитируем загрузку данных
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Загружаем группы из localStorage
        const savedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
        
        // Если нет сохраненных групп, используем моковые данные
        if (savedGroups.length === 0) {
          const mockGroups: Group[] = [
            {
              id: 1,
              name: 'Корпоративная поездка',
              flightNumber: 'SU1234',
              departureCity: 'Москва',
              arrivalCity: 'Санкт-Петербург',
              departureDate: '2024-03-20',
              departureTime: '10:00',
              passengersCount: 5,
              status: 'active',
            },
            {
              id: 2,
              name: 'Семейный отдых',
              flightNumber: 'S71234',
              departureCity: 'Москва',
              arrivalCity: 'Сочи',
              departureDate: '2024-03-25',
              departureTime: '14:30',
              passengersCount: 3,
              status: 'active',
            },
            {
              id: 3,
              name: 'Тур по Европе',
              flightNumber: 'SU5678',
              departureCity: 'Москва',
              arrivalCity: 'Париж',
              departureDate: '2024-04-01',
              departureTime: '09:15',
              passengersCount: 8,
              status: 'completed',
            },
          ];
          
          // Сохраняем моковые данные в localStorage
          localStorage.setItem('groups', JSON.stringify(mockGroups));
          setGroups(mockGroups);
        } else {
          setGroups(savedGroups);
        }
      } catch (error) {
        toast({
          title: 'Ошибка загрузки',
          description: 'Не удалось загрузить список групп',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMockData();
  }, [toast]);

  const getStatusColor = (status: Group['status']) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'completed':
        return 'blue';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: Group['status']) => {
    switch (status) {
      case 'active':
        return 'Активная';
      case 'completed':
        return 'Завершена';
      case 'cancelled':
        return 'Отменена';
      default:
        return status;
    }
  };

  return (
    <>
      <Header />
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Box>
              <Heading as="h1" size="xl" mb={2}>
                Мои группы
              </Heading>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
                Управление группами пассажиров
              </Text>
            </Box>
            <Link href="/dashboard/groups/new" passHref>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="blue"
                size="lg"
              >
                Создать группу
              </Button>
            </Link>
          </HStack>

          <Box
            bg={useColorModeValue('white', 'gray.700')}
            borderRadius="lg"
            boxShadow="md"
            overflow="hidden"
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Название</Th>
                  <Th>Рейс</Th>
                  <Th>Маршрут</Th>
                  <Th>Дата и время</Th>
                  <Th>Пассажиры</Th>
                  <Th>Статус</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {groups.map((group) => (
                  <Tr key={group.id}>
                    <Td fontWeight="medium">{group.name}</Td>
                    <Td>{group.flightNumber}</Td>
                    <Td>
                      {group.departureCity} → {group.arrivalCity}
                    </Td>
                    <Td>
                      {new Date(group.departureDate).toLocaleDateString('ru-RU')} {group.departureTime}
                    </Td>
                    <Td>{group.passengersCount}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(group.status)}>
                        {getStatusText(group.status)}
                      </Badge>
                    </Td>
                    <Td>
                      <Link href={`/dashboard/groups/${group.id}/passengers`} passHref>
                        <Button
                          variant="ghost"
                          size="sm"
                          rightIcon={<ChevronRightIcon />}
                        >
                          Открыть
                        </Button>
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </Container>
      <Footer />
    </>
  );
} 