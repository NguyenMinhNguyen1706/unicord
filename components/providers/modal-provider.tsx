"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ModalData {
  server?: any;
  channel?: any;
  channelType?: string;
  member?: any;
  apiUrl?: string;
  query?: Record<string, any>;
}

type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage" | "createDeadline" | "leaveServer" | "deleteServer";

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

const ModalContext = createContext<ModalStore | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<ModalType | null>(null);
  const [data, setData] = useState<ModalData>({});
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = (type: ModalType, data: ModalData = {}) => {
    setType(type);
    setData(data);
    setIsOpen(true);
  };

  const onClose = () => {
    setType(null);
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ type, data, isOpen, onOpen, onClose }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
