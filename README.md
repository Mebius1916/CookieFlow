# CookieFlow

🚀 一个简洁现代的Cookie复制和管理工具

## 📖 开发背景

单点登录导致不同环境需要使用不同个cookie，手动去控制台粘贴过于繁琐麻烦，于是开发这款插件用于提高调试效率。

---

## 🛠️ 使用技术栈

- **React18**: [https://18.react.dev/](https://18.react.dev/) - 现代前端框架
- **Tailwindcss**: [https://tailwindcss.com/](https://tailwindcss.com/) - 原子化CSS框架
- **Antd**: [https://ant.design/](https://ant.design/) - 企业级UI设计语言
- **Vite**: [https://vite.dev/](https://vite.dev/) - 下一代前端构建工具

---

## ✨ 插件功能

- ✅ 复制源地址`cookies`到目标地址
- ✅ 清空目标地址的`cookies`
- ✅ 历史记录支持且可删除
- ✅ `URL`合法性校验
- ✅ 消息提示弹窗
- ✅ 自动读取当前页面`URL`

---

## 🏗️ 项目架构

参考百度TDA平台中AI助手组件的架构设计：UI层与业务逻辑抽离，状态管理与工具函数抽离，采用高内聚低耦合、单一职责原则的分层架构。

```JavaScript
🎨 UI层 (Popup.jsx) ← 纯视图渲染
    ↓
⚛️ Hook层 (useCookieFlow.js) ← 状态管理 + 副作用处理
    ↓
🔧 Utils层 (cookie.js, storage.js, urlValidation.js) ← 纯函数工具集
```

---

## 📁 代码结构

```JavaScript
CookieFlow/
├── 📁 assets/
│   ├── 📄 icon.svg              # 插件图标
│   └── 📄 icon*.png             # 不同尺寸图标
├── 📁 src/
│   ├── 📁 components/
│   │   └── 📄 UrlInput.jsx      # URL输入框组件
│   ├── 📁 hooks/
│   │   └── 📄 useCookieFlow.js  # 自定义业务Hook
│   ├── 📁 pages/
│   │   └── 📁 popup/
│   │       ├── 📄 index.html    # 弹窗页面模板
│   │       ├── 📄 index.jsx     # React应用入口
│   │       └── 📄 Popup.jsx     # 主弹窗组件
│   ├── 📁 styles/
│   │   └── 📄 index.css         # 全局样式
│   └── 📁 utils/                # 工具函数层
│       ├── 📄 cookie.js         # Cookie操作核心逻辑
│       ├── 📄 storage.js        # Chrome存储API封装
│       ├── 📄 history.js        # 历史记录处理逻辑
│       ├── 📄 message.jsx       # 消息提示封装
│       ├── 📄 urlValidation.js  # URL校验工具
│       └── 📄 init.js           # 初始化逻辑
├── 📄 manifest.json             # Chrome扩展配置
├── 📄 package.json              # 项目依赖配置
└── 📄 vite.config.js            # Vite构建配置
```

---

## 🚀 快速开始

### 开发命令

```Bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
```

### 安装使用

1. 克隆项目代码
2. 运行 `npm install` 安装依赖
3. 运行 `npm run build` 构建项目
4. 在Chrome中打开扩展程序页面 (`chrome://extensions/`)
5. 启用"开发者模式"
6. 点击"加载已解压的扩展程序"，选择项目的 `dist` 目录

---

## 🔌 Chrome API 使用

本项目主要使用以下Chrome扩展API：

- **chrome.cookies** - 管理浏览器Cookie数据
    - `getAll()` - 获取指定URL的Cookie
    - `set()` - 设置Cookie
    - `remove()` - 删除Cookie
- **chrome.tabs** - 获取浏览器标签页信息
    - `query()` - 查询当前活跃标签页
- **chrome.storage.local** - 本地数据存储
    - `get()` - 读取本地存储
    - `set()` - 保存本地存储

---

## 🔗 开源地址

**GitHub**: [Mebius1916/CookieFlow](https://github.com/Mebius1916/CookieFlow)

本项目采用开源协议，欢迎提交 PR 参与开源贡献！🎉