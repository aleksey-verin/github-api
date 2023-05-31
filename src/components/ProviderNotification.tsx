'use client';
import { FC, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface ProviderNotificationProps {
  children: ReactNode;
}

const ProviderNotification: FC<ProviderNotificationProps> = ({ children }) => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} containerStyle={{ inset: 9 }} />
      {children}
    </>
  );
};

export default ProviderNotification;
