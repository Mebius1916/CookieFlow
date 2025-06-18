import React, { useState } from 'react';
import { Input, Dropdown } from 'antd';
import { HistoryOutlined, DeleteOutlined } from '@ant-design/icons';

const UrlInput = ({ 
  value, 
  onChange, 
  placeholder, 
  history = [], 
  label,
  onDeleteHistory,
  isValid = true
}) => {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const handleHistoryClick = (url) => {
    onChange(url);
    setOpen(false);
  };

  const handleDeleteHistory = (index, e) => {
    e.stopPropagation();
    if (onDeleteHistory) {
      onDeleteHistory(index);
    }
  };

  // 改进输入处理，避免在输入过程中干扰用户
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  // 失去焦点时关闭下拉菜单
  const handleBlur = () => {
    setIsFocused(false);
    setOpen(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };
  
  //历史记录的item
  const historyItems = {
    items: history.map((url, index) => ({
      key: index,
      label: <div 
        className="flex items-center justify-between max-w-64 cursor-pointer py-1 px-2 hover:bg-gray-100 group"
        onClick={() => handleHistoryClick(url)}
      >
        <span className="truncate flex-1 mr-2">{url}</span>
        {onDeleteHistory && (
          <DeleteOutlined
            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => handleDeleteHistory(index, e)}
          />
        )}
      </div>
    }))
  };

  // 只有在有内容且无效时才显示错误状态
  const showError = !isValid && value && value.trim() && !isFocused;

  return (
    <div className="mb-4 relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <Dropdown
        menu={historyItems}
        placement="bottom"
        open={open && history.length > 0}
        overlayClassName="max-h-32 overflow-y-auto"
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(false);
          }
        }}
      >
        <Input
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          status={showError ? 'error' : ''}
          suffix={
            <HistoryOutlined
              className={`cursor-pointer ${
                history.length > 0 
                  ? 'text-gray-400 hover:text-gray-600' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (history.length > 0) {
                  setOpen(!open);
                }
              }}
            />
          }
        />
      </Dropdown>
      
      {showError && (
        <div className="absolute left-0 top-full mt-1 text-red-500 text-xs bg-white border border-red-200 rounded px-2 py-1 shadow-sm z-10 max-w-full">
          URL格式不正确，请输入完整的URL（如：https://example.com）
        </div>
      )}
    </div>
  );
};

export default UrlInput; 