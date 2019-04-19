import axios from '@/libs/api.request'

export const listRole = () => {
  return axios.request({
    url: 'Role/list',
    method: 'get'
  })
}

export const saveRole = (data) => {
  return axios.request({
    url: 'Role/save',
    data,
    method: 'post'
  })
}

export const deleteRole = ({ id }) => {
  return axios.request({
    url: 'Role/delete',
    data: { id },
    method: 'post'
  })
}
