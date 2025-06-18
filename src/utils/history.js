import { 
  getSourceUrlHistory,
  getTargetUrlHistory,
} from './cookie';
import { processUrlInput } from './urlValidation';

export const updateHistory = async (setSourceHistory, setTargetHistory) => {
  try {
    const [sourceHistory, targetHistory] = await Promise.all([
      getSourceUrlHistory(),
      getTargetUrlHistory()
    ]);
    setSourceHistory(sourceHistory || []);
    setTargetHistory(targetHistory || []);
  } catch (error) {
    console.error('更新历史记录失败:', error);
  }
};

export const handleUrlChange = (url, setter, validationSetter) => {
  setter(url);
  
  const result = processUrlInput(url);
  validationSetter(result.isValid);
};

export const processUrlForSubmission = (url) => {
  const result = processUrlInput(url);
  return result.processedUrl;
}; 