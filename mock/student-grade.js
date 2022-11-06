const Mock = require('mockjs')

const data = Mock.mock({
    'grade|6': [{
        Subject: '@string(2,3)',
        ObjectiveScore: '@integer(0,150)',
        SubjectiveScore: '@integer(0,150)',
        Score: '@integer(0,100)',
        SubjectRank: '@integer(0,100)',
        Rank: '@integer(0,1000)',
        Time: '@datetime',
        ExamName: '@string(4)',
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
