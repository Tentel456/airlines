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
  Heading,
  Text,
  Stack,
  SimpleGrid,
  HStack,
  VStack,
  Badge,
  Divider,
  Input,
  FormControl,
  FormLabel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
  useToast,
  useDisclosure,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  IconButton,
  Image,
} from '@chakra-ui/react';
import {
  ChevronRightIcon,
  DownloadIcon,
  EmailIcon,
  ViewIcon,
  CheckIcon,
} from '@chakra-ui/icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Интерфейсы для типов
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

interface Seat {
  number: string;
  isOccupied: boolean;
  isSelected: boolean;
  passengerId?: number;
}

interface Passenger {
  id: number;
  firstName: string;
  lastName: string;
  passportNumber: string;
  email?: string;
  phone?: string;
  seatNumber: string;
  boardingPass?: BoardingPass;
}

interface BoardingPass {
  id: number;
  qrCode: string;
  gate: string;
  boardingTime: string;
  emailSent: boolean;
}

// Текущая дата плюс 2 недели для демонстрации
const flightDate = new Date();
flightDate.setDate(flightDate.getDate() + 14);

export default function BoardingPassesPage({ params }: { params: { id: string } }) {
  const groupId = params.id;
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Имитируем задержку загрузки
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Загружаем группу из localStorage
        const savedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
        const currentGroup = savedGroups.find((g: Group) => g.id === Number(groupId));
        
        if (!currentGroup) {
          throw new Error('Группа не найдена');
        }

        // Загружаем пассажиров из localStorage
        const groupPassengers = JSON.parse(localStorage.getItem('groupPassengers') || '{}');
        const currentGroupPassengers = groupPassengers[String(groupId)]?.passengers || [];
        
        if (currentGroupPassengers.length === 0) {
          throw new Error('Сначала добавьте пассажиров в группу');
        }

        // Загружаем информацию о местах из localStorage
        const groupSeats = JSON.parse(localStorage.getItem('groupSeats') || '{}');
        const currentGroupSeats = groupSeats[String(groupId)] || [];

        // Обновляем пассажиров с информацией о местах
        const updatedPassengers = currentGroupPassengers.map((passenger: Passenger) => {
          const assignedSeat = currentGroupSeats.find((seat: Seat) => seat.passengerId === passenger.id);
          return {
            ...passenger,
            seatNumber: assignedSeat?.number || 'Не назначено',
          };
        });

        setPassengers(updatedPassengers);
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
  }, [groupId, toast]);

  // Обработчик генерации посадочных талонов для всех пассажиров
  const handleGenerateBoardingPasses = async () => {
    setIsGenerating(true);

    try {
      // В реальном приложении здесь будет запрос к API для генерации посадочных талонов
      // const response = await fetch(`/api/groups/${groupId}/boarding-passes/generate`, {
      //   method: 'POST',
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Ошибка при генерации посадочных талонов');
      // }

      // Для демонстрации просто имитируем успешную генерацию
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Генерируем посадочные талоны для демонстрации
      const updatedPassengers = passengers.map(passenger => {
        // Генерируем случайные данные для каждого пассажира
        const gate = `A${Math.floor(Math.random() * 15) + 1}`;
        const boardingHour = Math.floor(Math.random() * 2) + 8; // 8:00 - 9:59
        const boardingMinute = Math.floor(Math.random() * 60);
        const boardingTime = `${boardingHour.toString().padStart(2, '0')}:${boardingMinute.toString().padStart(2, '0')}`;

        return {
          ...passenger,
          boardingPass: {
            id: passenger.id,
            gate,
            boardingTime,
            qrCode: `BP${passenger.id}${Date.now()}`,
            emailSent: false,
          }
        };
      });

      setPassengers(updatedPassengers);
      
      toast({
        title: 'Посадочные талоны сгенерированы',
        description: 'Все посадочные талоны успешно сгенерированы',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Ошибка генерации',
        description: error instanceof Error ? error.message : 'Произошла ошибка при генерации посадочных талонов',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Обработчик открытия модального окна для просмотра посадочного талона
  const handleViewBoardingPass = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
    onOpen();
  };

  // Обработчик отправки посадочных талонов по электронной почте
  const handleSendBoardingPasses = async () => {
    // Проверяем, что у всех пассажиров есть посадочные талоны и email
    const invalidPassengers = passengers.filter(p => !p.boardingPass || !p.email);
    if (invalidPassengers.length > 0) {
      toast({
        title: 'Невозможно отправить посадочные талоны',
        description: 'У некоторых пассажиров отсутствует посадочный талон или электронная почта',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsSending(true);

    try {
      // В реальном приложении здесь будет запрос к API для отправки посадочных талонов
      // const response = await fetch(`/api/groups/${groupId}/boarding-passes/send`, {
      //   method: 'POST',
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Ошибка при отправке посадочных талонов');
      // }

      // Для демонстрации просто имитируем успешную отправку
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Обновляем статус отправки для всех пассажиров
      const updatedPassengers = passengers.map(passenger => ({
        ...passenger,
        boardingPass: passenger.boardingPass ? {
          ...passenger.boardingPass,
          emailSent: true,
        } : undefined,
      }));

      setPassengers(updatedPassengers);
      
      toast({
        title: 'Посадочные талоны отправлены',
        description: 'Все посадочные талоны успешно отправлены на электронную почту',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Ошибка отправки',
        description: error instanceof Error ? error.message : 'Произошла ошибка при отправке посадочных талонов',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  // Проверка, все ли пассажиры имеют посадочные талоны
  const allHaveBoardingPasses = passengers.every(p => p.boardingPass);
  // Проверка, все ли посадочные талоны отправлены по электронной почте
  const allBoardingPassesSent = passengers.every(p => p.boardingPass?.emailSent);

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
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Посадочные талоны</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Посадочные талоны
            </Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              Управление посадочными талонами для пассажиров вашей группы
            </Text>
          </Box>

          <Box
            p={6}
            bg={useColorModeValue('blue.50', 'blue.900')}
            borderRadius="lg"
          >
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              align={{ base: 'start', md: 'center' }}
              gap={4}
            >
              <Box>
                <Heading as="h3" size="md" mb={1}>
                  Рейс SU1234
                </Heading>
                <HStack spacing={4}>
                  <Text fontWeight="medium">Москва (SVO)</Text>
                  <Text>→</Text>
                  <Text fontWeight="medium">Санкт-Петербург (LED)</Text>
                </HStack>
                <Text mt={1} fontSize="sm">
                  {flightDate.toLocaleDateString('ru-RU', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}, 10:30
                </Text>
              </Box>
              <HStack spacing={4}>
                <Button
                  leftIcon={<DownloadIcon />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={handleGenerateBoardingPasses}
                  isLoading={isGenerating}
                  isDisabled={allHaveBoardingPasses}
                >
                  {allHaveBoardingPasses ? 'Талоны сгенерированы' : 'Сгенерировать талоны'}
                </Button>
                <Button
                  leftIcon={<EmailIcon />}
                  colorScheme="blue"
                  onClick={handleSendBoardingPasses}
                  isLoading={isSending}
                  isDisabled={!allHaveBoardingPasses || allBoardingPassesSent}
                >
                  {allBoardingPassesSent ? 'Талоны отправлены' : 'Отправить на почту'}
                </Button>
              </HStack>
            </Flex>
          </Box>

          {isLoading ? (
            <Box textAlign="center" py={10}>
              <Text>Загрузка данных...</Text>
            </Box>
          ) : (
            <Box
              bg={useColorModeValue('white', 'gray.700')}
              p={6}
              borderRadius="lg"
              boxShadow="md"
            >
              <Heading as="h3" size="md" mb={6}>
                Список пассажиров
              </Heading>

              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Пассажир</Th>
                    <Th>Паспорт</Th>
                    <Th>Место</Th>
                    <Th>Электронная почта</Th>
                    <Th>Статус</Th>
                    <Th>Действия</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {passengers.map(passenger => (
                    <Tr key={passenger.id}>
                      <Td>
                        {passenger.firstName} {passenger.lastName}
                      </Td>
                      <Td>{passenger.passportNumber}</Td>
                      <Td>{passenger.seatNumber}</Td>
                      <Td>{passenger.email || '—'}</Td>
                      <Td>
                        {passenger.boardingPass ? (
                          <Badge colorScheme={passenger.boardingPass.emailSent ? 'green' : 'blue'}>
                            {passenger.boardingPass.emailSent ? 'Отправлен' : 'Сгенерирован'}
                          </Badge>
                        ) : (
                          <Badge colorScheme="gray">Не сгенерирован</Badge>
                        )}
                      </Td>
                      <Td>
                        <IconButton
                          aria-label="Просмотр талона"
                          icon={<ViewIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => handleViewBoardingPass(passenger)}
                          isDisabled={!passenger.boardingPass}
                          mr={2}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}

          <Flex justify="space-between" mt={4}>
            <Link href={`/dashboard/groups/${groupId}/services`} passHref>
              <Button colorScheme="gray">Назад</Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button colorScheme="blue">
                Завершить
              </Button>
            </Link>
          </Flex>
        </VStack>
      </Container>

      {/* Модальное окно для просмотра посадочного талона */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Посадочный талон</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPassenger && selectedPassenger.boardingPass && (
              <Box 
                p={6} 
                borderWidth="1px" 
                borderRadius="lg" 
                bg="white"
              >
                <Flex justify="space-between" align="start">
                  <Box>
                    <Text fontSize="sm" color="gray.500">ПОСАДОЧНЫЙ ТАЛОН</Text>
                    <Heading as="h4" size="md" mt={1} mb={4}>
                      Москва → Санкт-Петербург
                    </Heading>
                  </Box>
                  <Box textAlign="right">
                    <Text fontSize="sm" color="gray.500">РЕЙС</Text>
                    <Text fontWeight="bold">SU1234</Text>
                  </Box>
                </Flex>

                <Divider my={4} />

                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">ПАССАЖИР</Text>
                    <Text fontWeight="bold">{selectedPassenger.lastName} {selectedPassenger.firstName}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">КЛАСС</Text>
                    <Text fontWeight="bold">Эконом</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">ДАТА</Text>
                    <Text fontWeight="bold">{flightDate.toLocaleDateString('ru-RU')}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">ВРЕМЯ ВЫЛЕТА</Text>
                    <Text fontWeight="bold">10:30</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">МЕСТО</Text>
                    <Text fontWeight="bold">{selectedPassenger.seatNumber}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">ПОСАДКА</Text>
                    <Text fontWeight="bold">{selectedPassenger.boardingPass.boardingTime}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">ВЫХОД</Text>
                    <Text fontWeight="bold">{selectedPassenger.boardingPass.gate}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.500">ДОКУМЕНТ</Text>
                    <Text fontWeight="bold">{selectedPassenger.passportNumber}</Text>
                  </Box>
                </SimpleGrid>

                <Box mt={6} textAlign="center">
                  <Box 
                    width="150px" 
                    height="150px" 
                    bg="gray.200" 
                    mx="auto" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    mb={2}
                  >
                    <Text fontSize="sm" color="gray.600">QR код</Text>
                  </Box>
                  <Text fontSize="xs" color="gray.500">
                    {selectedPassenger.boardingPass.qrCode}
                  </Text>
                </Box>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Закрыть
            </Button>
            <Button variant="outline">Скачать PDF</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Footer />
    </>
  );
} 