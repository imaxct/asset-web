import axios from '@/libs/api.request'

export const listDep = () => {
  return axios.request({
    url: 'Dep/list',
    methos: 'get'
  })
}

export const addDep = ({ name, parentDep }) => {
  return axios.request({
    url: 'Dep/add',
    data: { name, parentDep },
    method: 'post'
  })
}

export const updateDep = ({ id, name, parentDep }) => {
  return axios.request({
    url: 'Dep/update',
    data: { id, name, parentDep },
    method: 'post'
  })
}

export const deleteDep = ({ id }) => {
  return axios.request({
    url: 'Dep/del',
    data: { id },
    method: 'post'
  })
}
