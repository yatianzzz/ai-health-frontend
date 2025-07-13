-- 创建数据库
CREATE DATABASE IF NOT EXISTS ai_health_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE ai_health_db;

-- 创建用户表
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建用户扩展信息表
CREATE TABLE IF NOT EXISTS user_profile (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,                      -- 外键：关联 user.id
    last_name       VARCHAR(50)  NOT NULL,                -- 姓
    first_name      VARCHAR(50)  NOT NULL,                -- 名
    age             TINYINT UNSIGNED NOT NULL COMMENT '年龄 (岁)',
    occupation      VARCHAR(100) NOT NULL,                -- 职业
    gender          ENUM('male','female','other') NOT NULL COMMENT '性别',
    favorite_sport  VARCHAR(50)  NOT NULL COMMENT '常用运动',

    UNIQUE KEY uq_user_profile (user_id),                 -- 一位用户仅一条记录
    CONSTRAINT fk_user_profile_user
        FOREIGN KEY (user_id) REFERENCES user(id)
            ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = '用户扩展信息（静态字段）';

-- 创建运动记录表
CREATE TABLE IF NOT EXISTS user_activity (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,                          -- 外键：关联 user.id
    height          DECIMAL(4,2)  NOT NULL COMMENT '身高 (米)',   -- 例 1.75
    weight          DECIMAL(5,2)  NOT NULL COMMENT '体重 (kg)',   -- 例 70.20
    bmi             DECIMAL(4,1)           COMMENT 'BMI 指数',
    activity_date   DATE          NOT NULL COMMENT '运动日期',
    duration        SMALLINT UNSIGNED NOT NULL COMMENT '时长 (分钟)',
    exercise_type   VARCHAR(30)            COMMENT '运动类型',
    steps           INT UNSIGNED  NOT NULL COMMENT '步数',
    calories        INT UNSIGNED  NOT NULL COMMENT '消耗热量 (kcal)',
    max_heart_rate  SMALLINT UNSIGNED       COMMENT '最大心率',
    min_heart_rate  SMALLINT UNSIGNED       COMMENT '最小心率',

    INDEX idx_user_date (user_id, activity_date),             -- 常用复合索引
    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id) REFERENCES user(id)
            ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = '用户运动 / 健康监测记录';

-- 创建饮食记录表
CREATE TABLE dietary_record (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,                        -- 关联 user.id
    record_date     DATE    NOT NULL,                       -- YYYY-MM-DD
    record_time     TIME    NOT NULL,                       -- HH:mm
    meal_type       ENUM('breakfast','lunch','dinner','snack') NOT NULL,
    notes           VARCHAR(255) NULL,                      -- 备注，可为空
    total_calories  INT     NOT NULL,                       -- 本餐总卡路里，单位 kcal
    create_time     DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_diet_user_date (user_id, record_date),
    CONSTRAINT fk_diet_user
        FOREIGN KEY (user_id) REFERENCES user(id)
            ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Dietary Record 表';

-- 创建食物明细表
CREATE TABLE food_item (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    dietary_record_id   BIGINT NOT NULL,                    -- 关联 dietary_record.id
    name                VARCHAR(100) NOT NULL,              -- 食物名称
    category            ENUM('fruits','vegetables','grains',
                          'protein','dairy','snacks',
                          'beverages','other') NOT NULL,    -- 食物类别
    quantity            DECIMAL(10,2) NOT NULL,             -- 数量
    unit                VARCHAR(20)  NOT NULL,              -- 单位 (g, ml, serving …)
    calories            INT         NOT NULL,               -- 该份食物的热量 kcal
    create_time         DATETIME DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_food_record (dietary_record_id),
    CONSTRAINT fk_food_record
        FOREIGN KEY (dietary_record_id) REFERENCES dietary_record(id)
            ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Food Item 表';

-- 显示所有表
SHOW TABLES;
