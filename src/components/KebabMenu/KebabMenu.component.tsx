import { Switch, Dropdown } from 'antd';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Company } from 'src/api/types';
import { ImageLoader } from 'src/layouts/dashboard-layout/DashBoardLayout';
import dropdown from '../../../public/svgs/dropdown.svg';
import { Identity } from '../Identity/identity.component';
import { SelectInputSVG } from '../Input/seletct-input';
import { IOrganizationMenu, IProfileMenu } from '../types';

export type IKebabItem = { value: string; action?(): any; href?: string };
export type IKebabMenu = {
  items: IKebabItem[];
  // eslint-disable-next-line no-undef
  icon?(): JSX.Element;
};

export const KebabMenu = (props: IKebabMenu) => {
  const { items, icon: Icon } = props;

  const menu = (
    <ul className="kebabmenu__dropdown">
      {items.map((item, i) => {
        return (
          <li onClick={item.action} key={`kebabmenu-${i}`}>
            <Link href={item.href || '#'}>
              <a>{item.value}</a>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <Dropdown trigger={['click']} overlay={menu}>
      <button
        className="kebabmenu__trigger"
        onClick={(e) => e.preventDefault()}
      >
        {Icon ? <Icon /> : <KebabMenuSVG />}
      </button>
    </Dropdown>
  );
};

export const OrganizationsMenu = ({
  companies,
  onSelect,
  loading,
  administrator,
}: IOrganizationMenu) => {
  const [isActive, setIsActive] = useState(false);
  const [id] = useState(
    `organization-menu-${Math.ceil(Math.random() * 10000000)}`,
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const dropDownClassNames = classNames('organization-menu__dropdown', {
    'organization-menu__dropdown--active': isActive,
  });

  const handleClick = useCallback(() => {
    setIsActive(!isActive);
  }, [setIsActive, isActive]);

  useEffect(() => {
    const element = menuRef.current;

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
  }, [menuRef]);

  if (!companies.length) {
    return null;
  }

  const [selected] = companies.filter(
    (company) => company.id === administrator?.id,
  );
  const selectedCompany = selected?.company as Company;

  return (
    <div className="organization-menu" ref={menuRef} id={id}>
      <div className="organization-menu__trigger" onClick={handleClick}>
        <Identity
          name={selectedCompany?.name || 'Select Organisation'}
          initial={selectedCompany?.name?.charAt(0)}
          image={selectedCompany?.logo}
          type="reverse"
        />

        <button className="organization-menu__trigger__drop-svg">
          <Image src={dropdown} alt="down-arrow" />
        </button>
      </div>

      <ul className={dropDownClassNames}>
        <li className="organization-menu__dropdown__section">
          <span className="organization-menu__dropdown__section__title">
            My Organisation List
          </span>
          <span className="organization-menu__dropdown__section__subtitle">
            Select one at a time to go live
          </span>
        </li>
        {companies.map((a) => {
          const company = a.company as Company;
          const selected = a.id === administrator?.id;
          return (
            <li key={company?.id} className="organization-menu__dropdown__item">
              <Identity
                name={company?.name}
                initial={company?.name?.charAt(0)}
                image={company?.logo}
              />

              <Switch
                loading={loading === company?.id || (!!loading && selected)}
                checked={selected}
                onClick={() => onSelect(a, () => setIsActive(false))}
                className="organization-menu__dropdown__item__switch"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const ProfileMenu = (props: IProfileMenu) => {
  const [isActive, setIsActive] = useState(false);
  const [id] = useState(
    `organization-menu-${Math.ceil(Math.random() * 10000000)}`,
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const dropDownClassNames = classNames('profile-menu__dropdown', {
    'profile-menu__dropdown--active': isActive,
  });
  const sevClassNames = classNames('profile-menu__trigger__drop-svg', {
    'profile-menu__trigger__drop-svg--active': isActive,
  });

  const handleClick = useCallback(() => {
    setIsActive(!isActive);
  }, [setIsActive, isActive]);

  useEffect(() => {
    const element = menuRef.current;

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
  }, [menuRef]);

  return (
    <div className="profile-menu" ref={menuRef} id={id}>
      <div className="profile-menu__trigger" onClick={handleClick}>
        {props.avatar && (
          <div className="profile-menu__trigger__image">
            <ImageLoader
              src={props.avatar}
              width={36}
              height={36}
              alt="avatar"
            />
          </div>
        )}
        {!props.avatar && (
          <div className="profile-menu__trigger__initial">
            {props.name.charAt(0)}
          </div>
        )}

        <div className="profile-menu__trigger__identity">
          <p className="profile-menu__trigger__identity__name">{props.name}</p>
          <p className="profile-menu__trigger__identity__role">{props.role}</p>
        </div>

        <button className={sevClassNames}>
          <SelectInputSVG />
        </button>
      </div>

      <ul className={dropDownClassNames}>
        {props.actions.map((action, i) => {
          return (
            <li
              className="profile-menu__dropdown__item"
              key={`${id}-options-${i}`}
            >
              <Link href={action.href || '#'}>
                <a
                  onClick={() => {
                    if (action.action) {
                      action.action(() => setIsActive(false));
                    }
                  }}
                >
                  {action.name}
                </a>
              </Link>
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
