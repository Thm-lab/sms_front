import request from '@/utils/request'

export function getGrade(params) {
    return request({
        url: '/vue-admin-template/student/grade',
        method: 'get',
        params
    })
}
