/* ---------- 开始事务，建两张表 ---------- */
START TRANSACTION;

/* =============================================================
 *  1. 用户扩展信息表  ——  user_profile   (一对一)
 * =========================================================== */
CREATE TABLE IF NOT EXISTS user_profile (
                                            id              BIGINT AUTO_INCREMENT PRIMARY KEY,
                                            user_id         BIGINT NOT NULL,                      -- 外键：关联 user.id
                                            last_name       VARCHAR(50)  NOT NULL,                -- 姓
    first_name      VARCHAR(50)  NOT NULL,                -- 名
    age             TINYINT UNSIGNED NOT NULL
    COMMENT '年龄 (岁)',
    occupation      VARCHAR(100) NOT NULL,                -- 职业
    gender          ENUM('male','female','other') NOT NULL
    COMMENT '性别',
    favorite_sport  VARCHAR(50)  NOT NULL
    COMMENT '常用运动',

    UNIQUE KEY uq_user_profile (user_id),                 -- 一位用户仅一条记录
    CONSTRAINT fk_user_profile_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE
    ) ENGINE = InnoDB
    DEFAULT CHARSET = utf8mb4
    COMMENT = '用户扩展信息（静态字段）';

/* =============================================================
 *  2. 运动 / 健康监测记录表 —— user_activity (一对多)
 * =========================================================== */
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

/* ---------- 提交事务 ---------- */
COMMIT;

/* ---------- 建表完毕，验证可用 ---------- */
SHOW TABLES;
