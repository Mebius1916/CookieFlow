# Cookie Master

一个简洁现代的Cookie复制和管理工具，基于React 18和Ant Design实现。

## 功能特性

- 支持从源网站复制所有Cookie到目标网站
- 支持清空目标网站的所有Cookie
- 自动记录操作历史，方便快速选择常用网站
- 默认使用当前标签页作为源地址
- 现代化UI界面，简洁易用

## 开发技术栈

- React 18
- Ant Design 5
- TailwindCSS
- Vite

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建Chrome扩展
npm run build
```

## 如何使用

1. 构建扩展程序
2. 在Chrome浏览器中加载扩展（开发者模式）
3. 点击扩展图标，输入源地址和目标地址
4. 点击"复制Cookie"按钮，将源网站的Cookie复制到目标网站
5. 如需清除目标网站的Cookie，点击"清空Cookie"按钮

## 权限说明

本扩展需要以下权限：
- cookies: 读取和修改网站Cookie
- tabs: 获取当前标签页URL
- storage: 保存操作历史记录

## 注意事项

- 仅支持Chrome等基于Chromium的浏览器
- 无法复制HTTPOnly类型的Cookie 