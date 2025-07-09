ai-health-management/                     // 项目根目录
├── pom.xml                              // Maven 配置文件（或 build.gradle）
└── src
├── main
│   ├── java
│   │   └── com
│   │       └── mycompany
│   │           └── aihealth
│   │               ├── AiHealthManagementApplication.java    // Spring Boot 启动类
│   │               │
│   │               ├── config                          // 配置类（全局配置、Swagger、数据库、Security等）
│   │               │   ├── SwaggerConfig.java
│   │               │   ├── SecurityConfig.java
│   │               │   ├── WebMvcConfig.java
│   │               │   └── DataSourceConfig.java       // 如需要自定义数据源配置
│   │               │
│   │               ├── controller                      // 控制器层，处理 HTTP 请求
│   │               │   ├── AuthController.java         // 用户注册/登录、JWT 认证
│   │               │   ├── UserController.java         // 用户信息与个人中心
│   │               │   ├── ChatController.java         // LLM 聊天接口（心理健康模块）
│   │               │   ├── DietController.java         // 饮食推荐接口
│   │               │   ├── ExerciseController.java     // 运动数据与计划接口
│   │               │   ├── HealthAnalysisController.java // 健康数据分析与报告
│   │               │   └── NotificationController.java  // 提醒通知接口
│   │               │
│   │               ├── dto                             // 数据传输对象（API 请求和响应封装）
│   │               │   ├── AuthDto.java
│   │               │   ├── UserDto.java
│   │               │   ├── ChatDto.java
│   │               │   ├── DietDto.java
│   │               │   ├── ExerciseDto.java
│   │               │   └── HealthAnalysisDto.java
│   │               │
│   │               ├── entity                          // 实体类，对应数据库表
│   │               │   ├── User.java
│   │               │   ├── Role.java
│   │               │   ├── ChatMessage.java
│   │               │   ├── DietRecord.java
│   │               │   ├── ExerciseRecord.java
│   │               │   └── Notification.java
│   │               │
│   │               ├── exception                       // 自定义异常及全局异常处理
│   │               │   ├── CustomException.java
│   │               │   └── GlobalExceptionHandler.java
│   │               │
│   │               ├── repository                      // 数据访问层（DAO或Spring Data JPA接口）
│   │               │   ├── UserRepository.java
│   │               │   ├── RoleRepository.java
│   │               │   ├── ChatRepository.java
│   │               │   ├── DietRecordRepository.java
│   │               │   ├── ExerciseRecordRepository.java
│   │               │   └── NotificationRepository.java
│   │               │
│   │               ├── security                        // 安全相关组件（JWT、过滤器等）
│   │               │   ├── JwtAuthenticationEntryPoint.java
│   │               │   ├── JwtTokenProvider.java
│   │               │   └── JwtAuthenticationFilter.java
│   │               │
│   │               ├── service                         // 业务逻辑层接口
│   │               │   ├── AuthService.java
│   │               │   ├── UserService.java
│   │               │   ├── ChatService.java
│   │               │   ├── DietService.java
│   │               │   ├── ExerciseService.java
│   │               │   ├── HealthAnalysisService.java
│   │               │   └── NotificationService.java
│   │               │
│   │               ├── service.impl                    // 业务逻辑层具体实现
│   │               │   ├── AuthServiceImpl.java
│   │               │   ├── UserServiceImpl.java
│   │               │   ├── ChatServiceImpl.java
│   │               │   ├── DietServiceImpl.java
│   │               │   ├── ExerciseServiceImpl.java
│   │               │   ├── HealthAnalysisServiceImpl.java
│   │               │   └── NotificationServiceImpl.java
│   │               │
│   │               ├── integration                    // 外部系统/服务集成
│   │               │   ├── LLMIntegration.java         // LLM 聊天模型接口封装
│   │               │   ├── NutritionApiClient.java     // 食品营养 API 客户端
│   │               │   └── BlockchainClient.java       // Web3 NFT 集成
│   │               │
│   │               ├── job                            // 定时任务（如提醒推送）
│   │               │   └── NotificationJob.java
│   │               │
│   │               ├── blockchain                     // Web3 与 NFT 模块
│   │               │   ├── NFTController.java
│   │               │   ├── NFTService.java
│   │               │   └── NFTServiceImpl.java
│   │               │
│   │               └── util                           // 工具类（JWT 工具、通用工具等）
│   │                   ├── JwtUtil.java
│   │                   ├── DateUtil.java
│   │                   └── CommonUtil.java
│   │
│   └── resources
│       ├── application.yml                // 配置文件（端口、数据库、JWT 等）
│       ├── static                       // 静态资源（如图片、JS等，如有需要）
│       ├── templates                    // 模板文件（如使用 Thymeleaf，可选）
│       └── db
│           └── migration                // 数据库迁移文件（Flyway/Liquibase）
│               └── V1__init.sql
│
└── test
└── java
└── com
└── mycompany
└── aihealth
└── ... (单元测试和集成测试代码)
