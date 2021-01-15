import React from 'react';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2020"
    links={[
      {
        key: 'FIFSKY',
        title: 'FIFSKY',
        href: 'https://fifsky.com',
        blankTarget: true,
      },
    ]}
  />
);
