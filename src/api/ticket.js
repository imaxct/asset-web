import axios from '@/libs/api.request'

export const getByProcess = ({ id, pageNo, size }) => {
  return axios.request({
    url: 'Ticket/listType',
    method: 'post',
    data: { data: id, pageNo, size }
  })
}

export const getTicketDetail = (id) => {
  return axios.request({
    url: `Ticket/get?id=${id}`,
    method: 'get'
  })
}
