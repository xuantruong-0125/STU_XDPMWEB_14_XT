"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getMe } from "../utils/auth";

// ✅ định nghĩa type User
interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  address: string;
  posts: any[]; // hoặc Post[] nếu bạn import type
}

// ✅ định nghĩa context type
type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUser: () => Promise<void>;
};

// ✅ KHÔNG dùng any nữa
const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const data = await getMe();
    setUser(data?.data?.user || data?.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

// ✅ custom hook an toàn
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};