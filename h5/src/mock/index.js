import Mock from 'mockjs';
import api from "../service/api";


// 设置全局延时
Mock.setup({
    timeout: '300-600'
})


Mock.mock(new RegExp(`.*${api.login}.*`), /.*/, () => {

    return {
        "code": 1,
        "errMsg": "登录成功",
        "data": {
            "nickname": "测试",
            "username": "10086",
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjE4NTA4MTI4NjY3IiwicGFzc3dvcmQiOiIzZDUyOGQxNGM4ODhlZjYzM2I0MDYyMTg5MzcyMWIzYiIsInJvbGUiOjIyfQ.QZHvc9PK5Xv_7aEQr2tMRM7de4cPKP-hF6W6DyIFntM",
            "index": "index",
            "used": "10086",
            "permissions": [
                "get_dash_chart",
                "get_dash_total",
                "person_list"
            ],
            "expireAt": 1741060779,
            "role": {
                "id": 12,
                "name": "组员"
            },
            "depart": {
                "name": "苹果部门",
                "id": 30
            }
        }
    };

});


Mock.mock(new RegExp(`.*${api.get_customers}.*`), () => {
    return {
        "code": 1,
        "errMsg": "ok",
        "data": {
            "total": 1452,
            "per_page": 20,
            "current_page": 1,
            "last_page": 73,
            "data": [
                {
                    "id": 482048,
                    "name": "中国移动",
                    "mobile": "10086",
                    "step": 2,
                    "company": "中国移动股份有限公司",
                    "dial": 1,
                    "next_dial": "2025-03-03 11:12:13",
                    "datetime": "2025-03-03 10:27:02"
                },
                {
                    "id": 2,
                    "name": "中国联通",
                    "mobile": "10086",
                    "step": 2,
                    "company": "中国联通股份有限公司",
                    "dial": 1,
                    "next_dial": "2025-03-03 11:12:13",
                    "datetime": "2025-03-03 10:27:02"
                },
                {
                    "id": 3,
                    "name": "中国电信",
                    "mobile": "10086",
                    "step": 2,
                    "company": "中国电信股份有限公司",
                    "dial": 1,
                    "next_dial": "2025-03-03 11:12:13",
                    "datetime": "2025-03-03 10:27:02"
                }
            ]
        }
    };
})


Mock.mock(new RegExp(`.*${api.load_labels}.*`), () => {
    return {
        "code": 1,
        "errMsg": "获取成功",
        "data": [
            {
                "value": 7,
                "label": "小升规"
            },
            {
                "value": 16,
                "label": "意向"
            },
            {
                "value": 18,
                "label": "同意"
            },
            {
                "value": 127,
                "label": "可上门"
            },
            {
                "value": 128,
                "label": "科技型企业"
            },
            {
                "value": 129,
                "label": "创新型企业"
            },
            {
                "value": 130,
                "label": "24年高新"
            },
            {
                "value": 131,
                "label": "24年科小"
            },
            {
                "value": 133,
                "label": "认证"
            }
        ]
    };
})


Mock.mock(new RegExp(`.*${api.load_label}.*`), () => {
    return {
        "code": 1,
        "errMsg": "获取成功",
        "data": [
            7,
            16,
            18
        ]
    };
})


Mock.mock(new RegExp(`.*${api.detail}.*`), () => {
    return {
        "code": 1,
        "errMsg": "获取成功",
        "data": {
            "id": 1,
            "name": "中国移动",
            "mobile": "10086",
            "invite": 90,
            "step": 2,
            "star": 2,
            "company": "中国移动股份有限公司",
            "industry": "",
            "tax": null,
            "old_Tax": null,
            "toTax": 0,
            "to_year": "",
            "sell_year": 0,
            "area": "",
            "bank": "",
            "password": null,
            "level": "",
            "accrual": null,
            "assets": null,
            "last_year": null,
            "factory_area": null,
            "factory_staff": null,
            "cycle": null,
            "in_money": null,
            "out_money": null,
            "much": null,
            "need": null,
            "advise": null,
            "point": null,
            "who": null,
            "finish": null,
            "create": "",
            "scale": "",
            "datetime": "2025-03-03 10:27:02",
            "remarks": "",
            "assign_time": "2025-03-03 10:30:01",
            "update": "2025-03-03 11:12:37",
            "is_del": null,
            "labels": [
                99,
                115,
                134
            ],
            "next_dial": "2025-03-03 11:12:13",
            "count_dial": 2,
            "duration_dial": "22"
        }
    };
})


Mock.mock(new RegExp(`.*${api.load_follow}.*`), () => {
    return {
        "code": 1,
        "errMsg": "获取成功",
        "data": [
            {
                "id": 2,
                "nickname": "小白",
                "info": "打电话，说他们不缺钱",
                "datetime": "2024-03-03"
            },
            {
                "id": 1,
                "nickname": "小白",
                "info": "分配给小白",
                "datetime": "2024-03-03"
            },
        ]
    };
});


Mock.mock(new RegExp(`.*${api.add_follow}.*`), () => {
    return {
        "code": 1,
        "errMsg": "添加成功",
        "data": []
    };
});

Mock.mock(new RegExp(`.*${api.del}.*`), () => {
    return {
        "code": 1,
        "errMsg": "删除成功",
        "data": []
    };
});


Mock.mock(new RegExp(`.*${api.modify}.*`), () => {
    return {
        "code": 1,
        "errMsg": "修改成功",
        "data": []
    };
});

Mock.mock(new RegExp(`.*${api.risk}.*`), () => {
    return {
        "code": 1,
        "errMsg": "修改成功",
        "data": false
    };
});

Mock.mock(new RegExp(`.*${api.set_used}.*`), () => {
    return {
        "code": 1,
        "errMsg": "修改成功",
        "data": false
    };
});


Mock.mock(new RegExp(`.*${api.modify_label}.*`), () => {
    return {
        "code": 1,
        "errMsg": "修改成功",
        "data": []
    };
});


Mock.mock(new RegExp(`.*${api.chart}.*`), () => {
    return {
        "code": 1,
        "errMsg": "ok",
        "data": {
            "week": 0,
            "half": 0,
            "month": 2,
            "count": 1573,
            "dial_count": 48,
            "dial_duration": "576"
        }
    }
});


Mock.mock(new RegExp(`.*${api.dial_list}.*`), () => {
    return {
        "code": 1,
        "errMsg": "查询成功",
        "data": {
            "total": 12715,
            "per_page": 20,
            "current_page": 1,
            "last_page": 636,
            "data": [
                {
                    "id": 494343,
                    "nickname": "大牛",
                    "name": "中国移动",
                    "mobile": "10086",
                    "duration": 0,
                    "status": "呼出",
                    "type": 2,
                    "place": "中国移动 北京",
                    "company": "中国移动股份有限公司",
                    "dial": 1,
                    "src": null,
                    "callTime": "2025-03-03 11:59:28",
                    "datetime": "2025-03-03 11:59:48"
                },
                {
                    "id": 494343,
                    "nickname": "大牛",
                    "name": "中国移动",
                    "mobile": "10086",
                    "duration": 17,
                    "status": "呼出",
                    "type": 1,
                    "place": "中国移动 北京",
                    "company": "中国移动股份有限公司",
                    "dial": 1,
                    "src": null,
                    "callTime": "2025-03-03 11:59:28",
                    "datetime": "2025-03-03 11:59:48"
                },
                {
                    "id": 494343,
                    "nickname": "大牛",
                    "name": "中国移动",
                    "mobile": "10086",
                    "duration": 17,
                    "status": "呼出",
                    "type": 2,
                    "place": "中国移动 北京",
                    "company": "中国移动股份有限公司",
                    "dial": 1,
                    "src": null,
                    "callTime": "2025-03-03 11:59:28",
                    "datetime": "2025-03-03 11:59:48"
                }
            ]
        }
    };
});

