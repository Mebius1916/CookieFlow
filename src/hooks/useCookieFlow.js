import { useState, useEffect } from 'react';
import { 
  clearCookies, 
  copyCookies,
  deleteSourceUrlHistory,
  deleteTargetUrlHistory,
  getSourceUrlHistory,
  getTargetUrlHistory,
} from '../utils/cookie';
import { 
  updateHistory, 
  handleUrlChange, 
} from '../utils/history';
import { initializeData } from '../utils/init';
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

  // 复制Cookie
  const handleCopyCookies = async () => {
    setCopyLoading(true);
    
    try {
      const result = await copyCookies(sourceUrl, targetUrl);
      if (result) {
        await updateHistory(setSourceHistory, setTargetHistory);
      }
    } finally {
      setCopyLoading(false);
    }
  };

  // 清空Cookie
  const handleClearCookies = async () => {
    setClearLoading(true);
    
    try {
      await clearCookies(targetUrl);
    } finally {
      setClearLoading(false);
    }
  };

  // 删除源地址历史记录
  const handleDeleteSourceHistory = async (index) => {
    try {
      await deleteSourceUrlHistory(index);
      // 直接获取最新的历史记录
      const newSourceHistory = await getSourceUrlHistory();
      setSourceHistory(newSourceHistory || []);
    } catch (error) {
      console.error('删除源地址历史记录失败:', error);
      showError('删除历史记录');
    }
  };

  // 删除目标地址历史记录
  const handleDeleteTargetHistory = async (index) => {
    try {
      await deleteTargetUrlHistory(index);
      // 直接获取最新的历史记录
      const newTargetHistory = await getTargetUrlHistory();
      setTargetHistory(newTargetHistory || []);
    } catch (error) {
      console.error('删除目标地址历史记录失败:', error);
      showError('删除历史记录');
    }
  };

  useEffect(() => {
    initializeData(setSourceUrl, setSourceHistory, setTargetHistory);
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
    handleUrlChange: (url, setter, validationSetter) => handleUrlChange(url, setter, validationSetter),
    handleCopyCookies,
    handleClearCookies,
    handleDeleteSourceHistory,
    handleDeleteTargetHistory
  };
}; 