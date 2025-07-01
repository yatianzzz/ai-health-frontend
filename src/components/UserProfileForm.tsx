import React, { useState } from 'react';
import { Form, Input, Button, Select, InputNumber, Modal, Radio, Space, message } from 'antd';

const { Option } = Select;

interface UserProfileFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: UserProfileData) => void;
}

export interface UserProfileData {
  userId?: number;
  firstName: string;
  lastName: string;
  age: number;
  occupation: string;
  gender: string;
  favoriteSport: string;
  customSport?: string;
}

const sportOptions = [
  'Running',
  'Swimming',
  'Cycling',
  'Basketball',
  'Football',
  'Tennis',
  'Yoga',
  'Weightlifting',
  'Dancing',
  'Hiking',
  'Other'
];

const UserProfileForm: React.FC<UserProfileFormProps> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      // This will throw an error if validation fails
      const values = await form.validateFields();
      
      // If "Other" is selected, use the custom sport value
      if (values.favoriteSport === 'Other' && values.customSport) {
        values.favoriteSport = values.customSport;
      } else if (values.favoriteSport === 'Other' && !values.customSport) {
        message.error('Please specify your favorite sport');
        setSubmitLoading(false);
        return;
      }
      
      // Remove the customSport field before submitting
      const { customSport, ...finalValues } = values;
      
      onSubmit(finalValues);
      form.resetFields();
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Please fill in all required fields');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const handleSportChange = (value: string) => {
    setSelectedSport(value);
  };

  return (
    <Modal
      title="Complete Your Profile"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Space key="footer-buttons">
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleSubmit} 
            loading={submitLoading}
          >
            Submit
          </Button>
        </Space>
      ]}
      width={600}
      maskClosable={false}
      closable={true}
    >
      <p>Please provide your personal information to complete your profile setup.</p>
      
      <Form
        form={form}
        layout="vertical"
        name="userProfileForm"
        validateMessages={{
          required: '${label} is required!',
          types: {
            number: '${label} must be a valid number!'
          },
          number: {
            min: '${label} must be at least ${min}',
            max: '${label} cannot exceed ${max}'
          }
        }}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter your first name' }]}
          tooltip="Your first name is required"
        >
          <Input placeholder="Enter your first name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter your last name' }]}
          tooltip="Your last name is required"
        >
          <Input placeholder="Enter your last name" />
        </Form.Item>

        <Form.Item
          name="age"
          label="Age"
          rules={[
            { required: true, message: 'Please enter your age' },
            { type: 'number', min: 1, max: 120, message: 'Age must be between 1 and 120' }
          ]}
          tooltip="Your age is required and must be between 1 and 120"
        >
          <InputNumber min={1} max={120} style={{ width: '100%' }} placeholder="Enter your age" />
        </Form.Item>

        <Form.Item
          name="occupation"
          label="Occupation"
          rules={[{ required: true, message: 'Please enter your occupation' }]}
          tooltip="Your occupation is required"
        >
          <Input placeholder="Enter your occupation" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select your gender' }]}
          tooltip="Your gender is required"
        >
          <Radio.Group>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="other">Other</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="favoriteSport"
          label="Favorite Sport"
          rules={[{ required: true, message: 'Please select your favorite sport' }]}
          tooltip="Your favorite sport is required"
        >
          <Select 
            onChange={handleSportChange} 
            placeholder="Select your favorite sport"
          >
            {sportOptions.map(sport => (
              <Option key={sport} value={sport}>{sport}</Option>
            ))}
          </Select>
        </Form.Item>

        {selectedSport === 'Other' && (
          <Form.Item
            name="customSport"
            label="Specify Your Sport"
            rules={[{ required: true, message: 'Please specify your favorite sport' }]}
            tooltip="Since you selected 'Other', please specify your favorite sport"
          >
            <Input placeholder="Enter your favorite sport" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default UserProfileForm; 