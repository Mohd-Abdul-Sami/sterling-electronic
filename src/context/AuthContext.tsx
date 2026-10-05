import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Address } from '../types';
import { getUsers, updateUser } from '../services/db';

interface AuthContextType {
  currentUser: User;
  users: User[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  canManageProducts: boolean;
  canManageOrders: boolean;
  canManageInventory: boolean;
  switchUserRole: (role: UserRole) => void;
  setUser: (user: User) => void;
  updateCurrentUserProfile: (updates: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(getUsers());
  // Default to customer Princesami for natural ecommerce flow
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const list = getUsers();
    return list.find((u) => u.email === 'Princesami4444@gmail.com') || list[0];
  });

  useEffect(() => {
    const list = getUsers();
    setUsers(list);
  }, []);

  const switchUserRole = (targetRole: UserRole) => {
    const list = getUsers();
    let match = list.find((u) => u.role === targetRole);
    if (!match) {
      if (targetRole === 'customer') {
        match = list.find((u) => u.role === 'customer') || list[1];
      } else {
        match = list.find((u) => u.role === 'super_admin' || u.role === 'admin') || list[0];
      }
    }
    if (match) {
      setCurrentUser(match);
    }
  };

  const updateCurrentUserProfile = (updates: Partial<User>) => {
    const updated = updateUser(currentUser.id, updates);
    if (updated) {
      setCurrentUser(updated);
    }
  };

  const addAddress = (addrData: Omit<Address, 'id'>) => {
    const newId = `addr-${Date.now()}`;
    const newAddress: Address = { ...addrData, id: newId };
    const existing = currentUser.addresses || [];
    const updatedAddresses = [...existing, newAddress];
    updateCurrentUserProfile({ addresses: updatedAddresses });
  };

  const role = currentUser.role;
  const isSuperAdmin = role === 'super_admin';
  const isAdmin = role === 'super_admin' || role === 'admin';
  const canManageProducts = isSuperAdmin || role === 'admin' || role === 'content_manager';
  const canManageOrders = isSuperAdmin || role === 'admin' || role === 'order_manager';
  const canManageInventory = isSuperAdmin || role === 'admin' || role === 'inventory_manager';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAdmin,
        isSuperAdmin,
        canManageProducts,
        canManageOrders,
        canManageInventory,
        switchUserRole,
        setUser: setCurrentUser,
        updateCurrentUserProfile,
        addAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
