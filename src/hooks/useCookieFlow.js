import { useState, useEffect } from 'react';
import { CookieService } from '../services/cookieService';
import { showError } from '../utils/message';

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

  // URL处理函数 - 使用CookieService
  const handleUrlChange = (url, setter, validationKey) => {
    const result = CookieService.processUrl(url);
    
    // 更新验证状态
    setUrlValidation(prev => ({ ...prev, [validationKey]: result.isValid }));
    
    // 设置处理后的URL
    setter(result.processedUrl);
  };

  // 初始化数据 - 使用CookieService
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

  // 复制Cookie处理 - 使用CookieService
  const handleCopyCookies = async () => {
    setLoading(prev => ({ ...prev, copy: true }));
    
    try {
      const result = await CookieService.copyCookies(sourceUrl, targetUrl);
      
      // 如果需要更新历史记录
      if (result.shouldUpdateHistory) {
        const historyData = await CookieService.getHistory();
        setSourceHistory(historyData.sourceHistory || []);
        setTargetHistory(historyData.targetHistory || []);
      }
    } finally {
      setLoading(prev => ({ ...prev, copy: false }));
    }
  };

  // 清空Cookie处理 - 使用CookieService
  const handleClearCookies = async () => {
    setLoading(prev => ({ ...prev, clear: true }));
    
    try {
      await CookieService.clearCookies(targetUrl);
    } finally {
      setLoading(prev => ({ ...prev, clear: false }));
    }
  };

  // 删除源地址历史记录 - 使用CookieService
  const handleDeleteSourceHistory = async (index) => {
    try {
      const newHistory = await CookieService.deleteSourceHistory(index);
      setSourceHistory(newHistory || []);
    } catch (error) {
      console.error('删除源地址历史记录失败:', error);
      showError('删除历史记录');
    }
  };

  // 删除目标地址历史记录 - 使用CookieService
  const handleDeleteTargetHistory = async (index) => {
    try {
      const newHistory = await CookieService.deleteTargetHistory(index);
      setTargetHistory(newHistory || []);
    } catch (error) {
      console.error('删除目标地址历史记录失败:', error);
      showError('删除历史记录');
    }
  };

  // 初始化效果
  useEffect(() => {
    initializeData();
  }, []);

  return {
    sourceUrl,
    targetUrl,
    sourceHistory,
    targetHistory,
    urlValidation,
    loading,
    setSourceUrl,
    setTargetUrl,
    handleUrlChange,
    handleCopyCookies,
    handleClearCookies,
    handleDeleteSourceHistory,
    handleDeleteTargetHistory
  };
}; 