import { useState, useCallback, useRef, useEffect } from 'react';

export type IKebabItem = { value: string; action: () => any };
export type IKebabMenu = {
  items: IKebabItem[];
};

export const KebabMenu = (props: IKebabMenu) => {
  const [isActive, setIsActive] = useState(false);
  const id = `kebabmenu-${Math.ceil(Math.random() * 10000000)}`;
  const kebabRef = useRef<HTMLDivElement>(null);
  const { items } = props;

  const handleClick = useCallback(() => {
    setIsActive(!isActive);
  }, [setIsActive, isActive]);

  useEffect(() => {
    const element = kebabRef.current;

    if (element) {
      const handleClickOutside = (event: MouseEvent) => {
        // @ts-ignore
        if (!event?.target?.closest(`#${element?.id}`)) {
          setIsActive(false);
        }
      };
      window.addEventListener('click', handleClickOutside);

      return function unmount() {
        window.removeEventListener('click', handleClickOutside);
      };
    }
  }, [kebabRef]);

  return (
    <div className="kebabmenu" id={id} ref={kebabRef}>
      <span className="kebabmenu__trigger" onClick={handleClick}>
        <KebabMenuSVG />
      </span>
      <ul
        className={`kebabmenu__dropdown${
          isActive ? ' kebabmenu__dropdown--active' : ''
        }`}
      >
        {items.map((item, i) => {
          return (
            <li
              onClick={() => {
                setIsActive(false);
                item.action();
              }}
              key={`kebabmenu-${i}`}
            >
              {item.value}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const KebabMenuSVG = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2C11.1046 2 12 2.89543 12 4C12 5.10457 11.1046 6 10 6Z"
      fill="#3A434B"
    />
    <path
      d="M10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10C12 11.1046 11.1046 12 10 12Z"
      fill="#3A434B"
    />
    <path
      d="M10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14C11.1046 14 12 14.8954 12 16C12 17.1046 11.1046 18 10 18Z"
      fill="#3A434B"
    />
  </svg>
);
