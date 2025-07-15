import React, { useState, useMemo, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Select, DatePicker, Tabs } from 'antd';
import { CalendarOutlined, FireOutlined, AppleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import { Line, Pie } from '@ant-design/plots';
import { useDiet } from '../context/DietContext';
// import {
//   getFoodCategoriesData,
//   getCalorieComparisonChartData,
//   getDailySummaryData,
//   FoodCategoryData,
//   CalorieComparisonData,
//   DailySummaryData
// } from '../services/dietAPI';
import { getDietaryRecords, getDailySummaryData } from '../services/dietAPI';
import { getAllExerciseRecords } from '../services/exerciseAPI';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;
const { Option } = Select;

interface FoodRecord {
  id: number;
  name: string;
  category: string;
  calories: number;
  quantity: number;
  unit: string;
  mealType: string;
  date: string;
  time: string;
}

interface DailyNutrition {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  netCalories: number;
}

const mockFoodRecords: FoodRecord[] = [
  {
    id: 1,
    name: 'Grilled Chicken Breast',
    category: 'protein',
    calories: 165,
    quantity: 1,
    unit: 'piece',
    mealType: 'lunch',
    date: '2023-05-15',
    time: '12:30'
  },
  {
    id: 2,
    name: 'Brown Rice',
    category: 'grains',
    calories: 215,
    quantity: 1,
    unit: 'cup',
    mealType: 'lunch',
    date: '2023-05-15',
    time: '12:30'
  },
  {
    id: 3,
    name: 'Steamed Broccoli',
    category: 'vegetables',
    calories: 55,
    quantity: 1,
    unit: 'cup',
    mealType: 'lunch',
    date: '2023-05-15',
    time: '12:30'
  },
  {
    id: 4,
    name: 'Apple',
    category: 'fruits',
    calories: 95,
    quantity: 1,
    unit: 'medium',
    mealType: 'snack',
    date: '2023-05-15',
    time: '15:45'
  },
  {
    id: 5,
    name: 'Oatmeal',
    category: 'grains',
    calories: 150,
    quantity: 1,
    unit: 'cup',
    mealType: 'breakfast',
    date: '2023-05-15',
    time: '08:00'
  },
  {
    id: 6,
    name: 'Salmon Fillet',
    category: 'protein',
    calories: 367,
    quantity: 1,
    unit: 'fillet',
    mealType: 'dinner',
    date: '2023-05-15',
    time: '19:00'
  }
];

const mockDailyData: DailyNutrition[] = [
  { date: '2023-05-10', caloriesConsumed: 2100, caloriesBurned: 2300, netCalories: -200 },
  { date: '2023-05-11', caloriesConsumed: 2250, caloriesBurned: 2150, netCalories: 100 },
  { date: '2023-05-12', caloriesConsumed: 1950, caloriesBurned: 2400, netCalories: -450 },
  { date: '2023-05-13', caloriesConsumed: 2350, caloriesBurned: 2200, netCalories: 150 },
  { date: '2023-05-14', caloriesConsumed: 2000, caloriesBurned: 2100, netCalories: -100 },
  { date: '2023-05-15', caloriesConsumed: 2200, caloriesBurned: 2250, netCalories: -50 },
  { date: '2023-05-16', caloriesConsumed: 1800, caloriesBurned: 2000, netCalories: -200 },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'fruits': return 'green';
    case 'vegetables': return 'lime';
    case 'grains': return 'gold';
    case 'protein': return 'red';
    case 'dairy': return 'blue';
    case 'snacks': return 'orange';
    case 'beverages': return 'cyan';
    default: return 'default';
  }
};

const getMealTypeColor = (mealType: string) => {
  switch (mealType) {
    case 'breakfast': return 'blue';
    case 'lunch': return 'green';
    case 'dinner': return 'purple';
    case 'snack': return 'orange';
    default: return 'default';
  }
};

// 使用React.memo包裹组件，避免不必要的重新渲染
const DietaryDataDisplay: React.FC = React.memo(() => {
  const { foodItems, dietaryRecords, fetchFoodItems, fetchDietaryRecords, isLoading } = useDiet();
  const [dateRange] = useState<[string, string]>(['2023-05-10', '2023-05-16']);
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [activeChartTab, setActiveChartTab] = useState<string>('1');

  // New state for real data
  const [foodCategoriesData, setFoodCategoriesData] = useState<any[]>([]);
  const [calorieComparisonData, setCalorieComparisonData] = useState<any[]>([]);
  const [dailySummaryData, setDailySummaryData] = useState<any | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // 获取实际每日汇总数据
  useEffect(() => {
    async function fetchSummary() {
      setStatsLoading(true);
      try {
        const res = await getDailySummaryData();
        if (res.code === 200) {
          setDailySummaryData(res.data);
        }
      } catch (e) {
        setDailySummaryData(null);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchSummary();
  }, []);

  // 2. dietaryRecords 加载后，批量加载所有 foodItems
  useEffect(() => {
    const loadAllFoodItems = async () => {
      if (dietaryRecords.length > 0) {
        // 清空旧数据（如有必要）
        // setFoodItems([]);
        // 批量加载所有 recordId 的 food items
        for (const record of dietaryRecords) {
          await fetchFoodItems(record.id);
        }
      }
    };
    loadAllFoodItems();
  }, [dietaryRecords, fetchFoodItems]);
  
  const mergedFoodRecords = useMemo(() => {
    // 以 dietaryRecordId 关联 dietaryRecords
    const recordMap = new Map();
    dietaryRecords.forEach(rec => {
      recordMap.set(rec.id, rec);
    });
    return foodItems.map(item => {
      const record = recordMap.get(item.dietaryRecordId) || {};
      return {
        ...item,
        mealType: record.mealType || '',
        date: record.recordDate || '',
        time: record.recordTime ? (record.recordTime.length > 5 ? record.recordTime.slice(0, 5) : record.recordTime) : ''
      };
    });
  }, [foodItems, dietaryRecords]);

  const filteredFoodRecords = useMemo(() => 
    (selectedMealType === 'all' 
      ? mergedFoodRecords 
      : mergedFoodRecords.filter(record => record.mealType === selectedMealType)
    ).slice().reverse(),
    [selectedMealType, mergedFoodRecords]
  );

  // 使用useMemo缓存表格列配置，避免重新渲染时重新创建
  const columns = useMemo<ColumnProps<FoodRecord>[]>(() => [
    {
      title: 'Food',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>{category}</Tag>
      ),
    },
    {
      title: 'Meal',
      dataIndex: 'mealType',
      key: 'mealType',
      render: (mealType: string) => (
        <Tag color={getMealTypeColor(mealType)}>{mealType}</Tag>
      ),
      filters: [
        { text: 'Breakfast', value: 'breakfast' },
        { text: 'Lunch', value: 'lunch' },
        { text: 'Dinner', value: 'dinner' },
        { text: 'Snack', value: 'snack' },
      ],
      onFilter: (value, record) => record.mealType === value,
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (_, record) => `${record.quantity} ${record.unit}`,
    },
    {
      title: 'Calories',
      dataIndex: 'calories',
      key: 'calories',
      sorter: (a, b) => a.calories - b.calories,
      render: (calories: number) => `${calories} kcal`,
    },
    {
      title: 'Time',
      key: 'time',
      render: (_, record) => `${record.date} ${record.time}`,
    },
  ], []);

  
  // Use real data instead of mock data
  // const calorieData = useMemo(() => calorieComparisonData, [calorieComparisonData]);

  const [calorieData, setCalorieData] = useState<{ date: Date; value: number; category: string }[]>([]);
  console.log('calorieData', calorieData);

  useEffect(() => {
    async function fetchData() {
      // 1. 获取饮食记录
      const dietRes = await getDietaryRecords();
      console.log('dietRes', dietRes);
      const consumedMap: Record<string, number> = {};
      dietRes.data.forEach(rec => {
        if (!consumedMap[rec.recordDate]) consumedMap[rec.recordDate] = 0;
        consumedMap[rec.recordDate] += rec.totalCalories;
      });

      // 2. 获取运动记录
      const exerciseRes = await getAllExerciseRecords();
      const burnedMap: Record<string, number> = {};
      if (exerciseRes.data) {
        exerciseRes.data.forEach(rec => {
          const date = rec.activityDate.split('T')[0]; // 只取日期部分
          if (!burnedMap[date]) burnedMap[date] = 0;
          burnedMap[date] += rec.calories;
        });
      }

      // 3. 合并数据
      const allDates = Array.from(new Set([...Object.keys(consumedMap), ...Object.keys(burnedMap)]));
      const merged = allDates.flatMap(date => [
        { date: new Date(date), value: consumedMap[date] || 0, category: 'Consumed' },
        { date: new Date(date), value: burnedMap[date] || 0, category: 'Burned' }
      ]);
      console.log('merged', merged);
      merged.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setCalorieData(merged);
    }
    fetchData();
  }, []);

  // const categoryData = useMemo(() => {
  //   return foodCategoriesData.filter(item =>
  //     item &&
  //     item.type &&
  //     item.type !== 'undefined' &&
  //     item.type.trim() !== '' &&
  //     item.value &&
  //     item.value > 0
  //   );
  // }, [foodCategoriesData]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    foodItems.forEach(item => {
      if (item.category && item.category !== 'undefined') {
        if (!map[item.category]) map[item.category] = 0;
        map[item.category] += item.calories;
      }
    });
    return Object.entries(map).map(([type, value]) => ({ type, value }));
  }, [foodItems]);

  console.log('categoryData', categoryData)
  const lineConfig = useMemo(() => ({
    data: calorieData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    axis: {
      x: {
        type: 'time',
        title: 'Date',
        grid: true,
        labelFormater:  (text: any) => dayjs(text.date).format('YYYY-MM-DD'),
      },
      y: {
        type: 'linear',
        title: 'Calories (kcal)',
        grid: true
      }
    },
    legend: {
      position: 'top',
    },
    tooltip: {
      title: (datum: any) => dayjs(datum.date).format('YYYY-MM-DD'),
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: ['#ff7a45', '#52c41a'],
  }), [calorieData]);

  
  // 计算总热量用于百分比
  const totalCategoryValue = useMemo(() => categoryData.reduce((sum, item) => sum + (item.value || 0), 0), [categoryData]);

  const pieConfig = useMemo(() => ({
    data: categoryData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      text: (datum: { type: string; value: number }) => `${datum.type}: ${totalCategoryValue ? ((datum.value / totalCategoryValue) * 100).toFixed(0) : 0}%`,
      // position: 'outside',
      autoRotate: true,
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    legend: {
      color: {
        title: false,
        position: 'top',
        rowPadding: 5,
      },
    },
  }), [categoryData, totalCategoryValue]);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Today's Calories Consumed"
              value={dailySummaryData?.caloriesConsumed || 0}
              valueStyle={{ color: '#cf1322' }}
              prefix={<AppleOutlined />}
              suffix="kcal"
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Today's Calories Burned"
              value={dailySummaryData?.caloriesBurned || 0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<FireOutlined />}
              suffix="kcal"
              loading={statsLoading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Net Calories"
              value={dailySummaryData?.netCalories || 0}
              precision={0}
              valueStyle={{
                color: dailySummaryData?.trend === 'up' ? '#cf1322' : '#3f8600'
              }}
              prefix={
                dailySummaryData?.trend === 'up' ?
                <ArrowUpOutlined /> :
                <ArrowDownOutlined />
              }
              suffix="kcal"
              loading={statsLoading}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        activeKey={activeChartTab}
        onChange={setActiveChartTab}
        style={{ marginTop: 16 }}
        items={[
          {
            key: "1",
            label: "Calorie Comparison",
            children: (
              <Card title="Calories Consumed vs. Burned">
                <div style={{ height: 400 }}>
                  <Line {...lineConfig} />
                </div>
              </Card>
            )
          },
          {
            key: "2",
            label: "Food Categories",
            children: (
              <Card title="Calorie Distribution by Food Category">
                <div style={{ height: 400 }}>
                  <Pie {...pieConfig} />
                </div>
              </Card>
            )
          }
        ]}
      />

      <Card 
        title="Recent Food Records" 
        style={{ marginTop: 16 }}
        extra={
          <Select 
            defaultValue="all" 
            style={{ width: 120 }} 
            onChange={value => setSelectedMealType(value)}
          >
            <Option value="all">All Meals</Option>
            <Option value="breakfast">Breakfast</Option>
            <Option value="lunch">Lunch</Option>
            <Option value="dinner">Dinner</Option>
            <Option value="snack">Snack</Option>
          </Select>
        }
      >
        <Table 
          columns={columns} 
          dataSource={filteredFoodRecords} 
          rowKey="id" 
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
});

export default DietaryDataDisplay; 