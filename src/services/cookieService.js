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
import { showOperationResult, showError, showInfo } from '../utils/message';
import { message } from 'antd';

export class CookieService {
  static async copyCookies(sourceUrl, targetUrl) {
    const validation = validateFormUrls(sourceUrl, targetUrl);
    if (!validation.isValid) {
      message.error(validation.errors[0]);
      return false;
    }
    
    try {
      const cookies = await getCookies(sourceUrl);
      if (cookies.length === 0) {
        showInfo('源地址没有可复制的Cookie');
        return true;
      }
      
      const result = await setCookies(cookies, targetUrl);
      await saveCookieOperation(sourceUrl, targetUrl, result.successCount);
      showOperationResult('复制', result);
      
      return true;
    } catch (error) {
      console.error('复制Cookie失败:', error);
      showError('复制Cookie');
      return false;
    }
  }

  static async clearCookies(targetUrl) {
    if (!targetUrl) {
      message.error('目标地址不能为空');
      return false;
    }
    
    try {
      const result = await clearCookies(targetUrl);
      showOperationResult('清除', result);
      return true;
    } catch (error) {
      console.error('清除Cookie失败:', error);
      showError('清除Cookie');
      return false;
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
  static deleteSourceHistory = deleteSourceUrlHistory;
  static deleteTargetHistory = deleteTargetUrlHistory;

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
