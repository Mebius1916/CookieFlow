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
    return {
      successCount: 0,
      failureCount: cookies.length,
      failures: [{ error: '无效的目标URL格式' }]
    };
  }
  
  let successCount = 0;
  const failures = [];
  
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
      failures.push({ name: cookie.name, error: error.message || '未知错误' });
    }
  }
  
  return { successCount, failureCount: failures.length, failures };
};

// 清除指定URL的所有Cookie
export const clearCookies = async (url) => {
  if (!isValidUrl(url)) {
    return {
      successCount: 0,
      failureCount: 0,
      failures: [{ error: '无效的URL格式' }]
    };
  }
  
  try {
    const cookies = await chrome.cookies.getAll({ url });
    let successCount = 0;
    const failures = [];
    
    for (const cookie of cookies) {
      try {
        await chrome.cookies.remove({ url, name: cookie.name });
        successCount++;
      } catch (error) {
        console.error(`删除Cookie失败: ${cookie.name}`, error);
        failures.push({ name: cookie.name, error: error.message || '未知错误' });
      }
    }
    
    return { successCount, failureCount: failures.length, failures };
  } catch (error) {
    console.error('清除Cookie失败:', error);
    return {
      successCount: 0,
      failureCount: 0,
      failures: [{ error: error.message || '未知错误' }]
    };
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
    const newHistory = [record, ...(history || [])].slice(0, 50);
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