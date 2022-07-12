import { useEffect } from 'react';
// @ts-ignore
import TawkTo from 'tawkto-react';

const tawkToInstance = new TawkTo('627a74667b967b11798ea98e', '1g2n5dcgr');

export const useTawkto = () => {
  useEffect(() => {
    tawkToInstance.showWidget();

    return () => {
      tawkToInstance.hideWidget();
    };
  }, []);
};
