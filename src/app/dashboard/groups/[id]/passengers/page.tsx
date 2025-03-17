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
  useColorModeValue,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  FormControl,
  FormLabel,
  Input,
  Select,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
} from '@chakra-ui/react';
import { ChevronRightIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Passenger {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  passportNumber: string;
  passportSeries: string;
  birthDate: string;
  email: string;
}

interface Group {
  id: number;
  name: string;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  departureTime: string;
  passengersCount: number;
}

export default function PassengersPage() {
  const params = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPassenger, setNewPassenger] = useState<Partial<Passenger>>({});
  const toast = useToast();

  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    const loadMockData = async () => {
      try {
        // Имитируем загрузку данных
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Загружаем группу из localStorage
        const savedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
        const currentGroup = savedGroups.find((g: Group) => g.id === Number(params.id));
        
        if (!currentGroup) {
          throw new Error('Группа не найдена');
        }

        // Загружаем сохраненных пассажиров
        const groupPassengers = JSON.parse(localStorage.getItem('groupPassengers') || '{}');
        const savedPassengers = groupPassengers[String(params.id)]?.passengers || [];
        
        setGroup(currentGroup);
        setPassengers(savedPassengers);
      } catch (error) {
        toast({
          title: 'Ошибка загрузки',
          description: error instanceof Error ? error.message : 'Не удалось загрузить информацию о группе',
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

  const handleAddPassenger = () => {
    if (!newPassenger.firstName || !newPassenger.lastName || !newPassenger.passportNumber) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните обязательные поля',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const passenger: Passenger = {
      id: passengers.length + 1,
      firstName: newPassenger.firstName,
      lastName: newPassenger.lastName,
      middleName: newPassenger.middleName || '',
      passportNumber: newPassenger.passportNumber,
      passportSeries: newPassenger.passportSeries || '',
      birthDate: newPassenger.birthDate || '',
      email: newPassenger.email || '',
    };

    const updatedPassengers = [...passengers, passenger];
    setPassengers(updatedPassengers);
    setNewPassenger({});

    // Сохраняем обновленный список пассажиров в localStorage
    if (group) {
      const groupPassengers = JSON.parse(localStorage.getItem('groupPassengers') || '{}');
      const updatedGroupPassengers = {
        ...groupPassengers,
        [String(group.id)]: {
          groupId: group.id,
          passengers: updatedPassengers,
        },
      };
      localStorage.setItem('groupPassengers', JSON.stringify(updatedGroupPassengers));
    }
    
    toast({
      title: 'Пассажир добавлен',
      description: 'Пассажир успешно добавлен в группу',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleDeletePassenger = (id: number) => {
    const updatedPassengers = passengers.filter(p => p.id !== id);
    setPassengers(updatedPassengers);

    // Обновляем список пассажиров в localStorage
    if (group) {
      const groupPassengers = JSON.parse(localStorage.getItem('groupPassengers') || '{}');
      const updatedGroupPassengers = {
        ...groupPassengers,
        [String(group.id)]: {
          groupId: group.id,
          passengers: updatedPassengers,
        },
      };
      localStorage.setItem('groupPassengers', JSON.stringify(updatedGroupPassengers));
    }
    
    toast({
      title: 'Пассажир удален',
      description: 'Пассажир успешно удален из группы',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleSave = async () => {
    if (!group) {
      toast({
        title: 'Ошибка',
        description: 'Группа не найдена',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (passengers.length === 0) {
      toast({
        title: 'Ошибка',
        description: 'Добавьте хотя бы одного пассажира',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // В реальном приложении здесь будет запрос к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Сохраняем пассажиров в localStorage
      const groupPassengers = {
        groupId: group.id,
        passengers: passengers,
      };
      
      // Получаем существующие данные о пассажирах
      const existingPassengers = JSON.parse(localStorage.getItem('groupPassengers') || '{}');
      
      // Обновляем данные для текущей группы
      const updatedPassengers = {
        ...existingPassengers,
        [group.id]: groupPassengers,
      };
      
      // Сохраняем обновленные данные
      localStorage.setItem('groupPassengers', JSON.stringify(updatedPassengers));
      
      toast({
        title: 'Сохранено',
        description: 'Информация о пассажирах успешно сохранена',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Ошибка сохранения',
        description: 'Не удалось сохранить информацию о пассажирах',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!group) {
    return null;
  }

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
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href={`/dashboard/groups/${group.id}`}>
                {group.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Пассажиры</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Пассажиры группы
            </Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              Добавьте пассажиров в группу
            </Text>
          </Box>

          <Box
            bg={useColorModeValue('white', 'gray.700')}
            p={6}
            borderRadius="lg"
            boxShadow="md"
          >
            <VStack spacing={6} align="stretch">
              <Heading size="md">Добавить пассажира</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Имя</FormLabel>
                  <Input
                    value={newPassenger.firstName || ''}
                    onChange={(e) => setNewPassenger({ ...newPassenger, firstName: e.target.value })}
                    placeholder="Иван"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Отчество</FormLabel>
                  <Input
                    value={newPassenger.middleName || ''}
                    onChange={(e) => setNewPassenger({ ...newPassenger, middleName: e.target.value })}
                    placeholder="Иванович"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Фамилия</FormLabel>
                  <Input
                    value={newPassenger.lastName || ''}
                    onChange={(e) => setNewPassenger({ ...newPassenger, lastName: e.target.value })}
                    placeholder="Иванов"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Серия паспорта</FormLabel>
                  <Input
                    value={newPassenger.passportSeries || ''}
                    onChange={(e) => setNewPassenger({ ...newPassenger, passportSeries: e.target.value })}
                    placeholder="1234"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Номер паспорта</FormLabel>
                  <Input
                    value={newPassenger.passportNumber || ''}
                    onChange={(e) => setNewPassenger({ ...newPassenger, passportNumber: e.target.value })}
                    placeholder="567890"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Дата рождения</FormLabel>
                  <Input
                    type="date"
                    value={newPassenger.birthDate || ''}
                    onChange={(e) => setNewPassenger({ ...newPassenger, birthDate: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={newPassenger.email || ''}
                    onChange={(e) => setNewPassenger({ ...newPassenger, email: e.target.value })}
                    placeholder="ivan@example.com"
                  />
                </FormControl>
              </SimpleGrid>

              <Button
                leftIcon={<AddIcon />}
                colorScheme="blue"
                onClick={handleAddPassenger}
                alignSelf="flex-end"
              >
                Добавить пассажира
              </Button>
            </VStack>
          </Box>

          <Box
            bg={useColorModeValue('white', 'gray.700')}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            overflow="hidden"
          >
            <VStack spacing={6} align="stretch">
              <Heading size="md">Список пассажиров</Heading>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ФИО</Th>
                    <Th>Паспорт</Th>
                    <Th>Дата рождения</Th>
                    <Th>Email</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {passengers.map((passenger) => (
                    <Tr key={passenger.id}>
                      <Td>
                        {passenger.lastName} {passenger.firstName} {passenger.middleName}
                      </Td>
                      <Td>
                        {passenger.passportSeries} {passenger.passportNumber}
                      </Td>
                      <Td>
                        {passenger.birthDate ? new Date(passenger.birthDate).toLocaleDateString('ru-RU') : '-'}
                      </Td>
                      <Td>{passenger.email || '-'}</Td>
                      <Td>
                        <IconButton
                          aria-label="Удалить пассажира"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePassenger(passenger.id)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </VStack>
          </Box>

          <HStack spacing={4} justify="flex-end">
            <Link href={`/dashboard/groups/${group.id}`} passHref>
              <Button variant="ghost">Назад</Button>
            </Link>
            <Button colorScheme="blue" onClick={handleSave}>
              Сохранить
            </Button>
            <Link href={`/dashboard/groups/${group.id}/seats`} passHref>
              <Button colorScheme="blue" rightIcon={<ChevronRightIcon />}>
                Выбрать места
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>
      <Footer />
    </>
  );
} 