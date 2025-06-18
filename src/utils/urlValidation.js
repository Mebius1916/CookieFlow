import { isValidUrl, extractOrigin } from './cookie';
// 处理URL输入，返回处理结果
export const processUrlInput = (url) => {
  // 去除url两端的空格
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return {
      isValid: true,
      processedUrl: ''
    };
  }
  
  const isValid = isValidUrl(trimmedUrl);
  
  return {
    isValid,
    // 只有在URL有效时才提取origin，否则保持原样
    processedUrl: isValid ? extractOrigin(trimmedUrl) : trimmedUrl
  };
};

// 验证表单中的URL字段
export const validateFormUrls = (sourceUrl, targetUrl) => {
  const errors = [];
  
  if (!sourceUrl || !sourceUrl.trim()) {
    errors.push('源地址不能为空');
  }
  
  if (!targetUrl || !targetUrl.trim()) {
    errors.push('目标地址不能为空');
  }
  
  if (sourceUrl && sourceUrl.trim() && !isValidUrl(sourceUrl.trim())) {
    errors.push('源地址格式不正确');
  }
  
  if (targetUrl && targetUrl.trim() && !isValidUrl(targetUrl.trim())) {
    errors.push('目标地址格式不正确');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 