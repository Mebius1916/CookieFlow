import React, { useState } from 'react';
import { Input, Dropdown } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';

const UrlInput = ({ 
  value, 
  onChange, 
  placeholder, 
  history = [], 
  label
}) => {
  const [open, setOpen] = useState(false);
  
  const handleHistoryClick = (url) => {
    onChange(url);
    setOpen(false);
  };
  
  //历史记录的item
  const historyItems = {
    items: history.map((url, index) => ({
      key: index,
      label: <div 
        className="truncate max-w-64 cursor-pointer py-1 px-2 hover:bg-gray-100"
        onClick={() => handleHistoryClick(url)}
      >
        {url}
      </div>
    }))
  };

  return (
    <div className="mb-4">
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
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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
    </div>
  );
};

export default UrlInput; 