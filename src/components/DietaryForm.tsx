import React, { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, DatePicker, TimePicker, Card, message, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { createDietaryRecord, createFoodItem, DietaryRecord, FoodItem } from '../services/dietAPI';
import { useDiet } from '../context/DietContext';

const { Option } = Select;
const { TextArea } = Input;

interface DietaryFormProps {
  onSubmit?: (values: any) => void;
  loading?: boolean;
}

const foodCategories = [
  { value: 'fruits', label: 'Fruits' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'grains', label: 'Grains' },
  { value: 'protein', label: 'Protein Foods' },
  { value: 'dairy', label: 'Dairy' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'other', label: 'Other' }
];

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' }
];

const DietaryForm: React.FC<DietaryFormProps> = ({ onSubmit, loading = false }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { fetchDietaryRecords, fetchFoodItems, refreshAllData } = useDiet();

  const handleSubmit = async (values: any) => {
    console.log('DietaryForm handleSubmit called', values);
    setSubmitting(true);
    try {
      // 1. 组装 dietary record 数据
      const totalCalories = values.foodItems.reduce(
        (sum: number, item: any) => sum + (item.calories || 0),
        0
      );
      const recordDate = values.date.format('YYYY-MM-DD');
      const timeObj = values.time;
      // const recordTime = {
      //   hour: timeObj.hour(),
      //   minute: timeObj.minute(),
      //   second: timeObj.second ? timeObj.second() : 0,
      //   nano: 0
      // };
      const recordTime = timeObj.format('HH:mm');
      const userId = Number(localStorage.getItem('userId'));
      const dietaryRecordData = {
        userId,
        recordDate,
        recordTime,
        mealType: values.mealType,
        notes: values.notes || '',
        totalCalories
      };
      console.log('dietaryRecordData:', dietaryRecordData);
      // 2. 创建 dietary record
      const dietaryRecordRes = await createDietaryRecord(dietaryRecordData);
      console.log('dietaryRecordRes:', dietaryRecordRes);
      const dietaryRecordId = dietaryRecordRes.data.id;
      // 3. 循环创建 food items
      await Promise.all(
        (values.foodItems || []).map((item: any) =>
          createFoodItem({
            dietaryRecordId: Number(dietaryRecordId),
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            calories: item.calories
          })
        )
      );
      // 4. 自动刷新所有数据
      await refreshAllData();
      message.success('Dietary record saved successfully!');
      form.resetFields();
      if (onSubmit) onSubmit(values);
    } catch (err: any) {
      console.error('Save dietary record error:', err?.response || err);
      message.error('Failed to save dietary record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Add Dietary Record" bordered={false}>
      <Form 
        form={form}
        layout="vertical" 
        onFinish={handleSubmit}
        initialValues={{
          date: null,
          time: null,
          mealType: 'lunch',
          foodItems: [{ name: '', category: 'other', quantity: 1, unit: 'serving', calories: 0 }]
        }}
      >
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          name="time"
          label="Time"
          rules={[{ required: true, message: 'Please select a time' }]}
        >
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>
        
        <Form.Item
          name="mealType"
          label="Meal Type"
          rules={[{ required: true, message: 'Please select a meal type' }]}
        >
          <Select>
            {mealTypes.map(type => (
              <Option key={type.value} value={type.value}>{type.label}</Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.List name="foodItems">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card 
                  key={key} 
                  size="small" 
                  style={{ marginBottom: 16 }}
                  extra={
                    fields.length > 1 ? (
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    ) : null
                  }
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    label="Food Name"
                    rules={[{ required: true, message: 'Please enter food name' }]}
                  >
                    <Input placeholder="e.g., Apple, Chicken Breast" />
                  </Form.Item>
                  
                  <Form.Item
                    {...restField}
                    name={[name, 'category']}
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                  >
                    <Select>
                      {foodCategories.map(category => (
                        <Option key={category.value} value={category.value}>{category.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  
                  <Space style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      label="Quantity"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <InputNumber min={0.1} step={0.1} style={{ width: '100%' }} />
                    </Form.Item>
                    
                    <Form.Item
                      {...restField}
                      name={[name, 'unit']}
                      label="Unit"
                      rules={[{ required: true, message: 'Required' }]}
                    >
                      <Input placeholder="e.g., g, ml, serving" />
                    </Form.Item>
                  </Space>
                  
                  <Form.Item
                    {...restField}
                    name={[name, 'calories']}
                    label="Calories"
                    rules={[{ required: true, message: 'Please enter calories' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Card>
              ))}
              
              <Form.Item>
                <Button 
                  type="dashed" 
                  onClick={() => add({ name: '', category: 'other', quantity: 1, unit: 'serving', calories: 0 })} 
                  block 
                  icon={<PlusOutlined />}
                >
                  Add Food Item
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        
        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea rows={3} placeholder="Any additional notes about this meal" />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading || submitting} block>
            Save Dietary Record
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DietaryForm; 