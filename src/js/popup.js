import '../css/popup.css';
import '../img/neutral.png';
import Greeting from './components/greeting';
import React from 'react';
import { render } from 'react-dom';

render(
  <Greeting />,
  window.document.getElementById('app-container'),
);
