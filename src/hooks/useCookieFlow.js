import { useState, useEffect } from 'react';
import { 
  clearCookies, 
  copyCookies,
  deleteSourceUrlHistory,
  deleteTargetUrlHistory,
} from '../utils/cookie';
import { 
  updateHistory, 
  handleUrlChange, 
  handleDeleteHistory 
} from '../utils/history';
import { initializeData } from '../utils/init';

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
  const handleDeleteSourceHistory = (index) => handleDeleteHistory(
    () => deleteSourceUrlHistory(index),
    setSourceHistory,
    '删除源地址历史记录失败:'
  );

  // 删除目标地址历史记录
  const handleDeleteTargetHistory = (index) => handleDeleteHistory(
    () => deleteTargetUrlHistory(index),
    setTargetHistory,
    '删除目标地址历史记录失败:'
  );

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