# 开发者文档：高效率工作提醒机器

## 1. 项目概述

本项目是一个为 Microsoft Edge (及其他 Chromium 内核浏览器) 设计的浏览器插件。其核心功能是在用户设定的总工作时长内，以随机间隔（默认为3-5分钟）提醒用户休息15秒，以帮助用户保持健康的工作节奏和高效率。

### 主要功能

- **弹出式控制面板**: 用户通过点击浏览器工具栏的插件图标，可以打开一个面板来设置总工作时长、启动和停止计时器。
- **精确后台计时**: 插件使用一个后台 Service Worker，通过时间戳 (`Date.now()`) 机制来精确计算流逝的时间，确保计时的准确性。
- **全屏休息提醒**: 在需要休息时，插件会在当前浏览的网页上弹出一个覆盖全屏的遮罩层，并显示15秒倒计时，强制用户休息。
- **实时状态显示**: 弹出窗口的倒计时是实时、平滑的。同时，插件图标上会有一个 "ON" 徽章来表明其运行状态。

## 2. 技术栈

- **UI框架**: React
- **语言**: TypeScript
- **UI库**: Bootstrap
- **构建工具**: Webpack
- **浏览器API**: Chrome Extension Manifest V3

## 3. 项目结构

```
.
├── dist/                   # Webpack 打包后生成的、可供浏览器加载的最终文件
├── node_modules/           # 项目依赖
├── public/                 # 静态资源文件夹
│   ├── manifest.json       # 插件的核心配置文件
│   └── *.svg               # 插件图标
├── src/                    # 源代码目录
│   ├── background/         # 后台逻辑
│   │   └── service-worker.ts # Service Worker，插件的大脑
│   ├── content/            # 内容脚本
│   │   └── content.ts        # 负责在网页上显示遮罩层
│   └── popup/              # 弹出窗口UI
│       ├── App.css         # UI样式
│       ├── App.tsx         # React主组件
│       ├── index.html      # UI的HTML骨架
│       └── index.tsx       # React渲染入口
├── package.json            # npm 依赖和脚本配置
├── tsconfig.json           # TypeScript 编译器配置
└── webpack.config.js       # Webpack 打包配置
```

## 4. 核心逻辑详解

本插件主要由三部分构成：后台脚本、内容脚本和弹出窗口UI，它们之间通过 `chrome.runtime` API 进行消息传递。

### 后台脚本 (`service-worker.ts`)

这是插件的大脑，始终在后台运行。 
- **计时核心**: 当计时器启动时，它会记录一个精确的 `startTime` (时间戳)。所有剩余时间的计算都基于 `Date.now() - startTime`，这保证了计时的精确性。
- **事件触发**: 使用 `chrome.alarms` API 来定时触发事件。一个闹钟 (`WORK_REST_ALARM`) 负责处理工作/休息状态的切换，另一个 (`MAIN_TIMER_ALARM`) 负责检查总时长是否已结束。
- **通信中枢**: 负责接收UI的“启动/停止”命令，并向内容脚本发送“显示/隐藏遮罩层”的命令。
- **状态管理**: 负责更新图标上的徽章 (`chrome.action.setBadgeText`)。

### 内容脚本 (`content.ts`)

这是被注入到普通网页中的脚本，是插件与网页交互的桥梁。
- **DOM操作**: 它的唯一职责是监听来自后台脚本的消息。当收到 `show_overlay` 命令时，它会动态创建一个 `<div>` 元素并将其样式设置为覆盖整个网页，然后插入到 `document.body` 中。收到 `hide_overlay` 命令时则将其移除。

### 弹出窗口UI (`App.tsx`)

这是用户能直接交互的界面，使用 React 构建。
- **命令发送**: “启动/停止”按钮会通过 `chrome.runtime.sendMessage` 向后台发送命令。
- **状态同步**: 打开时，它会从后台获取一次最精确的状态（是否在运行、剩余秒数等）。
- **平滑倒计时**: 为了提供良好的用户体验，UI内部自己维护了一个每秒刷新的计时器 (`setInterval`)，实现了平滑的倒计时显示，而不会依赖于频繁地从后台请求状态。

## 5. 如何构建与安装

1.  **环境**: 确保您已安装 [Node.js](https://nodejs.org/) (内置npm)。
2.  **安装依赖**: 在项目根目录运行 `npm install`。
3.  **构建项目**: 运行 `npx webpack`。此命令会读取 `webpack.config.js` 配置，并将 `src` 和 `public` 目录中的所有内容打包到 `dist` 文件夹中。
4.  **加载插件**:
    - 打开 Edge 浏览器，访问 `edge://extensions`。
    - 打开页面右下角的“开发人员模式”。
    - 点击左上角的“加载已解压的扩展”按钮。
    - 在文件选择窗口中，选择本项目中的 `dist` 文件夹。

## 6. 如何自定义

- **修改工作/休息间隔**: 
  - 打开 `src/background/service-worker.ts` 文件。
  - 找到 `getRandomWorkIntervalInSeconds()` 函数，您可以修改其中的随机数范围来改变工作时长。
  - 在 `chrome.alarms.onAlarm` 监听器中，您可以找到 `delayInSeconds: 15` 的代码行，修改这里的 `15` 即可改变休息时长。

---
