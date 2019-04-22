import axios from '@/libs/api.request'

export const listAsset = ({ pageNo, size }) => {
  return axios.request({
    url: 'Prop/list',
    data: { pageNo, size },
    method: 'post'
  })
}

export const addAsset = (assetList) => {
  return axios.request({
    url: 'Prop/add',
    data: assetList,
    method: 'post'
  })
}

export const updateAsset = ({ id, name, depId }) => {
  return axios.request({
    url: 'Prop/save',
    data: { id, name, depId },
    method: 'post'
  })
}
