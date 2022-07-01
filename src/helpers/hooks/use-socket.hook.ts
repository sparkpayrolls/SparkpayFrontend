import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useAppSelector } from 'src/redux/hooks';
import getSocketClient from '../socket-client';

export const useSocket = () => {
  const user = useAppSelector((state) => state.user);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = getSocketClient();

    setSocket(socket);

    return () => {
      setSocket(null);
    };
  }, [user]);

  return socket;
};
