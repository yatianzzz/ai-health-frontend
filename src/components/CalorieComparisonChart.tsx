import React from 'react';
import { Card, Tabs } from 'antd';
import { Column, Pie, DualAxes } from '@ant-design/plots';

const { TabPane } = Tabs;

interface CalorieData {
  date: string;
  intake: number;
  burned: number;
  balance: number;
}

interface NutrientData {
  type: string;
  value: number;
  category: string;
}

const CalorieComparisonChart: React.FC = () => {
  // Sample data for the charts
  const dailyData: CalorieData[] = [
    { date: 'Mon', intake: 2100, burned: 2300, balance: 200 },
    { date: 'Tue', intake: 2400, burned: 2100, balance: -300 },
    { date: 'Wed', intake: 1900, burned: 2200, balance: 300 },
    { date: 'Thu', intake: 2200, burned: 2400, balance: 200 },
    { date: 'Fri', intake: 2500, burned: 2300, balance: -200 },
    { date: 'Sat', intake: 2300, burned: 1900, balance: -400 },
    { date: 'Sun', intake: 1800, burned: 1700, balance: -100 },
  ];

  const weeklyData = [
    { type: 'Intake', value: 16200 },
    { type: 'Burned', value: 14900 },
  ];

  const nutrientData: NutrientData[] = [
    { type: 'Protein', value: 25, category: 'Recommended' },
    { type: 'Carbs', value: 50, category: 'Recommended' },
    { type: 'Fat', value: 25, category: 'Recommended' },
    { type: 'Protein', value: 30, category: 'Actual' },
    { type: 'Carbs', value: 45, category: 'Actual' },
    { type: 'Fat', value: 25, category: 'Actual' },
  ];

  // Configuration for the daily comparison chart
  const dailyConfig = {
    data: dailyData,
    xField: 'date',
    yField: ['intake', 'burned'],
    geometryOptions: [
      {
        geometry: 'column',
        isGroup: true,
        seriesField: 'type',
        columnWidthRatio: 0.4,
        label: {},
        color: ['#1890ff', '#ff4d4f'],
      },
    ],
    meta: {
      intake: {
        alias: 'Calories Intake',
      },
      burned: {
        alias: 'Calories Burned',
      },
    },
    legend: {
      position: 'top',
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      intake: {
        min: 0,
        title: {
          text: 'Calories (kcal)',
        },
      },
      burned: {
        min: 0,
      },
    },
  };

  // Configuration for the balance chart
  const balanceConfig = {
    data: dailyData,
    xField: 'date',
    yField: ['balance'],
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    color: (datum: any) => {
      return datum.balance > 0 ? '#52c41a' : '#ff4d4f';
    },
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => {
          return `${v} kcal`;
        },
      },
      title: {
        text: 'Calorie Balance (kcal)',
      },
    },
    meta: {
      balance: {
        alias: 'Calorie Balance',
      },
    },
  };

  // Configuration for the weekly comparison pie chart
  const weeklyConfig = {
    data: weeklyData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    legend: {
      position: 'bottom',
    },
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    color: ['#1890ff', '#ff4d4f'],
    interactions: [{ type: 'element-active' }],
  };

  // Configuration for the nutrient comparison chart
  const nutrientConfig = {
    data: nutrientData,
    xField: 'type',
    yField: 'value',
    seriesField: 'category',
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    legend: {
      position: 'top',
    },
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => {
          return `${v}%`;
        },
      },
      title: {
        text: 'Percentage (%)',
      },
    },
    color: ['#1890ff', '#52c41a'],
  };

  return (
    <Card title="Calorie Intake vs. Burned Comparison" style={{ marginBottom: 24 }}>
      <Tabs defaultActiveKey="daily">
        <TabPane tab="Daily Comparison" key="daily">
          <div style={{ height: 400 }}>
            <DualAxes {...dailyConfig} />
          </div>
        </TabPane>
        <TabPane tab="Calorie Balance" key="balance">
          <div style={{ height: 400 }}>
            <Column {...balanceConfig} />
          </div>
        </TabPane>
        <TabPane tab="Weekly Summary" key="weekly">
          <div style={{ height: 400 }}>
            <Pie {...weeklyConfig} />
          </div>
        </TabPane>
        <TabPane tab="Nutrient Distribution" key="nutrients">
          <div style={{ height: 400 }}>
            <Column {...nutrientConfig} />
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default CalorieComparisonChart; 