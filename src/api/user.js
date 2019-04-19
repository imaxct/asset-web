import axios from '@/libs/api.request'

export const login = ({ username, password }) => {
  return axios.request({
    url: 'User/login',
    data: { username, password },
    method: 'post'
  })
}

export const listUser = ({ pageNo, size }) => {
  return axios.request({
    url: 'User/list',
    data: { pageNo, size },
    method: 'post'
  })
}

export const saveUser = ({ id, name, depId, roleId }) => {
  console.log({ id, name, depId, roleId })
  return axios.request({
    url: 'User/save',
    data: { id, name, depId, roleId },
    method: 'post'
  })
}

export const newUser = ({ name, depId, roleId, password, username }) => {
  return axios.request({
    url: 'User/new',
    data: { name, depId, roleId, password, username },
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: 'get_info',
    params: {
      token
    },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
  })
}
