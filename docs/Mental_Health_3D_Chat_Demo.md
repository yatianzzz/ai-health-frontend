# Mental Health 3D Chat Interface Demo

## 功能概述

这是一个基于React + Three.js开发的3D心理健康对话界面，提供沉浸式的AI心理咨询体验。

## 主要特性

### 🎭 3D虚拟助手
- **生动的3D人物模型**：包含头部、身体、眼睛、嘴巴等完整身体部位
- **实时动画效果**：
  - 呼吸动画（胸部起伏）
  - 头部轻微摆动
  - 眨眼动画
  - 说话时的嘴部动画
- **状态指示**：
  - 蓝色：等待状态
  - 绿色：倾听状态
  - 橙色：说话状态
- **交互功能**：点击3D人物可触发问候

### 🌟 视觉效果
- **动态背景粒子**：100个浮动的彩色粒子营造氛围
- **专业光照系统**：
  - 环境光
  - 方向光（带阴影）
  - 彩色补光
- **材质效果**：
  - 半透明材质
  - 金属质感
  - 发光效果
- **雾化效果**：增加景深感

### 🎮 交互控制
- **鼠标控制**：
  - 拖拽旋转视角
  - 滚轮缩放（3-10倍距离）
  - 限制极角范围
- **键盘快捷键**：Enter键发送消息
- **触摸支持**：移动设备友好

### 💬 对话系统
- **智能回复**：基于关键词的情感识别和回复
- **消息历史**：完整的对话记录
- **实时状态**：显示AI思考、倾听、回复状态
- **时间戳**：每条消息都有时间记录

## 技术实现

### 前端技术栈
- **React 18** + **TypeScript**
- **Three.js** - 3D图形渲染
- **@react-three/fiber** - React Three.js集成
- **@react-three/drei** - Three.js辅助组件
- **Ant Design** - UI组件库
- **Styled Components** - CSS-in-JS样式

### 核心组件

#### VirtualAssistant
3D虚拟人物组件，包含：
- 头部球体（带呼吸和摆动动画）
- 身体立方体
- 眼睛（带眨眼动画）
- 嘴巴（说话时动画）
- 手臂
- 状态光环
- 浮动粒子效果

#### ThreeDScene
3D场景组件，包含：
- Canvas画布设置
- 光照系统
- 背景粒子
- 地面
- 雾化效果
- 相机控制

#### BackgroundParticles
背景粒子系统：
- 100个随机分布的粒子
- 不同大小和颜色
- 缓慢旋转和浮动动画

## 使用方法

### 启动应用
```bash
npm start
```

### 访问界面
1. 登录系统
2. 导航到 "Mental Health Support"
3. 点击 "AI心理健康对话"
4. 开始与3D虚拟助手对话

### 交互操作
1. **发送消息**：在右侧输入框输入文字，按Enter或点击发送
2. **旋转视角**：拖拽鼠标左键
3. **缩放视图**：滚动鼠标滚轮
4. **触发问候**：点击3D虚拟助手

## 文件结构

```
src/pages/MentalHealthChat.tsx
├── VirtualAssistant (3D人物组件)
├── BackgroundParticles (背景粒子)
├── ThreeDScene (3D场景)
└── MentalHealthChat (主组件)
```

## 状态管理

- `isListening`: AI正在倾听用户输入
- `isSpeaking`: AI正在回复
- `isLoading`: AI正在思考
- `messages`: 对话历史记录

## 动画系统

### 呼吸动画
```javascript
headRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.02);
bodyRef.current.scale.y = 1 + Math.sin(time * 2) * 0.03;
```

### 眨眼动画
```javascript
const blinkTime = Math.sin(time * 3) > 0.95 ? 0.1 : 1;
leftEyeRef.current.scale.y = blinkTime;
```

### 说话动画
```javascript
if (isSpeaking) {
  mouthRef.current.scale.x = 1 + Math.sin(time * 8) * 0.3;
  mouthRef.current.scale.y = 1 + Math.sin(time * 6) * 0.2;
}
```

## 性能优化

- 使用 `useRef` 避免不必要的重渲染
- `Suspense` 组件处理异步加载
- 限制粒子数量和动画复杂度
- 合理的光照设置平衡视觉效果和性能

## 未来扩展

- [ ] 添加语音识别和合成
- [ ] 更复杂的3D人物模型
- [ ] 面部表情动画
- [ ] 手势动画
- [ ] 背景场景切换
- [ ] VR/AR支持

## 注意事项

- 需要现代浏览器支持WebGL
- 建议使用Chrome、Firefox、Safari等主流浏览器
- 移动设备性能可能有限，建议在桌面端使用
- 首次加载可能需要一些时间来下载Three.js资源
