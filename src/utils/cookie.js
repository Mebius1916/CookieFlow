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
  const targetUrlObj = new URL(targetUrl);
  
  for (const cookie of cookies) {
    try {
      // 创建cookie设置对象
      const cookieDetails = {
        url: targetUrl,
        name: cookie.name,
        value: cookie.value,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        expirationDate: cookie.expirationDate,
      };

      // 处理domain属性 - 这是关键修复
      // 如果原cookie的domain与目标URL的hostname不匹配，则需要调整
      if (cookie.domain) {
        // 检查原domain是否适用于目标URL
        if (targetUrlObj.hostname.endsWith(cookie.domain.replace(/^\./, '')) || 
            cookie.domain === targetUrlObj.hostname ||
            cookie.domain === '.' + targetUrlObj.hostname) {
          // 如果匹配，使用原domain
          cookieDetails.domain = cookie.domain;
        } else {
          // 如果不匹配，则不设置domain属性，让chrome自动处理
          // 这样cookie会成为host-only cookie
          console.warn(`Cookie ${cookie.name} 的domain "${cookie.domain}" 与目标URL "${targetUrlObj.hostname}" 不匹配，将设置为host-only cookie`);
        }
      }

      // 额外的验证
      if (cookieDetails.secure && !targetUrl.startsWith('https://')) {
        console.warn(`Cookie ${cookie.name} 标记为secure但目标URL不是HTTPS，可能设置失败`);
      }

      await chrome.cookies.set(cookieDetails);
      successCount++;
      console.log(`成功设置Cookie: ${cookie.name}`);
    } catch (error) {
      console.error(`设置Cookie失败: ${cookie.name}`, error);
      console.error('Cookie详细信息:', {
        name: cookie.name,
        domain: cookie.domain,
        targetHostname: targetUrlObj.hostname,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite
      });
    }
  }
  
  return { successCount };
};

// 清除指定URL的所有Cookie
export const clearCookies = async (url) => {
  if (!url) {
    // 动态导入 antd message 以避免循环依赖
    const { message } = await import('antd');
    message.error('目标地址不能为空');
    return { successCount: 0 };
  }

  // 处理URL：提取origin部分
  const processedUrl = extractOrigin(url);

  if (!isValidUrl(processedUrl)) {
    const { message } = await import('antd');
    message.error('无效的URL格式');
    return { successCount: 0 };
  }
  
  try {
    const cookies = await chrome.cookies.getAll({ url: processedUrl });
    let successCount = 0;
    
    for (const cookie of cookies) {
      try {
        await chrome.cookies.remove({ url: processedUrl, name: cookie.name });
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
const deleteUrlHistory = async (index, field) => {
  try {
    const history = await getCookieHistory();
    if (!history || history.length === 0) return;
    
    const urls = [...new Set(history.map(item => item[field]))].slice(0, 10);
    const urlToDelete = urls[index];
    
    if (urlToDelete) {
      const newHistory = history.filter(item => item[field] !== urlToDelete);
      await saveCookieHistory(newHistory);
    }
  } catch (error) {
    console.error(`删除${field}历史记录失败:`, error);
    throw error;
  }
};

// 获取源地址历史记录
export const getSourceUrlHistory = () => getUrlHistory('source');

// 获取目标地址历史记录
export const getTargetUrlHistory = () => getUrlHistory('target');

// 删除源地址历史记录
export const deleteSourceUrlHistory = (index) => 
  deleteUrlHistory(index, 'source');

// 删除目标地址历史记录
export const deleteTargetUrlHistory = (index) => 
  deleteUrlHistory(index, 'target');

// 复制源URL的Cookie到目标URL
export const copyCookies = async (sourceUrl, targetUrl) => {
  // 处理URL：提取origin部分
  const processedSourceUrl = extractOrigin(sourceUrl);
  const processedTargetUrl = extractOrigin(targetUrl);
  
  // 验证URL
  const { validateFormUrls } = await import('./urlValidation');
  const validation = validateFormUrls(processedSourceUrl, processedTargetUrl);
  
  if (!validation.isValid) {
    const { message } = await import('antd');
    message.error(validation.errors[0]);
    return false;
  }
  
  try {
    // 获取源地址Cookie
    const cookies = await getCookies(processedSourceUrl);
    
    // 判断Cookie数量
    if (cookies.length === 0) {
      const { showInfo } = await import('./message');
      showInfo('源地址没有可复制的Cookie');
      return true;
    }
    
    // 设置目标地址Cookie
    const result = await setCookies(cookies, processedTargetUrl);
    
    // 保存操作记录（使用处理后的URL）
    await saveCookieOperation(processedSourceUrl, processedTargetUrl, result.successCount);
    
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