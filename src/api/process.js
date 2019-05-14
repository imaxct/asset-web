import axios from '@/libs/api.request'

export const getProcess = (id) => {
  return axios.request({
    url: `Process/get?id=${id}`,
    method: 'get'
  })
}

export const addProcess = (data) => {
  return axios.request({
    url: 'Process/add',
    method: 'post',
    data
  })
}

export const listProcess = () => {
  return axios.request({
    url: 'Process/list',
    method: 'get'
  })
}

export const updateProcess = (data) => {
  return axios.request({
    url: 'Process/update',
    method: 'post',
    data
  })
}
