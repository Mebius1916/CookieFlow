import { useState, useEffect } from 'react';
import { CookieService } from '../services/cookieService';
import { processUrlInput } from '../utils/urlValidation';
import { showError } from '../utils/message';

export const useCookieFlow = () => {
  const [sourceUrl, setSourceUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('http://localhost:8080');
  const [sourceHistory, setSourceHistory] = useState([]);
  const [targetHistory, setTargetHistory] = useState([]);
  const [sourceValid, setSourceValid] = useState(true);
  const [targetValid, setTargetValid] = useState(true);
  const [copyLoading, setCopyLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  // 更新历史记录
  const updateHistory = async () => {
    try {
      const historyData = await CookieService.getHistory();
      setSourceHistory(historyData.sourceHistory || []);
      setTargetHistory(historyData.targetHistory || []);
    } catch (error) {
      console.error('更新历史记录失败:', error);
    }
  };

  // URL处理函数
  const handleUrlChange = (url, setter, validationSetter) => {
    const result = processUrlInput(url);
    validationSetter(result.isValid);
    setter(result.processedUrl);
  };

  // 初始化数据
  const initializeData = async () => {
    try {
      const data = await CookieService.initialize();
      setSourceUrl(data.currentUrl);
      setSourceHistory(data.sourceHistory || []);
      setTargetHistory(data.targetHistory || []);
    } catch (error) {
      console.error('初始化失败:', error);
      showError('初始化');
    }
  };

  // 复制Cookie
  const handleCopyCookies = async () => {
    setCopyLoading(true);
    
    try {
      const result = await CookieService.copyCookies(sourceUrl, targetUrl);
      if (result) {
        await updateHistory();
      }
    } finally {
      setCopyLoading(false);
    }
  };

  // 清空Cookie
  const handleClearCookies = async () => {
    setClearLoading(true);
    
    try {
      await CookieService.clearCookies(targetUrl);
    } finally {
      setClearLoading(false);
    }
  };

  // 删除历史记录的通用处理
  const handleDeleteHistory = async (deleteFunction, setterFunction, errorMessage) => {
    try {
      const newHistory = await deleteFunction();
      setterFunction(newHistory || []);
    } catch (error) {
      console.error(errorMessage, error);
      showError('删除历史记录');
    }
  };

  // 删除源地址历史记录
  const handleDeleteSourceHistory = (index) => handleDeleteHistory(
    () => CookieService.deleteSourceHistory(index),
    setSourceHistory,
    '删除源地址历史记录失败:'
  );

  // 删除目标地址历史记录
  const handleDeleteTargetHistory = (index) => handleDeleteHistory(
    () => CookieService.deleteTargetHistory(index),
    setTargetHistory,
    '删除目标地址历史记录失败:'
  );

  useEffect(() => {
    initializeData();
  }, []);

  return {
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
    setSourceValid,
    setTargetValid,
    handleUrlChange,
    handleCopyCookies,
    handleClearCookies,
    handleDeleteSourceHistory,
    handleDeleteTargetHistory
  };
}; 