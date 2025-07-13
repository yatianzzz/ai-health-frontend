const axios = require('axios');

// 测试用户活动记录API
async function testUserActivitiesAPI() {
    try {
        // 先登录获取token
        console.log('1. 尝试登录...');
        const loginResponse = await axios.post('http://localhost:8080/auth/login', {
            username: 'testuser',  // 假设有这个测试用户
            password: 'password123'
        });
        
        if (loginResponse.data.code === 200) {
            const token = loginResponse.data.data.token;
            console.log('登录成功，获得token:', token.substring(0, 20) + '...');
            
            // 获取用户活动记录
            console.log('2. 获取用户活动记录...');
            const activitiesResponse = await axios.get('http://localhost:8080/api/user-activities', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('API响应状态码:', activitiesResponse.status);
            console.log('API响应数据:', JSON.stringify(activitiesResponse.data, null, 2));
            
            if (activitiesResponse.data.code === 200) {
                const activities = activitiesResponse.data.data;
                console.log(`用户活动记录数量: ${activities.length}`);
                console.log('记录详情:', activities);
            } else {
                console.error('API调用失败:', activitiesResponse.data.message);
            }
        } else {
            console.error('登录失败:', loginResponse.data.message);
        }
    } catch (error) {
        console.error('测试过程中出错:', error.message);
        if (error.response) {
            console.error('错误响应:', error.response.data);
        }
    }
}

// 也测试一下创建活动记录
async function createTestActivity() {
    try {
        // 先登录
        const loginResponse = await axios.post('http://localhost:8080/auth/login', {
            username: 'testuser',
            password: 'password123'
        });
        
        if (loginResponse.data.code === 200) {
            const token = loginResponse.data.data.token;
            console.log('3. 创建测试活动记录...');
            
            const createResponse = await axios.post('http://localhost:8080/api/user-activities', {
                height: 1.75,
                weight: 70.0,
                bmi: 22.9,
                activityDate: new Date().toISOString().split('T')[0], // 今天的日期
                duration: 30,
                exerciseType: '跑步',
                steps: 5000,
                calories: 300,
                maxHeartRate: 150,
                minHeartRate: 120
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('创建活动记录响应:', createResponse.data);
        }
    } catch (error) {
        console.error('创建活动记录出错:', error.message);
        if (error.response) {
            console.error('错误响应:', error.response.data);
        }
    }
}

// 运行测试
console.log('开始测试用户活动记录API...');
testUserActivitiesAPI().then(() => {
    console.log('\n尝试创建测试数据...');
    return createTestActivity();
}).then(() => {
    console.log('\n重新获取活动记录...');
    return testUserActivitiesAPI();
}).catch(console.error); 