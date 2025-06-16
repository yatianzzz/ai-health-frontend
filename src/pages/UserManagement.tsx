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
    name: '张三',
    age: 32,
    gender: '男',
    phone: '13812345678',
    email: 'zhangsan@example.com',
    status: '活跃',
    registrationDate: '2023-05-10',
  },
  {
    key: '2',
    id: 'USR002',
    name: '李四',
    age: 42,
    gender: '男',
    phone: '13987654321',
    email: 'lisi@example.com',
    status: '活跃',
    registrationDate: '2023-06-15',
  },
  {
    key: '3',
    id: 'USR003',
    name: '王五',
    age: 28,
    gender: '女',
    phone: '13709876543',
    email: 'wangwu@example.com',
    status: '未激活',
    registrationDate: '2023-07-22',
  },
  {
    key: '4',
    id: 'USR004',
    name: '赵六',
    age: 35,
    gender: '男',
    phone: '13612345678',
    email: 'zhaoliu@example.com',
    status: '已禁用',
    registrationDate: '2023-08-05',
  },
  {
    key: '5',
    id: 'USR005',
    name: '钱七',
    age: 29,
    gender: '女',
    phone: '13512345678',
    email: 'qianqi@example.com',
    status: '活跃',
    registrationDate: '2023-09-12',
  },
];

const UserManagement: React.FC = () => {
  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        let color = 'green';
        if (text === '未激活') color = 'geekblue';
        if (text === '已禁用') color = 'volcano';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '注册日期',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DataType) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} size="small">编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} size="small">删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Search
            placeholder="请输入用户名、ID或手机号搜索"
            allowClear
            enterButton={<SearchOutlined />}
            style={{ width: 300 }}
            onSearch={(value) => console.log(value)}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            添加用户
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