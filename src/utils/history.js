import { 
  getSourceUrlHistory,
  getTargetUrlHistory,
} from './cookie';
import { processUrlInput } from './urlValidation';
import { showError } from './message';

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
  const result = processUrlInput(url);
  validationSetter(result.isValid);
  setter(result.processedUrl);
};

export const handleDeleteHistory = async (deleteFunction, setterFunction, errorMessage) => {
  try {
    const newHistory = await deleteFunction();
    setterFunction(newHistory || []);
  } catch (error) {
    console.error(errorMessage, error);
    showError('删除历史记录');
  }
}; 