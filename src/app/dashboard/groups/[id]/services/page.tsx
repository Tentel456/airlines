'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Checkbox,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  VStack,
  Badge,
  useColorModeValue,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Progress,
  Image,
} from '@chakra-ui/react';
import { ChevronRightIcon, ArrowForwardIcon, CheckIcon } from '@chakra-ui/icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Интерфейсы для типов
interface Passenger {
  id: number;
  firstName: string;
  lastName: string;
  seatNumber: string;
  services: Service[];
}

interface Service {
  id: number;
  type: 'EXTRA_BAGGAGE' | 'SPECIAL_MEAL' | 'INSURANCE' | 'PRIORITY_BOARDING';
  name: string;
  description: string;
  price: number;
  selected?: boolean;
  quantity?: number;
  option?: string;
}

// Данные услуг
const availableServices: { [key: string]: Service[] } = {
  'EXTRA_BAGGAGE': [
    { id: 1, type: 'EXTRA_BAGGAGE', name: 'Дополнительное место багажа (до 23 кг)', description: 'Дополнительная сумка или чемодан весом до 23 кг', price: 2500, quantity: 1 },
    { id: 2, type: 'EXTRA_BAGGAGE', name: 'Дополнительный вес багажа (до +10 кг)', description: 'Увеличение веса зарегистрированного багажа', price: 1500, quantity: 1 },
    { id: 3, type: 'EXTRA_BAGGAGE', name: 'Спортивный инвентарь', description: 'Перевозка лыж, сноуборда, велосипеда и другого спортивного инвентаря', price: 3500, quantity: 1 },
  ],
  'SPECIAL_MEAL': [
    { id: 4, type: 'SPECIAL_MEAL', name: 'Вегетарианское питание', description: 'Блюда без мяса, рыбы и морепродуктов', price: 800, option: 'vegetarian' },
    { id: 5, type: 'SPECIAL_MEAL', name: 'Халяльное питание', description: 'Питание, соответствующее исламским нормам', price: 800, option: 'halal' },
    { id: 6, type: 'SPECIAL_MEAL', name: 'Кошерное питание', description: 'Питание, соответствующее еврейским традициям', price: 800, option: 'kosher' },
    { id: 7, type: 'SPECIAL_MEAL', name: 'Безглютеновое питание', description: 'Блюда без содержания глютена', price: 900, option: 'gluten_free' },
    { id: 8, type: 'SPECIAL_MEAL', name: 'Низкокалорийное питание', description: 'Блюда с пониженным содержанием калорий', price: 800, option: 'low_calorie' },
    { id: 9, type: 'SPECIAL_MEAL', name: 'Детское питание', description: 'Специальное меню для детей', price: 600, option: 'child' },
  ],
  'INSURANCE': [
    { id: 10, type: 'INSURANCE', name: 'Базовая страховка', description: 'Базовое страхование на время полета', price: 500 },
    { id: 11, type: 'INSURANCE', name: 'Расширенная страховка', description: 'Страхование на время полета с повышенным покрытием', price: 1200 },
    { id: 12, type: 'INSURANCE', name: 'Премиум страховка', description: 'Полное страхование с максимальным покрытием и дополнительными опциями', price: 2500 },
  ],
  'PRIORITY_BOARDING': [
    { id: 13, type: 'PRIORITY_BOARDING', name: 'Приоритетная посадка', description: 'Возможность пройти на борт самолета в первую очередь', price: 1000 },
  ],
};

export default function ServicesPage({ params }: { params: { id: string } }) {
  const groupId = params.id;
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [selectedPassengerId, setSelectedPassengerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();
  const toast = useToast();

  // Загрузка демо-данных
  useEffect(() => {
    // В реальном приложении здесь будут API-запросы для загрузки данных
    const mockPassengers: Passenger[] = [
      { id: 1, firstName: 'Иван', lastName: 'Иванов', seatNumber: '15A', services: [] },
      { id: 2, firstName: 'Мария', lastName: 'Петрова', seatNumber: '15B', services: [] },
      { id: 3, firstName: 'Алексей', lastName: 'Сидоров', seatNumber: '15C', services: [] },
      { id: 4, firstName: 'Елена', lastName: 'Козлова', seatNumber: '15D', services: [] },
    ];

    setPassengers(mockPassengers);
    setIsLoading(false);
    
    // Если есть хотя бы один пассажир, выбираем его по умолчанию
    if (mockPassengers.length > 0) {
      setSelectedPassengerId(mockPassengers[0].id);
    }
  }, []);

  // Пересчет общей стоимости услуг при изменении пассажиров
  useEffect(() => {
    let total = 0;
    passengers.forEach(passenger => {
      passenger.services.forEach(service => {
        const quantity = service.quantity || 1;
        total += service.price * quantity;
      });
    });
    setTotalPrice(total);
  }, [passengers]);

  // Расчет прогресса по выбору услуг (считаем, что каждый пассажир должен выбрать хотя бы одну услугу)
  const passengersWithServices = passengers.filter(p => p.services.length > 0).length;
  const totalPassengers = passengers.length;
  const progressPercentage = totalPassengers ? (passengersWithServices / totalPassengers) * 100 : 0;

  // Получение текущего пассажира
  const selectedPassenger = passengers.find(p => p.id === selectedPassengerId);

  // Обработчик выбора услуги
  const handleServiceToggle = (serviceType: string, serviceId: number) => {
    if (!selectedPassengerId) return;

    setPassengers(passengers.map(passenger => {
      if (passenger.id !== selectedPassengerId) return passenger;

      // Найдем исходную услугу из доступных
      const baseService = availableServices[serviceType].find(s => s.id === serviceId);
      if (!baseService) return passenger;

      // Проверим, есть ли уже такая услуга у пассажира
      const existingServiceIndex = passenger.services.findIndex(s => s.id === serviceId);
      
      if (existingServiceIndex >= 0) {
        // Если услуга уже есть, удаляем ее
        const updatedServices = [...passenger.services];
        updatedServices.splice(existingServiceIndex, 1);
        return { ...passenger, services: updatedServices };
      } else {
        // Если услуги нет, добавляем ее
        return { 
          ...passenger, 
          services: [...passenger.services, { ...baseService, selected: true }] 
        };
      }
    }));
  };

  // Обработчик изменения количества для услуги
  const handleQuantityChange = (serviceId: number, quantity: number) => {
    if (!selectedPassengerId || quantity < 1) return;

    setPassengers(passengers.map(passenger => {
      if (passenger.id !== selectedPassengerId) return passenger;

      return {
        ...passenger,
        services: passenger.services.map(service => 
          service.id === serviceId 
            ? { ...service, quantity } 
            : service
        )
      };
    }));
  };

  // Обработчик изменения опции для услуги
  const handleOptionChange = (serviceId: number, option: string) => {
    if (!selectedPassengerId) return;

    setPassengers(passengers.map(passenger => {
      if (passenger.id !== selectedPassengerId) return passenger;

      return {
        ...passenger,
        services: passenger.services.map(service => 
          service.id === serviceId 
            ? { ...service, option } 
            : service
        )
      };
    }));
  };

  // Обработчик копирования услуг для всех пассажиров
  const handleCopyToAll = () => {
    if (!selectedPassengerId) return;
    
    const sourcePassenger = passengers.find(p => p.id === selectedPassengerId);
    if (!sourcePassenger || sourcePassenger.services.length === 0) {
      toast({
        title: 'Нет услуг для копирования',
        description: 'Сначала выберите услуги для текущего пассажира',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setPassengers(passengers.map(passenger => {
      if (passenger.id === selectedPassengerId) return passenger;
      
      return {
        ...passenger,
        services: [...sourcePassenger.services]
      };
    }));

    toast({
      title: 'Услуги скопированы',
      description: 'Услуги скопированы для всех пассажиров',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Обработчик сохранения и продолжения
  const handleSaveAndContinue = async () => {
    setIsSaving(true);

    try {
      // В реальном приложении здесь будет запрос к API для сохранения услуг
      // const response = await fetch(`/api/groups/${groupId}/services`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ 
      //     passengerServices: passengers.map(p => ({ 
      //       passengerId: p.id, 
      //       services: p.services 
      //     }))
      //   }),
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Ошибка при сохранении услуг');
      // }
      
      // Для демонстрации просто имитируем успешное сохранение
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Услуги сохранены',
        description: 'Выбранные услуги успешно сохранены',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      // Перенаправляем на страницу просмотра посадочных талонов
      router.push(`/dashboard/groups/${groupId}/boarding-passes`);
    } catch (error) {
      toast({
        title: 'Ошибка сохранения',
        description: error instanceof Error ? error.message : 'Произошла ошибка при сохранении услуг',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Проверка, выбрана ли услуга для текущего пассажира
  const isServiceSelected = (serviceId: number) => {
    if (!selectedPassenger) return false;
    return selectedPassenger.services.some(s => s.id === serviceId);
  };

  // Получение количества для выбранной услуги
  const getServiceQuantity = (serviceId: number) => {
    if (!selectedPassenger) return 1;
    const service = selectedPassenger.services.find(s => s.id === serviceId);
    return service?.quantity || 1;
  };

  // Получение опции для выбранной услуги
  const getServiceOption = (serviceId: number) => {
    if (!selectedPassenger) return '';
    const service = selectedPassenger.services.find(s => s.id === serviceId);
    return service?.option || '';
  };

  return (
    <>
      <Header />
      <Container maxW={'6xl'} py={10}>
        <VStack spacing={8} align="stretch">
          <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/dashboard">
                Панель управления
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href={`/dashboard/groups/${groupId}`}>
                Группа #{groupId}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href={`/dashboard/groups/${groupId}/passengers`}>
                Пассажиры
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href={`/dashboard/groups/${groupId}/seats`}>
                Выбор мест
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Дополнительные услуги</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Дополнительные услуги
            </Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              Выберите дополнительные услуги для пассажиров вашей группы
            </Text>
          </Box>

          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text fontWeight="medium">
              Прогресс: {passengersWithServices} из {totalPassengers} пассажиров выбрали услуги
            </Text>
            <Text fontWeight="medium">{Math.round(progressPercentage)}%</Text>
          </Flex>
          <Progress 
            value={progressPercentage} 
            size="sm" 
            colorScheme="blue" 
            mb={6} 
            borderRadius="full"
          />

          {isLoading ? (
            <Box textAlign="center" py={10}>
              <Text>Загрузка данных...</Text>
            </Box>
          ) : (
            <Flex 
              direction={{ base: 'column', lg: 'row' }} 
              gap={8}
            >
              {/* Левая панель - список пассажиров */}
              <Box 
                width={{ base: '100%', lg: '300px' }}
                bg={useColorModeValue('white', 'gray.700')}
                p={6}
                borderRadius="lg"
                boxShadow="md"
              >
                <Heading as="h3" size="md" mb={4}>
                  Пассажиры
                </Heading>
                <Text mb={4}>Выберите пассажира для добавления услуг:</Text>
                
                <VStack spacing={3} align="stretch">
                  {passengers.map(passenger => (
                    <Box 
                      key={passenger.id}
                      p={3}
                      borderRadius="md"
                      cursor="pointer"
                      bg={selectedPassengerId === passenger.id ? 'blue.100' : 'transparent'}
                      _hover={{ bg: 'gray.100' }}
                      onClick={() => setSelectedPassengerId(passenger.id)}
                    >
                      <Flex justify="space-between" align="center">
                        <Box>
                          <Text fontWeight={selectedPassengerId === passenger.id ? 'bold' : 'normal'}>
                            {passenger.firstName} {passenger.lastName}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Место: {passenger.seatNumber}</Text>
                        </Box>
                        <Badge colorScheme={passenger.services.length > 0 ? 'green' : 'gray'}>
                          {passenger.services.length} услуг
                        </Badge>
                      </Flex>
                    </Box>
                  ))}
                </VStack>

                <Button 
                  mt={6} 
                  size="sm" 
                  width="full" 
                  colorScheme="blue" 
                  variant="outline"
                  onClick={handleCopyToAll}
                  isDisabled={!selectedPassenger || selectedPassenger.services.length === 0}
                >
                  Копировать для всех
                </Button>
              </Box>

              {/* Правая панель - услуги */}
              <Box 
                flex={1}
                bg={useColorModeValue('white', 'gray.700')}
                p={6}
                borderRadius="lg"
                boxShadow="md"
              >
                {selectedPassenger ? (
                  <>
                    <Heading as="h3" size="md" mb={1}>
                      Услуги для {selectedPassenger.firstName} {selectedPassenger.lastName}
                    </Heading>
                    <Text fontSize="sm" mb={6}>Место: {selectedPassenger.seatNumber}</Text>

                    <Tabs 
                      isFitted 
                      variant="enclosed" 
                      colorScheme="blue" 
                      index={tabIndex} 
                      onChange={setTabIndex}
                    >
                      <TabList mb="1em">
                        <Tab>Багаж</Tab>
                        <Tab>Питание</Tab>
                        <Tab>Страховка</Tab>
                        <Tab>Приоритетная посадка</Tab>
                      </TabList>
                      <TabPanels>
                        {/* Багаж */}
                        <TabPanel>
                          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                            {availableServices['EXTRA_BAGGAGE'].map(service => (
                              <Box 
                                key={service.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                p={4}
                                borderColor={isServiceSelected(service.id) ? 'blue.500' : 'gray.200'}
                                bg={isServiceSelected(service.id) ? 'blue.50' : 'white'}
                              >
                                <Flex justify="space-between" align="start">
                                  <VStack align="start" spacing={1}>
                                    <Checkbox 
                                      isChecked={isServiceSelected(service.id)}
                                      onChange={() => handleServiceToggle('EXTRA_BAGGAGE', service.id)}
                                      colorScheme="blue"
                                      size="lg"
                                    >
                                      <Text fontWeight="bold">{service.name}</Text>
                                    </Checkbox>
                                    <Text fontSize="sm" color="gray.600" ml={6}>{service.description}</Text>
                                  </VStack>
                                  <Text fontWeight="bold">{service.price} ₽</Text>
                                </Flex>
                                
                                {isServiceSelected(service.id) && (
                                  <Box mt={4}>
                                    <Text fontSize="sm" mb={1}>Количество:</Text>
                                    <NumberInput 
                                      size="sm" 
                                      maxW={20} 
                                      min={1} 
                                      max={3}
                                      value={getServiceQuantity(service.id)}
                                      onChange={(_, num) => handleQuantityChange(service.id, num)}
                                    >
                                      <NumberInputField />
                                      <NumberInputStepper>
                                        <NumberIncrementStepper />
                                        <NumberDecrementStepper />
                                      </NumberInputStepper>
                                    </NumberInput>
                                  </Box>
                                )}
                              </Box>
                            ))}
                          </Grid>
                        </TabPanel>

                        {/* Питание */}
                        <TabPanel>
                          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                            {availableServices['SPECIAL_MEAL'].map(service => (
                              <Box 
                                key={service.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                p={4}
                                borderColor={isServiceSelected(service.id) ? 'blue.500' : 'gray.200'}
                                bg={isServiceSelected(service.id) ? 'blue.50' : 'white'}
                              >
                                <Flex justify="space-between" align="start">
                                  <VStack align="start" spacing={1}>
                                    <Checkbox 
                                      isChecked={isServiceSelected(service.id)}
                                      onChange={() => handleServiceToggle('SPECIAL_MEAL', service.id)}
                                      colorScheme="blue"
                                      size="lg"
                                    >
                                      <Text fontWeight="bold">{service.name}</Text>
                                    </Checkbox>
                                    <Text fontSize="sm" color="gray.600" ml={6}>{service.description}</Text>
                                  </VStack>
                                  <Text fontWeight="bold">{service.price} ₽</Text>
                                </Flex>
                              </Box>
                            ))}
                          </Grid>
                        </TabPanel>

                        {/* Страховка */}
                        <TabPanel>
                          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                            {availableServices['INSURANCE'].map(service => (
                              <Box 
                                key={service.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                p={4}
                                borderColor={isServiceSelected(service.id) ? 'blue.500' : 'gray.200'}
                                bg={isServiceSelected(service.id) ? 'blue.50' : 'white'}
                              >
                                <Flex justify="space-between" align="start">
                                  <VStack align="start" spacing={1}>
                                    <Checkbox 
                                      isChecked={isServiceSelected(service.id)}
                                      onChange={() => handleServiceToggle('INSURANCE', service.id)}
                                      colorScheme="blue"
                                      size="lg"
                                    >
                                      <Text fontWeight="bold">{service.name}</Text>
                                    </Checkbox>
                                    <Text fontSize="sm" color="gray.600" ml={6}>{service.description}</Text>
                                  </VStack>
                                  <Text fontWeight="bold">{service.price} ₽</Text>
                                </Flex>
                              </Box>
                            ))}
                          </Grid>
                        </TabPanel>

                        {/* Приоритетная посадка */}
                        <TabPanel>
                          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                            {availableServices['PRIORITY_BOARDING'].map(service => (
                              <Box 
                                key={service.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                p={4}
                                borderColor={isServiceSelected(service.id) ? 'blue.500' : 'gray.200'}
                                bg={isServiceSelected(service.id) ? 'blue.50' : 'white'}
                              >
                                <Flex justify="space-between" align="start">
                                  <VStack align="start" spacing={1}>
                                    <Checkbox 
                                      isChecked={isServiceSelected(service.id)}
                                      onChange={() => handleServiceToggle('PRIORITY_BOARDING', service.id)}
                                      colorScheme="blue"
                                      size="lg"
                                    >
                                      <Text fontWeight="bold">{service.name}</Text>
                                    </Checkbox>
                                    <Text fontSize="sm" color="gray.600" ml={6}>{service.description}</Text>
                                  </VStack>
                                  <Text fontWeight="bold">{service.price} ₽</Text>
                                </Flex>
                              </Box>
                            ))}
                          </Grid>
                        </TabPanel>
                      </TabPanels>
                    </Tabs>

                    {/* Выбранные услуги */}
                    {selectedPassenger.services.length > 0 && (
                      <Box mt={8}>
                        <Heading as="h4" size="md" mb={4}>
                          Выбранные услуги
                        </Heading>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Услуга</Th>
                              <Th isNumeric>Количество</Th>
                              <Th isNumeric>Цена</Th>
                              <Th isNumeric>Сумма</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {selectedPassenger.services.map(service => (
                              <Tr key={service.id}>
                                <Td>{service.name}</Td>
                                <Td isNumeric>{service.quantity || 1}</Td>
                                <Td isNumeric>{service.price} ₽</Td>
                                <Td isNumeric>{service.price * (service.quantity || 1)} ₽</Td>
                              </Tr>
                            ))}
                            <Tr fontWeight="bold">
                              <Td>Итого</Td>
                              <Td></Td>
                              <Td></Td>
                              <Td isNumeric>
                                {selectedPassenger.services.reduce((acc, service) => 
                                  acc + service.price * (service.quantity || 1), 0)
                                } ₽
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </Box>
                    )}
                  </>
                ) : (
                  <Box textAlign="center" py={10}>
                    <Text>Выберите пассажира слева, чтобы добавить услуги</Text>
                  </Box>
                )}
              </Box>
            </Flex>
          )}

          {/* Информация об общей стоимости */}
          <Box
            mt={6}
            p={6}
            bg={useColorModeValue('blue.50', 'blue.900')}
            borderRadius="lg"
          >
            <Flex 
              justify="space-between" 
              align="center"
              direction={{ base: 'column', md: 'row' }}
              gap={{ base: 4, md: 0 }}
            >
              <Box>
                <Heading as="h3" size="md" mb={1}>
                  Общая стоимость услуг
                </Heading>
                <Text>
                  Всего добавлено услуг: {passengers.reduce((acc, p) => acc + p.services.length, 0)}
                </Text>
              </Box>
              <Heading size="lg" color="blue.600">
                {totalPrice} ₽
              </Heading>
            </Flex>
          </Box>

          <Flex justifyContent="space-between" mt={6}>
            <Link href={`/dashboard/groups/${groupId}/seats`} passHref>
              <Button colorScheme="gray">Назад</Button>
            </Link>
            <Button
              rightIcon={<ArrowForwardIcon />}
              colorScheme="blue"
              onClick={handleSaveAndContinue}
              isLoading={isSaving}
            >
              Сохранить и продолжить
            </Button>
          </Flex>
        </VStack>
      </Container>
      <Footer />
    </>
  );
} 