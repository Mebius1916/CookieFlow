import React from 'react';
import { Button } from 'antd';
import UrlInput from '../../components/UrlInput.jsx';
import { useCookieFlow } from '../../hooks/useCookieFlow.js';

const Popup = () => {
  const {
    sourceUrl,
    targetUrl,
    sourceHistory,
    targetHistory,
    sourceValid,
    targetValid,
    copyLoading,
    clearLoading,
    setSourceUrl,
    setTargetUrl,
    handleUrlChange,
    handleCopyCookies,
    handleClearCookies,
    handleDeleteSourceHistory,
    handleDeleteTargetHistory
  } = useCookieFlow();

  return (
    <div className="p-4 w-80 min-h-0"> 
      <header className="mb-3">
        <h1 className="text-2xl font-bold text-blue-600">CookieFlow</h1>
        <p className="text-sm text-gray-500">一个简洁现代的Cookie复制和管理工具</p>
      </header>

      <div>
        <UrlInput 
          value={sourceUrl}
          onChange={(url) => handleUrlChange(url, setSourceUrl, setSourceValid)}
          placeholder="请输入源地址"
          history={sourceHistory}
          label="源地址"
          onDeleteHistory={handleDeleteSourceHistory}
          isValid={sourceValid}
        />
        
        <UrlInput 
          value={targetUrl}
          onChange={(url) => handleUrlChange(url, setTargetUrl, setTargetValid)}
          placeholder="请输入目标地址"
          history={targetHistory}
          label="目标地址"
          onDeleteHistory={handleDeleteTargetHistory}
          isValid={targetValid}
        />
        
        <div className="flex space-x-2 mt-3">
          <Button
            type="primary"
            onClick={handleCopyCookies}
            loading={copyLoading}
            disabled={copyLoading || clearLoading || !sourceValid || !targetValid}
          >
            复制Cookie
          </Button>
          
          <Button
            onClick={handleClearCookies}
            loading={clearLoading}
            disabled={copyLoading || clearLoading || !targetValid}
          >
            清空Cookie
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Popup; 