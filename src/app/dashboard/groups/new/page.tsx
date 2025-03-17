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
  Input,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Select,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Текущая дата плюс 1 день для минимальной даты
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export default function NewGroupPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    flightNumber: '',
    departureCity: '',
    arrivalCity: '',
    departureDate: tomorrow.toISOString().split('T')[0],
    departureTime: '10:00',
    passengersCount: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // В реальном приложении здесь будет запрос к API для создания группы
      // const response = await fetch('/api/groups', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Ошибка при создании группы');
      // }

      // Для демонстрации просто имитируем успешное создание
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Генерируем случайный ID для демонстрации
      const groupId = Math.floor(Math.random() * 1000);
      
      // Создаем новую группу
      const newGroup = {
        id: groupId,
        name: formData.name,
        flightNumber: formData.flightNumber,
        departureCity: formData.departureCity,
        arrivalCity: formData.arrivalCity,
        departureDate: formData.departureDate,
        departureTime: formData.departureTime,
        passengersCount: formData.passengersCount,
        status: 'active' as const,
      };

      // Получаем существующие группы из localStorage
      const existingGroups = JSON.parse(localStorage.getItem('groups') || '[]');
      
      // Добавляем новую группу
      const updatedGroups = [...existingGroups, newGroup];
      
      // Сохраняем обновленный список групп
      localStorage.setItem('groups', JSON.stringify(updatedGroups));
      
      toast({
        title: 'Группа создана',
        description: 'Новая группа пассажиров успешно создана',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Перенаправляем на страницу добавления пассажиров
      router.push(`/dashboard/groups/${groupId}/passengers`);
    } catch (error) {
      toast({
        title: 'Ошибка создания',
        description: error instanceof Error ? error.message : 'Произошла ошибка при создании группы',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Header />
      <Container maxW={'2xl'} py={10}>
        <VStack spacing={8} align="stretch">
          <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/dashboard">
                Панель управления
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Новая группа</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Создание новой группы
            </Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              Заполните информацию о рейсе для новой группы пассажиров
            </Text>
          </Box>

          <Box
            as="form"
            onSubmit={handleSubmit}
            bg={useColorModeValue('white', 'gray.700')}
            p={8}
            borderRadius="lg"
            boxShadow="md"
          >
            <VStack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Название группы</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Например: Корпоративная поездка"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Номер рейса</FormLabel>
                <Input
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  placeholder="Например: SU1234"
                />
              </FormControl>

              <HStack spacing={4} width="100%">
                <FormControl isRequired>
                  <FormLabel>Город вылета</FormLabel>
                  <Input
                    name="departureCity"
                    value={formData.departureCity}
                    onChange={handleChange}
                    placeholder="Например: Москва"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Город прилета</FormLabel>
                  <Input
                    name="arrivalCity"
                    value={formData.arrivalCity}
                    onChange={handleChange}
                    placeholder="Например: Санкт-Петербург"
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} width="100%">
                <FormControl isRequired>
                  <FormLabel>Дата вылета</FormLabel>
                  <Input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    min={tomorrow.toISOString().split('T')[0]}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Время вылета</FormLabel>
                  <Input
                    type="time"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                  />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Количество пассажиров</FormLabel>
                <NumberInput
                  name="passengersCount"
                  value={formData.passengersCount}
                  onChange={(_, value) => setFormData(prev => ({ ...prev, passengersCount: value }))}
                  min={1}
                  max={50}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <Flex justify="space-between" width="100%" mt={4}>
                <Link href="/dashboard" passHref>
                  <Button colorScheme="gray">Отмена</Button>
                </Link>
                <Button
                  type="submit"
                  colorScheme="blue"
                  rightIcon={<ArrowForwardIcon />}
                  isLoading={isLoading}
                >
                  Создать группу
                </Button>
              </Flex>
            </VStack>
          </Box>
        </VStack>
      </Container>
      <Footer />
    </>
  );
} 