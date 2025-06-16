# ai-health-frontend# 健康管理系统前端部分

## 更新日志

### 5.26修改
1. 主界面优化
2. Dietary Suggestions界面初步制作
3. Exercise Guidance功能的添加
4. 个人信息界面的添加
5. 提示优化
6. token修改

## 主要功能

1. **智能健身咨询**
   - chatbot连接
   - 运动数据展示
   - 常见健身问题解答
   - 添加假数据进行测试test-api

2. **健康数据追踪**
    - 待完成
  

3. **饮食管理**
    - 待完成

4. **用户个性化**
   - 个人档案设置

5. **登录注册界面**
   - 已存在


##安装包控制

- **前端框架**: React 19.1.0
- **开发语言**: TypeScript 4.9.5
- **UI组件库**: Ant Design 5.24.6
- **图表组件**: Ant Design Charts 2.2.7
- **路由管理**: React Router DOM 6.3.0
- **样式管理**: Styled Components 6.1.17
- **Markdown渲染**: React Markdown 8.0.7，Remark GFM 4.0.1

## 项目结构

```
health-management-system/
├── public/                # 静态资源
├── src/                   # 源代码
│   ├── assets/            # 图片、图标等资源
│   ├── components/        # 可复用组件
│   │   ├── ExerciseAIChatBox.tsx       # 健身AI助手组件
│   │   └── ExerciseAIChatBox.css       # 健身AI助手样式
│   ├── layouts/           # 布局组件
│   ├── pages/             # 页面组件
│   ├── services/          # API服务
│   │   └── api.ts         # API请求处理
│   ├── styles/            # 全局样式
│   ├── utils/             # 工具函数
│   ├── App.tsx            # 应用主组件
│   └── index.tsx          # 应用入口
├── package.json           # 依赖包配置
└── tsconfig.json          # TypeScript配置
```

## 安装与运行

### 系统版本

- Node.js 16.x 或更高版本
- npm 8.x 或更高版本

### 需安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm start
```

### 构建生产环境

```bash
npm run build
```

## 依赖包版本

```json
"dependencies": {
  "@ant-design/charts": "^2.2.7",
  "@ant-design/icons": "^6.0.0",
  "@testing-library/dom": "^10.4.0",
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/react": "^16.3.0",
  "@testing-library/user-event": "^13.5.0",
  "@types/jest": "^27.5.2",
  "@types/node": "^16.18.126",
  "@types/react": "^19.1.0",
  "@types/react-dom": "^19.1.1",
  "antd": "^5.24.6",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-markdown": "^8.0.7",
  "react-router-dom": "^6.3.0",
  "react-scripts": "5.0.1",
  "rehype-raw": "^7.0.0",
  "rehype-sanitize": "^6.0.0",
  "remark-gfm": "^4.0.1",
  "styled-components": "^6.1.17",
  "typescript": "^4.9.5",
  "web-vitals": "^2.1.4"
}
```
