import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import UrlInput from '../../components/UrlInput.jsx';
import {
  getCurrentTabUrl,
  getCookies,
  setCookies,
  clearCookies,
  saveCookieOperation,
  getSourceUrlHistory,
  getTargetUrlHistory
} from '../../utils/cookie';
import { showInputError, showOperationResult, showError, showInfo } from '../../utils/message';

const Popup = () => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('http://localhost:8080');
  const [sourceHistory, setSourceHistory] = useState([]);
  const [targetHistory, setTargetHistory] = useState([]);
  const [loading, setLoading] = useState({
    copy: false,
    clear: false
  });

  // 初始化数据
  useEffect(() => {
    const init = async () => {
      try {
        const [currentUrl, sourceHistoryUrls, targetHistoryUrls] = await Promise.all([
          getCurrentTabUrl(),
          getSourceUrlHistory(),
          getTargetUrlHistory()
        ]);
        
        setSourceUrl(currentUrl || '');
        setSourceHistory(sourceHistoryUrls);
        setTargetHistory(targetHistoryUrls);
      } catch (error) {
        console.error('初始化失败:', error);
        showError('初始化');
      }
    };
    
    init();
  }, []);

  const handleCopyCookies = async () => {
    if (!sourceUrl) {
      showInputError('源地址');
      return;
    }
    
    if (!targetUrl) {
      showInputError('目标地址');
      return;
    }
    
    try {
      setLoading({ ...loading, copy: true });
      const cookies = await getCookies(sourceUrl);
      if (cookies.length === 0) {
        showInfo('源地址没有可复制的Cookie');
        return;
      }
      
      const result = await setCookies(cookies, targetUrl);
      await saveCookieOperation(sourceUrl, targetUrl, result.successCount);
      const [sourceHistoryUrls, targetHistoryUrls] = await Promise.all([
        getSourceUrlHistory(),
        getTargetUrlHistory()
      ]);
      
      setSourceHistory(sourceHistoryUrls);
      setTargetHistory(targetHistoryUrls);
  
      showOperationResult('复制', result);
    } catch (error) {
      console.error('复制Cookie失败:', error);
      showError('复制Cookie');
    } finally {
      setLoading({ ...loading, copy: false });
    }
  };

  const handleClearCookies = async () => {
    if (!targetUrl) {
      showInputError('目标地址');
      return;
    }
    
    try {
      setLoading({ ...loading, clear: true });
      const result = await clearCookies(targetUrl);
      showOperationResult('清除', result);
    } catch (error) {
      console.error('清除Cookie失败:', error);
      showError('清除Cookie');
    } finally {
      setLoading({ ...loading, clear: false });
    }
  };

  return (
    <div className="p-4 w-80"> 
      <header className="mb-3">
        <h1 className="text-2xl font-bold text-blue-600">CookieFlow</h1>
        <p className="text-sm text-gray-500">一个简洁现代的Cookie复制和管理工具</p>
      </header>

      {/* 表单 */}
      <div className="mb-3">
        <UrlInput 
          value={sourceUrl}
          onChange={setSourceUrl}
          placeholder="请输入源地址"
          history={sourceHistory}
          label="源地址"
        />
        
        <UrlInput 
          value={targetUrl}
          onChange={setTargetUrl}
          placeholder="请输入目标地址"
          history={targetHistory}
          label="目标地址"
        />
        
        <div className="flex space-x-2 mt-3">
          <Button
            type="primary"
            onClick={handleCopyCookies}
            loading={loading.copy}
            disabled={loading.copy || loading.clear}
          >
            复制Cookie
          </Button>
          
          <Button
            onClick={handleClearCookies}
            loading={loading.clear}
            disabled={loading.copy || loading.clear}
          >
            清空Cookie
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Popup; 