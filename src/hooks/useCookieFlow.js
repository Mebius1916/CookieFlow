import { useState, useEffect } from 'react';
import {
  getCurrentTabUrl,
  getCookies,
  setCookies,
  clearCookies,
  saveCookieOperation,
  getSourceUrlHistory,
  getTargetUrlHistory,
  deleteSourceUrlHistory,
  deleteTargetUrlHistory,
  extractOrigin,
  isValidUrl
} from '../utils/cookie';
import { showInputError, showOperationResult, showError, showInfo } from '../utils/message';

export const useCookieFlow = () => {
  // 状态管理
  const [sourceUrl, setSourceUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('http://localhost:8080');
  const [sourceHistory, setSourceHistory] = useState([]);
  const [targetHistory, setTargetHistory] = useState([]);
  const [urlValidation, setUrlValidation] = useState({
    sourceValid: true,
    targetValid: true
  });
  const [loading, setLoading] = useState({
    copy: false,
    clear: false
  });

  // URL处理函数
  const handleUrlChange = (url, setter, validationKey) => {
    if (url.trim()) {
      if (!isValidUrl(url)) {
        setUrlValidation(prev => ({ ...prev, [validationKey]: false }));
        setter(url);
        return;
      }
      
      setUrlValidation(prev => ({ ...prev, [validationKey]: true }));
      const normalizedUrl = extractOrigin(url);
      setter(normalizedUrl);
    } else {
      setUrlValidation(prev => ({ ...prev, [validationKey]: true }));
      setter(url);
    }
  };

  // 初始化数据
  const initializeData = async () => {
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

  // 复制Cookie处理
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
      setLoading(prev => ({ ...prev, copy: true }));
      const cookies = await getCookies(sourceUrl);
      if (cookies.length === 0) {
        showInfo('源地址没有可复制的Cookie');
        return;
      }
      
      const result = await setCookies(cookies, targetUrl);
      await saveCookieOperation(sourceUrl, targetUrl, result.successCount);
      
      // 更新历史记录
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
      setLoading(prev => ({ ...prev, copy: false }));
    }
  };

  // 清空Cookie处理
  const handleClearCookies = async () => {
    if (!targetUrl) {
      showInputError('目标地址');
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, clear: true }));
      const result = await clearCookies(targetUrl);
      showOperationResult('清除', result);
    } catch (error) {
      console.error('清除Cookie失败:', error);
      showError('清除Cookie');
    } finally {
      setLoading(prev => ({ ...prev, clear: false }));
    }
  };

  // 删除源地址历史记录
  const handleDeleteSourceHistory = async (index) => {
    try {
      const newHistory = await deleteSourceUrlHistory(index);
      setSourceHistory(newHistory);
    } catch (error) {
      console.error('删除源地址历史记录失败:', error);
      showError('删除历史记录');
    }
  };

  // 删除目标地址历史记录
  const handleDeleteTargetHistory = async (index) => {
    try {
      const newHistory = await deleteTargetUrlHistory(index);
      setTargetHistory(newHistory);
    } catch (error) {
      console.error('删除目标地址历史记录失败:', error);
      showError('删除历史记录');
    }
  };

  // 初始化效果
  useEffect(() => {
    initializeData();
  }, []);

  // 返回状态和方法
  return {
    // 状态
    sourceUrl,
    targetUrl,
    sourceHistory,
    targetHistory,
    urlValidation,
    loading,
    
    // 方法
    setSourceUrl,
    setTargetUrl,
    handleUrlChange,
    handleCopyCookies,
    handleClearCookies,
    handleDeleteSourceHistory,
    handleDeleteTargetHistory
  };
}; 