'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  useColorModeValue,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
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
  progress: {
    passengers: number;
    seats: number;
    services: number;
    boardingPasses: number;
  };
}

export default function GroupDetailsPage() {
  const params = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    const loadMockData = async () => {
      try {
        // Имитируем загрузку данных
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Моковые данные
        const mockGroup: Group = {
          id: Number(params.id),
          name: 'Корпоративная поездка',
          flightNumber: 'SU1234',
          departureCity: 'Москва',
          arrivalCity: 'Санкт-Петербург',
          departureDate: '2024-03-20',
          departureTime: '10:00',
          passengersCount: 5,
          status: 'active',
          progress: {
            passengers: 5,
            seats: 3,
            services: 2,
            boardingPasses: 0,
          },
        };
        
        setGroup(mockGroup);
      } catch (error) {
        toast({
          title: 'Ошибка загрузки',
          description: 'Не удалось загрузить информацию о группе',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMockData();
  }, [params.id, toast]);

  if (!group) {
    return null;
  }

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

  const calculateProgress = () => {
    const total = 4; // Общее количество шагов
    const completed = Object.values(group.progress).filter(Boolean).length;
    return (completed / total) * 100;
  };

  return (
    <>
      <Header />
      <Container maxW="container.xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/dashboard">
                Панель управления
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/dashboard/groups">
                Мои группы
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{group.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Box>
            <HStack justify="space-between" mb={4}>
              <Box>
                <Heading as="h1" size="xl" mb={2}>
                  {group.name}
                </Heading>
                <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
                  Рейс {group.flightNumber}
                </Text>
              </Box>
              <Badge colorScheme={getStatusColor(group.status)} fontSize="md" px={4} py={2}>
                {getStatusText(group.status)}
              </Badge>
            </HStack>

            <Progress value={calculateProgress()} colorScheme="blue" mb={8} />
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Stat
              bg={useColorModeValue('white', 'gray.700')}
              p={4}
              borderRadius="lg"
              boxShadow="md"
            >
              <StatLabel>Пассажиры</StatLabel>
              <StatNumber>{group.progress.passengers}/{group.passengersCount}</StatNumber>
              <StatHelpText>
                <StatArrow type={group.progress.passengers === group.passengersCount ? 'increase' : 'decrease'} />
              </StatHelpText>
            </Stat>

            <Stat
              bg={useColorModeValue('white', 'gray.700')}
              p={4}
              borderRadius="lg"
              boxShadow="md"
            >
              <StatLabel>Места</StatLabel>
              <StatNumber>{group.progress.seats}/{group.passengersCount}</StatNumber>
              <StatHelpText>
                <StatArrow type={group.progress.seats === group.passengersCount ? 'increase' : 'decrease'} />
              </StatHelpText>
            </Stat>

            <Stat
              bg={useColorModeValue('white', 'gray.700')}
              p={4}
              borderRadius="lg"
              boxShadow="md"
            >
              <StatLabel>Услуги</StatLabel>
              <StatNumber>{group.progress.services}/{group.passengersCount}</StatNumber>
              <StatHelpText>
                <StatArrow type={group.progress.services === group.passengersCount ? 'increase' : 'decrease'} />
              </StatHelpText>
            </Stat>

            <Stat
              bg={useColorModeValue('white', 'gray.700')}
              p={4}
              borderRadius="lg"
              boxShadow="md"
            >
              <StatLabel>Посадочные талоны</StatLabel>
              <StatNumber>{group.progress.boardingPasses}/{group.passengersCount}</StatNumber>
              <StatHelpText>
                <StatArrow type={group.progress.boardingPasses === group.passengersCount ? 'increase' : 'decrease'} />
              </StatHelpText>
            </Stat>
          </SimpleGrid>

          <Box
            bg={useColorModeValue('white', 'gray.700')}
            p={6}
            borderRadius="lg"
            boxShadow="md"
          >
            <VStack spacing={6} align="stretch">
              <Heading size="md">Информация о рейсе</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <Text fontWeight="medium" mb={2}>Маршрут</Text>
                  <Text>{group.departureCity} → {group.arrivalCity}</Text>
                </Box>
                <Box>
                  <Text fontWeight="medium" mb={2}>Дата и время вылета</Text>
                  <Text>
                    {new Date(group.departureDate).toLocaleDateString('ru-RU')} {group.departureTime}
                  </Text>
                </Box>
              </SimpleGrid>
            </VStack>
          </Box>

          <HStack spacing={4} justify="flex-end">
            <Link href="/dashboard/groups" passHref>
              <Button variant="ghost">Назад к списку</Button>
            </Link>
            <Link href={`/dashboard/groups/${group.id}/passengers`} passHref>
              <Button colorScheme="blue" rightIcon={<ChevronRightIcon />}>
                Продолжить регистрацию
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>
      <Footer />
    </>
  );
} 