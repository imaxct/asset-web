import axios from '@/libs/api.request'

export const listMsg = ({ pageNo, size }) => {
  return axios.request({
    url: 'Msg/listPage',
    method: 'post',
    data: { pageNo, size }
  })
}

export const addMsg = ({ title, content }) => {
  return axios.request({
    url: 'Msg/add',
    data: { title, content },
    method: 'post'
  })
}

export const updateMsg = (data) => {
  return axios.request({
    url: 'Msg/update',
    data,
    method: 'post'
  })
}

export const deleteMsg = ({ id }) => {
  return axios.request({
    url: 'Msg/del',
    method: 'post',
    data: { id }
  })
}
