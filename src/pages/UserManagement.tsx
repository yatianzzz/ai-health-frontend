import React from 'react';
import { Table, Button, Space, Tag, Input, Card } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DashboardLayout from '../layouts/DashboardLayout';

const { Search } = Input;

interface DataType {
  key: string;
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  status: string;
  registrationDate: string;
}

const mockData: DataType[] = [
  {
    key: '1',
    id: 'USR001',
    name: 'John Smith',
    age: 32,
    gender: 'Male',
    phone: '13812345678',
    email: 'john.smith@example.com',
    status: 'Active',
    registrationDate: '2023-05-10',
  },
  {
    key: '2',
    id: 'USR002',
    name: 'Jane Doe',
    age: 42,
    gender: 'Female',
    phone: '13987654321',
    email: 'jane.doe@example.com',
    status: 'Active',
    registrationDate: '2023-06-15',
  },
  {
    key: '3',
    id: 'USR003',
    name: 'Bob Johnson',
    age: 28,
    gender: 'Male',
    phone: '13709876543',
    email: 'bob.johnson@example.com',
    status: 'Inactive',
    registrationDate: '2023-07-22',
  },
  {
    key: '4',
    id: 'USR004',
    name: 'Alice Wilson',
    age: 35,
    gender: 'Female',
    phone: '13612345678',
    email: 'alice.wilson@example.com',
    status: 'Disabled',
    registrationDate: '2023-08-05',
  },
  {
    key: '5',
    id: 'USR005',
    name: 'Charlie Brown',
    age: 29,
    gender: 'Male',
    phone: '13512345678',
    email: 'charlie.brown@example.com',
    status: 'Active',
    registrationDate: '2023-09-12',
  },
];

const UserManagement: React.FC = () => {
  const columns = [
    {
      title: 'User ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        let color = 'green';
        if (text === 'Inactive') color = 'geekblue';
        if (text === 'Disabled') color = 'volcano';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Registration Date',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: DataType) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} size="small">Edit</Button>
          <Button type="text" danger icon={<DeleteOutlined />} size="small">Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Search
            placeholder="Search by username, ID or phone number"
            allowClear
            enterButton={<SearchOutlined />}
            style={{ width: 300 }}
            onSearch={(value) => console.log(value)}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            Add User
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={mockData}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

const UserManagementWithLayout: React.FC = () => {
  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  );
};

export default UserManagementWithLayout; 