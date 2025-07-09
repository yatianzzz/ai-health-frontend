/* =============================================================
 *  Dietary Record  &  Food Item  建表脚本
 *  依赖已存在的 user(id) 主表
 * =========================================================== */
START TRANSACTION;

/* -------------------------------------------------------------
 * 1. Dietary Record  —— 记录用户每日每餐的总体信息
 * ----------------------------------------------------------- */
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

/* -------------------------------------------------------------
 * 2. Food Item  —— 具体到每一种食物的摄入明细
 *    每条 Food Item 通过 dietary_record_id 归属于一条 Dietary Record
 * ----------------------------------------------------------- */
CREATE TABLE food_item (
                           id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
                           dietary_record_id   BIGINT NOT NULL,                    -- 关联 dietary_record.id
                           name                VARCHAR(100) NOT NULL,              -- 食物名称
                           category            ENUM('fruits','vegetables','grains',
                             'protein','dairy','snacks',
                             'beverages','other') NOT NULL, -- 食物类别
                           quantity            DECIMAL(10,2) NOT NULL,             -- 数量
                           unit                VARCHAR(20)  NOT NULL,              -- 单位 (g, ml, serving …)
                           calories            INT         NOT NULL,               -- 该份食物的热量 kcal
                           create_time         DATETIME DEFAULT CURRENT_TIMESTAMP,

                           INDEX idx_food_record (dietary_record_id),
                           CONSTRAINT fk_food_record
                               FOREIGN KEY (dietary_record_id) REFERENCES dietary_record(id)
                                   ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'Food Item 表';

COMMIT;
