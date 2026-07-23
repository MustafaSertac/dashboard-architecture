import { User, UserRole } from "./types";

interface AuthUser extends User {
  password?: string;
}

export const MOCK_USERS: AuthUser[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@edu.com",
    role: "admin",
    password: "admin123",
  },
  {
    id: "2",
    name: "Ahmet Hoca",
    email: "ahmet@edu.com",
    role: "teacher",
    password: "teacher123",
  },
  {
    id: "3",
    name: "Elif Ogrenci",
    email: "elif@edu.com",
    role: "student",
    password: "student123",
  },
  {
    id: "4",
    name: "Mehmet Ogrenci",
    email: "mehmet@edu.com",
    role: "student",
    password: "student123",
  },
  {
    id: "5",
    name: "Zeynep Ogrenci",
    email: "zeynep@edu.com",
    role: "student",
    password: "student123",
  },
  {
    id: "6",
    name: "Burak Yilmaz",
    email: "burak@edu.com",
    role: "student",
    password: "student123",
  },
  {
    id: "7",
    name: "Selin Kaya",
    email: "selin@edu.com",
    role: "student",
    password: "student123",
  },
];
