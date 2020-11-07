import React from 'react';
import propTypes from '@styled-system/prop-types';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = ({ ...props }) => (
  <Spin indicator={<LoadingOutlined fontSize={24} spin {...props} />} />
);

Loading.propTypes = {
  ...propTypes.space,
  ...propTypes.layout,
  ...propTypes.color,
  ...propTypes.typography,
  ...propTypes.flexbox,
};

export default Loading;
