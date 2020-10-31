import React from 'react';
import moment from 'moment';
import { FooterContainer } from './elements';

const Footer = () => {
  return <FooterContainer>{`Copyright© ${moment().format('YYYY')}`}</FooterContainer>;
};

export default Footer;
