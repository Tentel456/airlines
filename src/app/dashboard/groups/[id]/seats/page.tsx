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
  SimpleGrid,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronRightIcon, InfoIcon } from '@chakra-ui/icons';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Passenger {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  seat?: string;
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

interface Seat {
  number: string;
  isOccupied: boolean;
  isSelected: boolean;
  passengerId?: number;
}

export default function SeatsPage() {
  const params = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Имитируем задержку загрузки
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Загружаем группу из localStorage
        const savedGroups = JSON.parse(localStorage.getItem('groups') || '[]');
        const currentGroup = savedGroups.find((g: Group) => g.id === Number(params.id));
        
        if (!currentGroup) {
          throw new Error('Группа не найдена');
        }

        // Загружаем пассажиров из localStorage
        const groupPassengers = JSON.parse(localStorage.getItem('groupPassengers') || '{}');
        const currentGroupPassengers = groupPassengers[String(params.id)]?.passengers || [];
        
        if (currentGroupPassengers.length === 0) {
          throw new Error('Сначала добавьте пассажиров в группу');
        }

        // Загружаем информацию о местах из localStorage
        const groupSeats = JSON.parse(localStorage.getItem('groupSeats') || '{}');
        const currentGroupSeats = groupSeats[String(params.id)] || [];

        // Генерируем места, если их еще нет
        let seatsToUse: Seat[];
        if (currentGroupSeats.length > 0) {
          seatsToUse = currentGroupSeats;
        } else {
          seatsToUse = Array.from({ length: 30 }, (_, i) => ({
            number: String(i + 1),
            isOccupied: Math.random() < 0.3,
            isSelected: false,
          }));
        }

        // Обновляем пассажиров с информацией о местах
        const updatedPassengers = currentGroupPassengers.map((passenger: Passenger) => {
          const assignedSeat = seatsToUse.find(seat => seat.passengerId === passenger.id);
          return {
            ...passenger,
            seat: assignedSeat?.number,
          };
        });

        setGroup(currentGroup);
        setPassengers(updatedPassengers);
        setSeats(seatsToUse);
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
  }, [params.id, toast]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isOccupied) {
      toast({
        title: 'Место занято',
        description: 'Это место уже занято другим пассажиром',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setSelectedSeat(seat);
    onOpen();
  };

  const handleAssignSeat = () => {
    if (!selectedSeat || !selectedPassenger || !group) return;

    const updatedSeats = seats.map(seat => {
      if (seat.number === selectedSeat.number) {
        return {
          ...seat,
          isSelected: true,
          passengerId: selectedPassenger.id,
        };
      }
      return seat;
    });

    const updatedPassengers = passengers.map(passenger => {
      if (passenger.id === selectedPassenger.id) {
        return {
          ...passenger,
          seat: selectedSeat.number,
        };
      }
      return passenger;
    });

    // Сохраняем обновленные места в localStorage
    const groupSeats = JSON.parse(localStorage.getItem('groupSeats') || '{}');
    const updatedGroupSeats = {
      ...groupSeats,
      [String(group.id)]: updatedSeats,
    };
    localStorage.setItem('groupSeats', JSON.stringify(updatedGroupSeats));

    setSeats(updatedSeats);
    setPassengers(updatedPassengers);

    toast({
      title: 'Место назначено',
      description: `Место ${selectedSeat.number} назначено пассажиру ${selectedPassenger.firstName} ${selectedPassenger.lastName}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    onClose();
    setSelectedSeat(null);
    setSelectedPassenger(null);
  };

  const handleSave = () => {
    if (!group) return;

    // Сохраняем текущее состояние мест в localStorage
    const groupSeats = JSON.parse(localStorage.getItem('groupSeats') || '{}');
    const updatedGroupSeats = {
      ...groupSeats,
      [String(group.id)]: seats,
    };
    localStorage.setItem('groupSeats', JSON.stringify(updatedGroupSeats));

    toast({
      title: 'Сохранено',
      description: 'Информация о местах успешно сохранена',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.isOccupied) return 'red.500';
    if (seat.isSelected) return 'green.500';
    return 'gray.200';
  };

  const isAllSeatsAssigned = () => {
    return passengers.every(passenger => passenger.seat);
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
              <BreadcrumbLink>Выбор мест</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Выбор мест
            </Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              Выберите места для пассажиров группы
            </Text>
          </Box>

          <Box
            bg={useColorModeValue('white', 'gray.700')}
            p={6}
            borderRadius="lg"
            boxShadow="md"
          >
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="medium">Рейс: {group.flightNumber}</Text>
                  <Text>{group.departureCity} → {group.arrivalCity}</Text>
                </Box>
                <HStack spacing={4}>
                  <HStack>
                    <Box w={4} h={4} bg="gray.200" borderRadius="sm" />
                    <Text>Свободно</Text>
                  </HStack>
                  <HStack>
                    <Box w={4} h={4} bg="red.500" borderRadius="sm" />
                    <Text>Занято</Text>
                  </HStack>
                  <HStack>
                    <Box w={4} h={4} bg="green.500" borderRadius="sm" />
                    <Text>Выбрано</Text>
                  </HStack>
                </HStack>
              </HStack>

              <SimpleGrid columns={6} spacing={4}>
                {seats.map((seat) => (
                  <Tooltip
                    key={seat.number}
                    label={
                      seat.isOccupied
                        ? 'Место занято'
                        : seat.isSelected
                        ? `Место выбрано для пассажира ${
                            passengers.find(p => p.id === seat.passengerId)?.firstName
                          }`
                        : 'Нажмите для выбора'
                    }
                  >
                    <IconButton
                      aria-label={`Место ${seat.number}`}
                      icon={<Text>{seat.number}</Text>}
                      bg={getSeatColor(seat)}
                      color="white"
                      _hover={{
                        bg: seat.isOccupied ? 'red.600' : seat.isSelected ? 'green.600' : 'gray.300',
                      }}
                      onClick={() => handleSeatClick(seat)}
                      isDisabled={seat.isOccupied || seat.isSelected}
                    />
                  </Tooltip>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>

          <Box
            bg={useColorModeValue('white', 'gray.700')}
            p={6}
            borderRadius="lg"
            boxShadow="md"
          >
            <VStack spacing={6} align="stretch">
              <Heading size="md">Пассажиры и места</Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {passengers.map((passenger) => (
                  <Box
                    key={passenger.id}
                    p={4}
                    borderWidth={1}
                    borderRadius="md"
                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                  >
                    <Text fontWeight="medium">
                      {passenger.lastName} {passenger.firstName} {passenger.middleName}
                    </Text>
                    <Text color={passenger.seat ? 'green.500' : 'gray.500'}>
                      {passenger.seat ? `Место: ${passenger.seat}` : 'Место не выбрано'}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </Box>

          <HStack spacing={4} justify="flex-end">
            <Link href={`/dashboard/groups/${group.id}/passengers`} passHref>
              <Button variant="ghost">Назад</Button>
            </Link>
            <Button colorScheme="blue" onClick={handleSave}>
              Сохранить
            </Button>
            <Link href={`/dashboard/groups/${group.id}/services`} passHref>
              <Button
                colorScheme="blue"
                rightIcon={<ChevronRightIcon />}
                isDisabled={!isAllSeatsAssigned()}
              >
                Дополнительные услуги
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Выбор пассажира</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Text>Выберите пассажира для места {selectedSeat?.number}</Text>
              {passengers.map((passenger) => (
                <Button
                  key={passenger.id}
                  variant={selectedPassenger?.id === passenger.id ? 'solid' : 'outline'}
                  onClick={() => setSelectedPassenger(passenger)}
                >
                  {passenger.lastName} {passenger.firstName} {passenger.middleName}
                </Button>
              ))}
              <Button
                colorScheme="blue"
                onClick={handleAssignSeat}
                isDisabled={!selectedPassenger}
              >
                Назначить место
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Footer />
    </>
  );
} 