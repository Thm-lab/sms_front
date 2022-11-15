const Mock = require('mockjs')

const data = Mock.mock({
    'grade|30': [{
        'Subject|1': ['语文', '数学', '英语', '物理', '化学', '生物'],
        ObjectiveScore: '@integer(0,150)',
        SubjectiveScore: '@integer(0,150)',
        Score: '@integer(0,100)',
        SubjectRank: '@integer(0,100)',
        Rank: '@integer(0,1000)',
        Time: '@datetime(yyyy-MM-dd)',
        'ExamName|1': ['第一次月考', '第二次月考', '期中考试', '期末考试', '全市统考', '全省统考'],
        // 0: had not submit; 1: checking; 2: accepted; 3: rejected
        "Status|0-3": 100
    }]
})

module.exports = [
    {
        url: '/vue-admin-template/student/grade',
        type: 'get',
        response: config => {
            const grade = data.grade
            return {
                code: 20000,
                data: {
                    total: grade.length,
                    grade: grade
                }
            }
        }
    }
]
