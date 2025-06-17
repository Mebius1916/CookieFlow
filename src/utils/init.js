import { getCurrentTabUrl, getSourceUrlHistory, getTargetUrlHistory } from "./cookie";
import { showError } from "./message";

export const initializeData = async (setSourceUrl, setSourceHistory, setTargetHistory) => {
  try {
    const [currentUrl, sourceHistory, targetHistory] = await Promise.all([
      getCurrentTabUrl(),
      getSourceUrlHistory(),
      getTargetUrlHistory()
    ]);
    setSourceUrl(currentUrl || '');
    setSourceHistory(sourceHistory || []);
    setTargetHistory(targetHistory || []);
  } catch (error) {
    console.error('初始化失败:', error);
    showError('初始化');
  }
};
