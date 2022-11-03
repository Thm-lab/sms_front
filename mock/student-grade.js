const Mock = require('mockjs')

const data = Mock.mock({
    'grade|6': [{
        Class: '@integer(1,15)',
        Name: '@string( 2, 4)',
        Subject: '@integer(0,150)',
        ObjectiveScore: '@integer(0,150)',
        SubjectiveScore: '@integer(0,150)',
        Score: '@integer(0,100)',
        SubjectRank: '@integer(0,100)',
        Rank: '@integer(0,1000)',
        Time: '@datetime',
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
