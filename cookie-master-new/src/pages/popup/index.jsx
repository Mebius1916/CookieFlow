import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Popup from './Popup.jsx';
import 'antd/dist/reset.css';
import '../../styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <Popup />
    </ConfigProvider>
  </React.StrictMode>
); 