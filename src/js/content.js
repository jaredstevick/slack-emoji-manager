import React from 'react';
import { render } from 'react-dom';
import Download from './components/download';
import Upload from './components/upload';
import '../css/download.css';
import '../css/upload.css';

const add_emoji_form = document.querySelector('#addemoji');
const bulkEmojiTools = document.createElement('div');

add_emoji_form.appendChild(bulkEmojiTools);

render((
  <div>
    <hr />
    <Upload />
    <hr />
    <Download />
  </div>
), bulkEmojiTools);
