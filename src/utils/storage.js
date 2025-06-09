/// <reference types="chrome"/>

// 获取Cookie历史记录
export const getCookieHistory = async () => {
  try {
    const result = await chrome.storage.local.get('cookieHistory');
    return result.cookieHistory || [];
  } catch (error) {
    console.error('获取Cookie历史记录失败:', error);
    return [];
  }
};

// 保存Cookie历史记录
export const saveCookieHistory = async (history) => {
  try {
    await chrome.storage.local.set({ cookieHistory: history });
  } catch (error) {
    console.error('保存Cookie历史记录失败:', error);
    throw error;
  }
}; 