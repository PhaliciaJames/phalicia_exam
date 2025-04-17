"use client";

import React, { createContext, useContext, useState } from "react";
import { Session as LuciaSession } from "lucia";

// Define the UserRole enum to match Prisma
export type UserRole =
  | "USER"
  | "CUSTOMER"
  | "PROCUSTOMER"
  | "EDITOR"
  | "ADMIN"
  | "SUPERADMIN";

// Updated SessionUser type with email and null support for avatarUrl
export interface SessionUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  postcode: string;
  country: string;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  role: UserRole;
}

// Extend Lucia's Session type with our user type
export interface SessionWithUser extends LuciaSession {
  user: SessionUser;
}

// Updated SessionContext interface to handle null values
interface SessionContext {
  user: SessionUser;
  session: SessionWithUser;
  updateAvatar: (newAvatarUrl: string | null) => void;
  updateBackground: (newBackgroundUrl: string | null) => void;
}

const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: {
    user: SessionUser;
    session: LuciaSession;
  };
}) {
  // Use state to store the user data so we can update it
  const [userData, setUserData] = useState<SessionUser>(value.user);

  // Updated to handle null values
  const updateAvatar = (newAvatarUrl: string | null) => {
    setUserData((prevUser) => ({
      ...prevUser,
      avatarUrl: newAvatarUrl,
    }));
  };
  
  // Updated to handle null values
  const updateBackground = (newBackgroundUrl: string | null) => {
    setUserData((prevUser) => ({
      ...prevUser,
      backgroundUrl: newBackgroundUrl,
    }));
  };

  // Transform the value to match our SessionContext type
  const sessionValue: SessionContext = {
    user: userData,
    session: {
      ...value.session,
      user: userData,
    },
    updateAvatar,
    updateBackground,
  };

  return (
    <SessionContext.Provider value={sessionValue}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}