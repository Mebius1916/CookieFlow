/// <reference types="chrome"/>
import { getCookieHistory, saveCookieHistory } from './storage';

// 提取URL的源部分(协议+域名+端口)
export const extractOrigin = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.origin; 
  } catch (error) {
    console.error('URL格式无效:', url);
    return url;
  }
};

// 验证URL是否有效
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// 获取当前标签页的URL(只返回协议+域名+端口)
export const getCurrentTabUrl = async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) {
      return extractOrigin(tab.url);
    }
    return null;
  } catch (error) {
    console.error('获取当前标签页URL失败:', error);
    return null;
  }
};

// 获取指定URL的所有Cookie
export const getCookies = async (url) => {
  if (!isValidUrl(url)) {
    console.error('无效的URL格式:', url);
    return [];
  }
  
  try {
    return await chrome.cookies.getAll({ url });
  } catch (error) {
    console.error('获取Cookie失败:', error);
    return [];
  }
};

// 设置Cookie到目标URL
export const setCookies = async (cookies, targetUrl) => {
  if (!isValidUrl(targetUrl)) {
    return { successCount: 0 };
  }
  
  let successCount = 0;
  
  for (const cookie of cookies) {
    try {
      await chrome.cookies.set({
        url: targetUrl,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        expirationDate: cookie.expirationDate,
      });
      successCount++;
    } catch (error) {
      console.error(`设置Cookie失败: ${cookie.name}`, error);
    }
  }
  
  return successCount;
};

// 清除指定URL的所有Cookie
export const clearCookies = async (url) => {
  if (!url) {
    // 动态导入 antd message 以避免循环依赖
    const { message } = await import('antd');
    message.error('目标地址不能为空');
    return { successCount: 0 };
  }

  if (!isValidUrl(url)) {
    const { message } = await import('antd');
    message.error('无效的URL格式');
    return { successCount: 0 };
  }
  
  try {
    const cookies = await chrome.cookies.getAll({ url });
    let successCount = 0;
    
    for (const cookie of cookies) {
      try {
        await chrome.cookies.remove({ url, name: cookie.name });
        successCount++;
      } catch (error) {
        console.error(`删除Cookie失败: ${cookie.name}`, error);
      }
    }

    // 显示操作结果
    const { showOperationResult } = await import('./message');
    showOperationResult('清除', { successCount });

    return { successCount };
  } catch (error) {
    console.error('清除Cookie失败:', error);
    const { showError } = await import('./message');
    showError('清除Cookie');
    return { successCount: 0 };
  }
};

// 保存Cookie操作记录并更新历史
export const saveCookieOperation = async (source, target, successCount) => {
  try {
    const record = {
      source,
      target,
      timestamp: Date.now(),
      count: successCount
    };
    
    const history = await getCookieHistory();
    const newHistory = [record, ...(history || [])].slice(0, 10);
    await saveCookieHistory(newHistory);
    
    return true;
  } catch (error) {
    console.error('保存Cookie操作记录失败:', error);
    return false;
  }
};

// 通用的历史记录获取函数
const getUrlHistory = async (field) => {
  try {
    const history = await getCookieHistory();
    if (!history || history.length === 0) return [];
    return [...new Set(history.map(item => item[field]))].slice(0, 10);
  } catch (error) {
    console.error(`获取${field}历史记录失败:`, error);
    return [];
  }
};

// 通用的历史记录删除函数
const deleteUrlHistory = async (index, field, getHistoryFn) => {
  try {
    const history = await getCookieHistory();
    if (!history || history.length === 0) return [];
    
    const urls = [...new Set(history.map(item => item[field]))].slice(0, 10);
    const urlToDelete = urls[index];
    
    if (urlToDelete) {
      const newHistory = history.filter(item => item[field] !== urlToDelete);
      await saveCookieHistory(newHistory);
    }
    
    return await getHistoryFn();
  } catch (error) {
    console.error(`删除${field}历史记录失败:`, error);
    return [];
  }
};

// 获取源地址历史记录
export const getSourceUrlHistory = () => getUrlHistory('source');

// 获取目标地址历史记录
export const getTargetUrlHistory = () => getUrlHistory('target');

// 删除源地址历史记录
export const deleteSourceUrlHistory = (index) => 
  deleteUrlHistory(index, 'source', getSourceUrlHistory);

// 删除目标地址历史记录
export const deleteTargetUrlHistory = (index) => 
  deleteUrlHistory(index, 'target', getTargetUrlHistory);

// 复制源URL的Cookie到目标URL
export const copyCookies = async (sourceUrl, targetUrl) => {
  // 验证URL
  const { validateFormUrls } = await import('./urlValidation');
  const validation = validateFormUrls(sourceUrl, targetUrl);
  
  if (!validation.isValid) {
    const { message } = await import('antd');
    message.error(validation.errors[0]);
    return false;
  }
  
  try {
    // 获取源地址Cookie
    const cookies = await getCookies(sourceUrl);
    
    // 判断Cookie数量
    if (cookies.length === 0) {
      const { showInfo } = await import('./message');
      showInfo('源地址没有可复制的Cookie');
      return true;
    }
    
    // 设置目标地址Cookie
    const result = await setCookies(cookies, targetUrl);
    
    // 保存操作记录
    await saveCookieOperation(sourceUrl, targetUrl, result);
    
    // 显示操作结果
    const { showOperationResult } = await import('./message');
    showOperationResult('复制', result);
    
    return true;
  } catch (error) {
    console.error('复制Cookie失败:', error);
    const { showError } = await import('./message');
    showError('复制Cookie');
    return false;
  }
}; 