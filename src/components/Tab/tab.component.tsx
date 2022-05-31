import { Tabs } from 'antd';
import { PropsWithChildren } from 'react';
import { ITab } from '../types';

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

Tab.TabPane = Tabs.TabPane;
