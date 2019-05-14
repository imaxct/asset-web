import axios from '@/libs/api.request'

export const updateStep = ({ id, name, roleRequired, statusRequired }) => {
  return axios.request({
    url: 'Step/update',
    method: 'post',
    data: { id, name, roleRequired, statusRequired }
  })
}
