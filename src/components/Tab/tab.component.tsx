import type { TabsProps, TabPaneProps } from 'antd';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';
import { ITab } from '../types';

const Tabs = dynamic<TabsProps>(() => {
  return import('antd').then((mod) => mod.Tabs);
});

const TabPane = dynamic<TabPaneProps>(() => {
  return import('antd').then((mod) => mod.Tabs.TabPane);
});

export const Tab = (props: PropsWithChildren<ITab>) => {
  return (
    <div className="tab">
      <Tabs
        defaultActiveKey={props.default}
        activeKey={props.active}
        onChange={props.onChange}
      >
        {props.children}
      </Tabs>
    </div>
  );
};

Tab.TabPane = TabPane;
