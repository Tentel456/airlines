# Групповая регистрация на авиарейсы

Веб-приложение для удобной регистрации группы людей на рейс в аэропорту. 

## Назначение

Данное приложение разработано для организаторов групповых поездок и индивидуальных пользователей, путешествующих большими группами. Оно позволяет упростить и автоматизировать процесс регистрации на авиарейсы для нескольких пассажиров одновременно.

## Целевая аудитория

- **Организаторы групповых поездок**: туристические агентства, корпоративные организаторы мероприятий, учителя, спортивные тренеры
- **Индивидуальные пользователи**: люди, путешествующие большими семьями или группами друзей

## Основной функционал

- Создание группы пассажиров
- Выбор авиакомпании и рейса
- Указание количества пассажиров
- Ручной ввод данных пассажиров
- Выбор мест для каждого пассажира
- Добавление дополнительных услуг:
  - Дополнительный багаж
  - Заказ специального питания
  - Страховка
- Генерация посадочных талонов
- Отправка посадочных талонов на электронную почту каждому пассажиру

## Технический стек

- **Frontend**: React.js, Next.js
- **Backend**: Node.js, Express.js
- **База данных**: PostgreSQL
- **Аутентификация**: JWT
- **Отправка электронной почты**: Nodemailer

## Установка и запуск

1. Клонировать репозиторий:
```bash
git clone [url-репозитория]
cd airport-group-check-in
```

2. Установить зависимости:
```bash
npm install
```

3. Создать файл `.env` в корне проекта и добавить необходимые переменные среды:
```
DATABASE_URL=postgresql://username:password@localhost:5432/airport_group_check_in
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

4. Запустить разработческий сервер:
```bash
npm run dev
```

5. Открыть в браузере [http://localhost:3000](http://localhost:3000)

## Дипломный проект

Данное приложение разработано в рамках дипломного проекта. Полная документация доступна в папке `/docs`. 

## Описание
Система групповой регистрации пассажиров на рейс представляет собой веб-приложение, разработанное с использованием современного стека технологий:
- Next.js 14 (React фреймворк)
- TypeScript
- Chakra UI (компонентная библиотека)
- LocalStorage (для хранения данных)

Приложение позволяет создавать и управлять группами пассажиров для регистрации на авиарейсы, включая функционал добавления пассажиров, выбора мест и генерации посадочных талонов.

## Техническая документация

### 1. Архитектура приложения

#### 1.1 Структура проекта
```
airport-group-check-in/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── groups/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── passengers/
│   │   │   │   │   ├── seats/
│   │   │   │   │   ├── services/
│   │   │   │   │   └── boarding-passes/
│   │   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   └── components/
│       ├── Header.tsx
│       └── Footer.tsx
```

#### 1.2 Основные компоненты
1. **Панель управления** (`/dashboard/page.tsx`)
   - Отображение списка всех групп
   - Создание новых групп
   - Управление существующими группами

2. **Создание группы** (`/dashboard/groups/new/page.tsx`)
   - Форма создания новой группы
   - Валидация данных
   - Сохранение в localStorage

3. **Управление пассажирами** (`/dashboard/groups/[id]/passengers/page.tsx`)
   - Добавление/удаление пассажиров
   - Ввод персональных данных
   - Сохранение информации о пассажирах

4. **Выбор мест** (`/dashboard/groups/[id]/seats/page.tsx`)
   - Визуализация схемы салона
   - Выбор мест для пассажиров
   - Сохранение выбранных мест

5. **Посадочные талоны** (`/dashboard/groups/[id]/boarding-passes/page.tsx`)
   - Генерация посадочных талонов
   - Отправка талонов на email
   - Просмотр и скачивание талонов

### 2. Реализация функционала

#### 2.1 Хранение данных
В проекте используется localStorage для хранения данных в следующей структуре:

```typescript
// Группы
{
  groups: [
    {
      id: number,
      name: string,
      flightNumber: string,
      departureCity: string,
      arrivalCity: string,
      departureDate: string,
      departureTime: string,
      passengersCount: number
    }
  ]
}

// Пассажиры
{
  groupPassengers: {
    [groupId: string]: {
      groupId: number,
      passengers: [
        {
          id: number,
          firstName: string,
          lastName: string,
          middleName: string,
          passportNumber: string,
          email?: string
        }
      ]
    }
  }
}

// Места
{
  groupSeats: {
    [groupId: string]: [
      {
        number: string,
        isOccupied: boolean,
        isSelected: boolean,
        passengerId?: number
      }
    ]
  }
}
```

#### 2.2 Основные функции

1. **Создание группы**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const newGroup = {
    id: Date.now(),
    name: formData.name,
    flightNumber: formData.flightNumber,
    departureCity: formData.departureCity,
    arrivalCity: formData.arrivalCity,
    departureDate: formData.departureDate,
    departureTime: formData.departureTime,
    passengersCount: formData.passengersCount,
    status: 'active'
  };

  const existingGroups = JSON.parse(localStorage.getItem('groups') || '[]');
  localStorage.setItem('groups', JSON.stringify([...existingGroups, newGroup]));
};
```

2. **Добавление пассажиров**
```typescript
const handleAddPassenger = () => {
  const passenger = {
    id: passengers.length + 1,
    firstName: newPassenger.firstName,
    lastName: newPassenger.lastName,
    middleName: newPassenger.middleName || '',
    passportNumber: newPassenger.passportNumber,
    email: newPassenger.email || ''
  };

  const groupPassengers = JSON.parse(localStorage.getItem('groupPassengers') || '{}');
  const updatedGroupPassengers = {
    ...groupPassengers,
    [String(group.id)]: {
      groupId: group.id,
      passengers: [...passengers, passenger]
    }
  };
  localStorage.setItem('groupPassengers', JSON.stringify(updatedGroupPassengers));
};
```

3. **Выбор мест**
```typescript
const handleAssignSeat = () => {
  const updatedSeats = seats.map(seat => {
    if (seat.number === selectedSeat.number) {
      return {
        ...seat,
        isSelected: true,
        passengerId: selectedPassenger.id
      };
    }
    return seat;
  });

  const groupSeats = JSON.parse(localStorage.getItem('groupSeats') || '{}');
  localStorage.setItem('groupSeats', JSON.stringify({
    ...groupSeats,
    [String(group.id)]: updatedSeats
  }));
};
```

### 3. Особенности реализации

#### 3.1 Типизация данных
В проекте используется TypeScript для обеспечения типобезопасности:

```typescript
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

interface Passenger {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  passportNumber: string;
  email?: string;
  seat?: string;
}

interface Seat {
  number: string;
  isOccupied: boolean;
  isSelected: boolean;
  passengerId?: number;
}
```

#### 3.2 Управление состоянием
- Использование React hooks (useState, useEffect)
- Локальное хранение состояния компонентов
- Синхронизация с localStorage

#### 3.3 UI/UX особенности
1. **Адаптивный дизайн**
   - Использование Chakra UI для создания отзывчивого интерфейса
   - Поддержка различных размеров экрана
   - Мобильная версия

2. **Интерактивные элементы**
   - Анимации при наведении
   - Модальные окна для действий
   - Визуальная обратная связь

3. **Навигация**
   - Хлебные крошки
   - Кнопки навигации
   - Понятная структура страниц

### 4. Безопасность и валидация

#### 4.1 Валидация данных
- Проверка обязательных полей
- Валидация форматов данных
- Обработка ошибок

#### 4.2 Обработка ошибок
```typescript
try {
  // Операции с данными
} catch (error) {
  toast({
    title: 'Ошибка',
    description: error instanceof Error ? error.message : 'Произошла ошибка',
    status: 'error',
    duration: 5000,
    isClosable: true
  });
}
```

### 5. Тестирование и отладка

#### 5.1 Тестирование функционала
- Проверка создания групп
- Тестирование добавления пассажиров
- Валидация выбора мест
- Проверка генерации посадочных талонов

#### 5.2 Отладка
- Использование console.log для отладки
- Проверка данных в localStorage
- Валидация типов данных

### 6. Возможные улучшения

1. **Бэкенд интеграция**
   - Замена localStorage на API
   - Реализация аутентификации
   - Безопасное хранение данных

2. **Дополнительный функционал**
   - Экспорт данных
   - История изменений
   - Уведомления

3. **Оптимизация**
   - Кэширование данных
   - Оптимизация производительности
   - Улучшение UX

### 7. Заключение

Проект представляет собой полноценное веб-приложение для управления групповой регистрацией пассажиров на рейс. Основные особенности:
- Современный стек технологий
- Типобезопасность благодаря TypeScript
- Адаптивный дизайн
- Интуитивно понятный интерфейс
- Масштабируемая архитектура

Система готова к дальнейшему развитию и интеграции с реальным бэкендом. 