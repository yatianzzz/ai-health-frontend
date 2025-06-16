import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Select, DatePicker, Tabs } from 'antd';
import { CalendarOutlined, FireOutlined, AppleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/es/table';
import { Line, Pie } from '@ant-design/charts';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface FoodRecord {
  id: string;
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
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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
    id: '6',
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
  const [dateRange] = useState<[string, string]>(['2023-05-10', '2023-05-16']);
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [activeChartTab, setActiveChartTab] = useState<string>('1');

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

  
  const calorieData = useMemo(() => mockDailyData.map(item => ({
    date: item.date,
    value: item.caloriesConsumed,
    category: 'Consumed',
  })).concat(
    mockDailyData.map(item => ({
      date: item.date,
      value: item.caloriesBurned,
      category: 'Burned',
    }))
  ), []);

 
  const categoryData = useMemo(() => mockFoodRecords.reduce((acc, item) => {
    const existingCategory = acc.find(c => c.type === item.category);
    if (existingCategory) {
      existingCategory.value += item.calories;
    } else {
      acc.push({
        type: item.category,
        value: item.calories,
      });
    }
    return acc;
  }, [] as { type: string; value: number }[]), []);

  
  const lineConfig = useMemo(() => ({
    data: calorieData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    yAxis: {
      title: {
        text: 'Calories (kcal)',
      },
    },
    legend: {
      position: 'top',
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

  
  const pieConfig = useMemo(() => ({
    data: categoryData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      offset: '-30%',
      content: '{percentage}',
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
      layout: 'horizontal',
      position: 'bottom',
    },
  }), [categoryData]);

  
  const filteredFoodRecords = useMemo(() => 
    selectedMealType === 'all' 
      ? mockFoodRecords 
      : mockFoodRecords.filter(record => record.mealType === selectedMealType),
    [selectedMealType]
  );

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Today's Calories Consumed"
              value={2200}
              valueStyle={{ color: '#cf1322' }}
              prefix={<AppleOutlined />}
              suffix="kcal"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Today's Calories Burned"
              value={2250}
              valueStyle={{ color: '#3f8600' }}
              prefix={<FireOutlined />}
              suffix="kcal"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Net Calories"
              value={-50}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowDownOutlined />}
              suffix="kcal"
            />
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeChartTab} onChange={setActiveChartTab} style={{ marginTop: 16 }}>
        <TabPane tab="Calorie Comparison" key="1">
          <Card title="Calories Consumed vs. Burned">
            <div style={{ height: 400 }}>
              <Line {...lineConfig} />
            </div>
          </Card>
        </TabPane>
        <TabPane tab="Food Categories" key="2">
          <Card title="Calorie Distribution by Food Category">
            <div style={{ height: 400 }}>
              <Pie {...pieConfig} />
            </div>
          </Card>
        </TabPane>
      </Tabs>

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