import { useEffect } from 'react';
// @ts-ignore
import TawkTo from 'tawkto-react';

let tawkToInstance: any;

export const useTawkto = () => {
  useEffect(() => {
    if (!tawkToInstance) {
      tawkToInstance = new TawkTo('627a74667b967b11798ea98e', '1g2n5dcgr');
    }
    tawkToInstance.showWidget();

    return () => {
      tawkToInstance.hideWidget();
    };
  }, []);
};
