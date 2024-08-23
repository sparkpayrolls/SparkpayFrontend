import { useState, useCallback, useEffect } from 'react';

const PayrollScrollState = () => {
  const [styles, setStyles] = useState({
    backgroundColor: 'white',
    zIndex: 1,
    boxShadow: 'none',
  });

  const handleScroll = useCallback(() => {
    const scrollPosition =
      document.querySelector('.dashboard-layout-v2__content')?.scrollTop || 0;
    if (scrollPosition > 50) {
      setStyles({
        backgroundColor: 'white',
        zIndex: 9,
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 8px 10px 2px',
      });
    } else {
      setStyles({
        backgroundColor: 'white',
        zIndex: 1,
        boxShadow: 'none',
      });
    }
  }, []);

  useEffect(() => {}, [styles]);

  return {
    styles,
    handleScroll,
  };
};

export default PayrollScrollState;

