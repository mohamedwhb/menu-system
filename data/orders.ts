export interface OrderItem {
  name: string
  price: number
  quantity: number
  options?: string
}

export interface Customer {
  name: string
  email: string
  phone: string
  since: string
  orderCount: number
  averageOrderValue: number
  address?: {
    street: string
    zip: string
    city: string
  }
}

export interface Order {
  id: string
  date: string
  time: string
  table: string
  status: "new" | "in-progress" | "completed" | "cancelled"
  items: OrderItem[]
  amount: number
  discount: number
  paymentMethod: string
  notes?: string
  customer?: Customer
}

export const orders: Order[] = [
  {
    id: "ORD-1001",
    date: "15.05.2025",
    time: "18:30",
    table: "Tisch 12",
    status: "completed",
    items: [
      { name: "Wiener Schnitzel", price: 16.9, quantity: 2 },
      { name: "Caesar Salad", price: 8.5, quantity: 1 },
      { name: "Mineralwasser", price: 3.5, quantity: 2 },
      { name: "Tiramisu", price: 6.9, quantity: 2 },
    ],
    amount: 64.7,
    discount: 0,
    paymentMethod: "Kreditkarte",
    customer: {
      name: "Max Mustermann",
      email: "max@example.com",
      phone: "+49 123 456789",
      since: "10.01.2024",
      orderCount: 8,
      averageOrderValue: 58.4,
      address: {
        street: "Musterstraße 123",
        zip: "10115",
        city: "Berlin",
      },
    },
  },
  {
    id: "ORD-1002",
    date: "15.05.2025",
    time: "19:15",
    table: "Tisch 7",
    status: "in-progress",
    items: [
      { name: "Pizza Margherita", price: 10.9, quantity: 1 },
      { name: "Pasta Carbonara", price: 12.5, quantity: 1 },
      { name: "Rotwein (0,2l)", price: 5.9, quantity: 2 },
    ],
    amount: 35.2,
    discount: 0,
    paymentMethod: "Bar",
  },
  {
    id: "ORD-1003",
    date: "15.05.2025",
    time: "19:45",
    table: "Tisch 3",
    status: "new",
    items: [
      { name: "Bruschetta", price: 7.5, quantity: 1 },
      { name: "Risotto ai Funghi", price: 14.9, quantity: 1 },
      { name: "Weißwein (0,2l)", price: 5.5, quantity: 1 },
    ],
    amount: 27.9,
    discount: 0,
    paymentMethod: "Kreditkarte",
    customer: {
      name: "Laura Schmidt",
      email: "laura@example.com",
      phone: "+49 987 654321",
      since: "15.03.2024",
      orderCount: 3,
      averageOrderValue: 32.1,
    },
  },
  {
    id: "ORD-1004",
    date: "15.05.2025",
    time: "20:00",
    table: "Tisch 9",
    status: "completed",
    items: [
      { name: "Antipasti Platte", price: 14.9, quantity: 1, options: "ohne Oliven" },
      { name: "Spaghetti Bolognese", price: 11.9, quantity: 2 },
      { name: "Tiramisu", price: 6.9, quantity: 2 },
      { name: "Cola", price: 3.5, quantity: 2 },
    ],
    amount: 59.5,
    discount: 5.95,
    paymentMethod: "Bar",
    notes: "Geburtstagsgast, 10% Rabatt gewährt",
  },
  {
    id: "ORD-1005",
    date: "15.05.2025",
    time: "20:15",
    table: "Tisch 5",
    status: "cancelled",
    items: [
      { name: "Pizza Quattro Formaggi", price: 12.9, quantity: 1 },
      { name: "Mineralwasser", price: 3.5, quantity: 1 },
    ],
    amount: 16.4,
    discount: 0,
    paymentMethod: "Kreditkarte",
    notes: "Kunde musste unerwartet gehen",
  },
  {
    id: "ORD-1006",
    date: "15.05.2025",
    time: "20:30",
    table: "Tisch 14",
    status: "completed",
    items: [
      { name: "Rindersteak", price: 24.9, quantity: 2, options: "medium" },
      { name: "Grüner Salat", price: 5.9, quantity: 2 },
      { name: "Rotwein (0,75l)", price: 28.5, quantity: 1 },
    ],
    amount: 90.1,
    discount: 0,
    paymentMethod: "Kreditkarte",
    customer: {
      name: "Thomas Weber",
      email: "thomas@example.com",
      phone: "+49 555 123456",
      since: "05.02.2024",
      orderCount: 5,
      averageOrderValue: 85.3,
      address: {
        street: "Weinstraße 42",
        zip: "10789",
        city: "Berlin",
      },
    },
  },
  {
    id: "ORD-1007",
    date: "15.05.2025",
    time: "18:00",
    table: "Tisch 2",
    status: "completed",
    items: [
      { name: "Minestrone", price: 6.5, quantity: 2 },
      { name: "Lasagne", price: 13.9, quantity: 2 },
      { name: "Tiramisu", price: 6.9, quantity: 2 },
      { name: "Espresso", price: 2.5, quantity: 2 },
    ],
    amount: 59.6,
    discount: 0,
    paymentMethod: "Bar",
  },
  {
    id: "ORD-1008",
    date: "15.05.2025",
    time: "19:00",
    table: "Tisch 8",
    status: "in-progress",
    items: [
      { name: "Caprese Salat", price: 8.9, quantity: 1 },
      { name: "Gnocchi", price: 12.5, quantity: 1 },
      { name: "Mineralwasser", price: 3.5, quantity: 1 },
    ],
    amount: 24.9,
    discount: 0,
    paymentMethod: "Kreditkarte",
  },
  {
    id: "ORD-1009",
    date: "15.05.2025",
    time: "19:30",
    table: "Tisch 10",
    status: "new",
    items: [
      { name: "Bruschetta", price: 7.5, quantity: 1 },
      { name: "Pizza Diavola", price: 12.9, quantity: 1 },
      { name: "Bier vom Fass", price: 4.5, quantity: 1 },
    ],
    amount: 24.9,
    discount: 0,
    paymentMethod: "Bar",
  },
  {
    id: "ORD-1010",
    date: "15.05.2025",
    time: "20:45",
    table: "Tisch 6",
    status: "completed",
    items: [
      { name: "Carpaccio", price: 12.9, quantity: 1 },
      { name: "Ossobuco", price: 22.5, quantity: 1 },
      { name: "Panna Cotta", price: 6.5, quantity: 1 },
      { name: "Weißwein (0,2l)", price: 5.5, quantity: 2 },
    ],
    amount: 52.9,
    discount: 0,
    paymentMethod: "Kreditkarte",
    customer: {
      name: "Julia Becker",
      email: "julia@example.com",
      phone: "+49 333 789456",
      since: "20.04.2024",
      orderCount: 2,
      averageOrderValue: 48.5,
    },
  },
  {
    id: "ORD-1011",
    date: "14.05.2025",
    time: "18:15",
    table: "Tisch 4",
    status: "completed",
    items: [
      { name: "Bruschetta", price: 7.5, quantity: 2 },
      { name: "Spaghetti Carbonara", price: 12.5, quantity: 2 },
      { name: "Tiramisu", price: 6.9, quantity: 2 },
      { name: "Mineralwasser", price: 3.5, quantity: 1 },
      { name: "Cola", price: 3.5, quantity: 1 },
    ],
    amount: 60.8,
    discount: 0,
    paymentMethod: "Bar",
  },
  {
    id: "ORD-1012",
    date: "14.05.2025",
    time: "19:30",
    table: "Tisch 11",
    status: "completed",
    items: [
      { name: "Pizza Margherita", price: 10.9, quantity: 1 },
      { name: "Pizza Salami", price: 11.9, quantity: 1 },
      { name: "Bier vom Fass", price: 4.5, quantity: 2 },
    ],
    amount: 31.8,
    discount: 0,
    paymentMethod: "Kreditkarte",
  },
]
