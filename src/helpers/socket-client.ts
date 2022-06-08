import Cookies from 'js-cookie';
import { io, Socket } from 'socket.io-client';
import { config } from './config';

let client: Socket | null = null;
const getSocketClient = () => {
  let _client = client;
  if (!_client) {
    const authToken = Cookies.get('auth_token') as string;
    const { apiUrl } = config();
    _client = io(`${apiUrl}`, {
      transports: ['websocket'],
      query: {
        authorization: authToken,
      },
      transportOptions: {
        websocket: {
          headers: {
            authorization: authToken,
          },
          extraHeaders: {
            authorization: authToken,
          },
        },
      },
    });
    client = _client;
  }

  return _client;
};

export default getSocketClient;
