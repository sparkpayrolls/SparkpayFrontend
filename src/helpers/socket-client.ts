import Cookies from 'js-cookie';
import { io, Socket } from 'socket.io-client';
import { config } from './config';

let client: Socket | null = null;
let authToken: string;
const getSocketClient = () => {
  let _client = client;
  const _authToken = Cookies.get('auth_token') as string;
  if (_client && _authToken !== authToken) {
    _client.disconnect();
    _client = null;
  }
  if (!_client) {
    authToken = _authToken;
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
