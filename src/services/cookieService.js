/**
 * Cookie服务 - 整合Cookie相关的所有业务操作
 * 这里整合业务逻辑，但基础API保持独立
 */

import { 
  getCookies, 
  setCookies, 
  clearCookies, 
  saveCookieOperation,
  getSourceUrlHistory,
  getTargetUrlHistory,
  deleteSourceUrlHistory,
  deleteTargetUrlHistory,
  getCurrentTabUrl
} from '../utils/cookie';
import { processUrlInput, validateFormUrls } from '../utils/urlValidation';
import { showInputError, showOperationResult, showError, showInfo } from '../utils/message';

export class CookieService {
  // URL处理
  static processUrl(url) {
    return processUrlInput(url);
  }

  // 执行Cookie复制
  static async copyCookies(sourceUrl, targetUrl) {
    const validation = validateFormUrls(sourceUrl, targetUrl);
    if (!validation.isValid) {
      showInputError(validation.errors[0]);
      return { success: false, error: validation.errors[0] };
    }
    
    try {
      const cookies = await getCookies(sourceUrl);
      if (cookies.length === 0) {
        showInfo('源地址没有可复制的Cookie');
        return { success: true, message: '没有可复制的Cookie' };
      }
      
      const result = await setCookies(cookies, targetUrl);
      await saveCookieOperation(sourceUrl, targetUrl, result.successCount);
      showOperationResult('复制', result);
      
      return { 
        success: true, 
        result,
        shouldUpdateHistory: true 
      };
    } catch (error) {
      console.error('复制Cookie失败:', error);
      showError('复制Cookie');
      return { success: false, error: error.message };
    }
  }

  // 清除Cookie
  static async clearCookies(targetUrl) {
    if (!targetUrl) {
      showInputError('目标地址');
      return { success: false, error: '目标地址不能为空' };
    }
    
    try {
      const result = await clearCookies(targetUrl);
      showOperationResult('清除', result);
      return { success: true, result };
    } catch (error) {
      console.error('清除Cookie失败:', error);
      showError('清除Cookie');
      return { success: false, error: error.message };
    }
  }

  // 获取历史记录
  static async getHistory() {
    try {
      const [sourceHistory, targetHistory] = await Promise.all([
        getSourceUrlHistory(),
        getTargetUrlHistory()
      ]);
      
      return { sourceHistory, targetHistory };
    } catch (error) {
      console.error('获取历史记录失败:', error);
      return { sourceHistory: [], targetHistory: [] };
    }
  }

  // 删除历史记录
  static async deleteSourceHistory(index) {
    return await deleteSourceUrlHistory(index);
  }

  static async deleteTargetHistory(index) {
    return await deleteTargetUrlHistory(index);
  }

  // 初始化数据
  static async initialize() {
    try {
      const [currentUrl, history] = await Promise.all([
        getCurrentTabUrl(),
        this.getHistory()
      ]);
      
      return {
        currentUrl: currentUrl || '',
        sourceHistory: history.sourceHistory,
        targetHistory: history.targetHistory
      };
    } catch (error) {
      console.error('初始化失败:', error);
      showError('初始化');
      return {
        currentUrl: '',
        sourceHistory: [],
        targetHistory: []
      };
    }
  }
}
