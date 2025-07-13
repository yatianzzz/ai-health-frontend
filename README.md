# ai-health-frontend# 健康管理系统前端部分

## 更新日志

### NFT管理功能更新
1. **NFT激励系统**
   - 用户可以通过完成健康记录获得NFT奖励
   - 支持7条记录和30条记录的折扣卡NFT
   - 智能资格检查，根据用户活动记录判断获得权限
   - 钱包交互功能：存入链上、从链上接收、转移NFT

2. **NFT管理员系统**
   - 管理员可以直接铸造NFT给任何用户
   - NFT统计数据展示：总铸造数量、用户分布、类别统计
   - 用户NFT管理：查看所有用户的NFT拥有情况
   - 演示数据功能：快速初始化测试数据

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
    - 运动记录管理
    - 饮食记录管理
    - 数据可视化展示

3. **饮食管理**
    - 食物记录
    - 卡路里统计
    - 营养分析

4. **NFT激励系统**
   - 基于健康记录的NFT奖励
   - 钱包集成和区块链交互
   - NFT管理和转移功能

5. **用户个性化**
   - 个人档案设置

6. **登录注册界面**
   - 已存在

## NFT功能使用指南

### 用户端NFT功能
1. **查看NFT激励**
   - 导航至 "NFT Incentive" 页面
   - 查看所有可获得的NFT和当前进度
   - 连接钱包以获得完整功能

2. **获得NFT**
   - 完成相应数量的健康记录
   - 在NFT页面点击"立即获得"按钮
   - 系统会自动检查资格并铸造NFT

3. **查看NFT收藏**
   - **所有NFT**: 查看所有可获得的NFT
   - **已获得**: 查看已获得的NFT收藏
   - **未获得**: 查看待获得的NFT及进度
   - **钱包交互**: 专门的钱包功能模块

4. **钱包交互功能**
   - **存入链上**: 将已获得的NFT安全存储在区块链上
   - **从链上接收**: 将区块链上的NFT接收到本地钱包
   - **转移NFT**: 将NFT转移给其他用户
   - 翻转NFT卡片查看正反面

### 管理员端NFT功能
1. **访问管理员页面**
   - 使用管理员账户登录（用户名：admin 或 administrator）
   - 导航至 "NFT Admin" 页面

2. **铸造NFT**
   - 在"NFT铸造"标签页中选择目标NFT
   - 输入接收用户的钱包地址
   - 点击"铸造NFT"按钮

3. **查看统计数据**
   - 在"统计数据"标签页查看NFT铸造统计
   - 查看总数量、用户分布、类别分析

4. **管理用户NFT**
   - 在"用户管理"标签页查看所有用户的NFT
   - 搜索特定用户
   - 删除用户的NFT（如有需要）

5. **演示数据**
   - 点击"初始化演示数据"创建测试数据
   - 点击"清理演示数据"清除所有测试数据

## 管理员账户
- 用户名: `admin` 或 `administrator`
- 密码: （根据实际后端配置）

##安装包控制

- **前端框架**: React 19.1.0
- **开发语言**: TypeScript 4.9.5
- **UI组件库**: Ant Design 5.24.6
- **图表组件**: Ant Design Charts 2.2.7
- **路由管理**: React Router DOM 6.3.0
- **样式管理**: Styled Components 6.1.17
- **Markdown渲染**: React Markdown 8.0.7，Remark GFM 4.0.1
- **区块链集成**: Solana Web3.js, Anchor框架

## 项目结构

```
health-management-system/
├── public/                # 静态资源
│   ├── 7R5percent/        # NFT图片资源
│   ├── 7R10percent/
│   ├── 30R8percent/
│   ├── 30R10percent/
│   ├── regularDiet/
│   └── PowerKing/
├── src/                   # 源代码
│   ├── assets/            # 图片、图标等资源
│   ├── components/        # 可复用组件
│   │   ├── AdminMint.tsx          # 管理员铸造组件
│   │   ├── NFTStatistics.tsx      # NFT统计组件
│   │   ├── UserNFTManager.tsx     # 用户NFT管理组件
│   │   ├── NFTGallery.tsx         # NFT画廊组件
│   │   ├── ExerciseAIChatBox.tsx  # 健身AI助手组件
│   │   └── ExerciseAIChatBox.css  # 健身AI助手样式
│   ├── layouts/           # 布局组件
│   ├── pages/             # 页面组件
│   │   ├── NFTIncentive.tsx       # NFT激励页面
│   │   └── NFTAdmin.tsx           # NFT管理员页面
│   ├── services/          # API服务
│   │   ├── nftService.ts          # NFT服务
│   │   └── api.ts                 # API请求处理
│   ├── utils/             # 工具函数
│   │   └── demoData.ts            # 演示数据工具
│   ├── styles/            # 全局样式
│   ├── App.tsx            # 应用主组件
│   └── index.tsx          # 应用入口
├── package.json           # 依赖包配置
└── tsconfig.json          # TypeScript配置
```

## NFT类型说明

### 折扣权益NFT（基于运动+饮食记录总数）
- **7条记录5%折扣卡**: 完成7条健康记录（运动+饮食）获得5%折扣
- **7条记录10%折扣卡**: 完成7条优质健康记录（运动+饮食）获得10%折扣  
- **30条记录8%折扣卡**: 完成30条持续健康记录（运动+饮食）获得8%折扣
- **30条记录10%折扣卡**: 完成30条高质量健康记录（运动+饮食）获得10%折扣

### 成就证书NFT（基于特定类型记录）
- **饮食之王**: 完成30条饮食记录，掌握规律饮食习惯的认证
- **运动之王**: 完成30条运动记录，达到顶级体能水平的称号

## NFT获得条件详细说明

### 记录类型
系统现在会同时检查两种类型的健康记录：
1. **运动记录** - 通过运动指导页面记录的体能活动
2. **饮食记录** - 通过饮食建议页面记录的饮食信息

### 获得条件逻辑

#### 折扣权益NFT (7R和30R系列)
这些NFT基于运动记录和饮食记录的**总和**来判断：
- 用户需要累计完成指定数量的健康记录
- 运动记录 + 饮食记录 ≥ 要求数量
- 例如：7R NFT需要7条记录，可以是5条运动+2条饮食，或3条运动+4条饮食等

#### 成就证书NFT
这些NFT基于**特定类型**的记录来判断：
- **饮食之王**：只计算饮食记录数量，需要30条饮食记录
- **运动之王**：只计算运动记录数量，需要30条运动记录

### 进度显示
- 折扣卡：`X/Y 条记录已完成（运动A+饮食B）`
- 饮食之王：`X/30 条饮食记录已完成`
- 运动之王：`X/30 条运动记录已完成`

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

# ai-health-frontend