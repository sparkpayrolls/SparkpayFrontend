import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import getSocketClient from '../socket-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = getSocketClient();

    setSocket(socket);

    return () => {
      setSocket(null);
    };
  }, []);

  return socket;
};
