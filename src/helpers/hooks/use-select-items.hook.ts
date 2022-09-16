import { useState } from 'react';

export const useSelectItems = (items: string[]) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const allChecked = !!items.length && selected.length >= items.length;

  const clearSelection = () => {
    setSelectAll(false);
    setSelected([]);
  };
  const handleCheckAllClick = () => {
    if (selected.length || selectAll) {
      clearSelection();
    } else {
      setSelected(items.map((item) => item));
    }
  };
  const handleSelectAllClick = () => {
    setSelectAll(true);
  };
  const getCheckClickHandler = (item: string) => {
    return () => {
      if (selected.includes(item)) {
        setSelectAll(false);
        setSelected(selected.filter((s) => s !== item));
      } else {
        setSelected([...selected, item]);
      }
    };
  };

  return {
    allChecked,
    selected,
    selectAll,
    clearSelection,
    handleCheckAllClick,
    handleSelectAllClick,
    getCheckClickHandler,
  };
};
