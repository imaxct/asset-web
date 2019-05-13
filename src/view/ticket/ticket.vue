<template>
  <Card>
    <tables
      v-model="list"
      :columns="columns"
    ></tables>
    <Page
      :total="totalElements"
      show-total
      :page-size="size"
      :current="number + 1"
      @on-change="onChangeNo"
    ></Page>
  </Card>
</template>
<script>
import { getByProcess } from '@/api/ticket'
import ExpandRow from './expand-row.vue'
import Tables from '_c/tables'
import config from '@/config'
import QrcodeVue from 'qrcode.vue'
import { TicketStatus } from '@/libs/util'
export default {
  name: 'ticket',
  components: {
    Tables,
    QrcodeVue
  },
  data () {
    return {
      id: this.$route.params.id,
      size: config.pageSize,
      totalPages: 0,
      totalElements: 0,
      number: 0,
      list: [],
      edit: {},
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return (
              <ExpandRow row={params.row}></ExpandRow>
            )
          }
        },
        {
          title: 'id',
          align: 'center',
          width: 50,
          minWidth: 10,
          render: (h, params) => {
            return (
              <span>{params.row.ticket.id}</span>
            )
          }
        },
        {
          title: '创建时间',
          render: (h, params) => {
            return (
              <span>{params.row.ticket.gmtCreate}</span>
            )
          }
        },
        { title: '资产名', key: 'propertyName', align: 'center' },
        {
          title: '工单状态',
          render: (h, params) => {
            return (
              <span>{TicketStatus[params.row.ticket.curStatus]}</span>
            )
          }
        },
        { title: '申请人', key: 'applyUserName', align: 'center' },
        {
          title: '二维码',
          align: 'center',
          key: 'propertyId',
          render: (h, params) => {
            return (
              <span onClick={() => this.showQrCode(params.row.propertyId)}>查看</span>
            )
          }
        }
      ]
    }
  },
  watch: {
    '$route.params': function (val, oldVale) {
      this.id = val.id
      this.loadData()
    }
  },
  methods: {
    saveEdit ({ row, index, column, value }) {
      const { key } = column
      const data = {
        id: parseInt(row.id),
        content: row.content,
        title: row.title
      }
      updateMsg({ ...data, [key]: value }).then(res => {
        const { data } = res
        if (data.ok) {
          this.$Message.success('保存成功')
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(err => {
        this.$Message.error(err)
      })
    },
    showQrCode (value) {
      this.$Modal.info({
        render: (h) => {
          return (
            <div style="text-align: center; margin: 20px auto;">
              <QrcodeVue value={value} size={300}></QrcodeVue>
            </div>
          )
        }
      })
    },
    showAddModal () {
      this.$Modal.confirm({
        render: (h) => {
          return (
            <Form v-model={this.edit}>
              <FormItem label="通知标题">
                <Input v-model={this.edit.title} placeholder="请输入通知标题"></Input>
              </FormItem>
              <FormItem label="通知内容">
                <Input v-model={this.edit.content} type="textarea" rows={4} placeholder="请输入通知内容"></Input>
              </FormItem>
            </Form>
          )
        },
        onOk: () => {
          addMsg({
            title: this.edit.title,
            content: this.edit.content
          }).then(res => {
            const { data } = res
            if (data.ok) {
              this.$Message.success('添加成功')
              this.loadData()
            } else {
              this.$Message.error(data.msg)
            }
          })
        },
        onCancel: () => {
          this.edit = {}
        }
      })
    },
    onChangeNo (number) {
      this.number = number - 1
      this.loadPage(this.number, this.size)
    },
    loadPage (id, pageNo, size) {
      getByProcess({ id, pageNo, size }).then(res => {
        const { data } = res
        if (data.ok) {
          const { content, totalPages, totalElements, size, number } = data.obj
          this.list = content
          this.size = size
          this.totalPages = totalPages
          this.totalElements = totalElements
          this.number = number
        } else {
          this.$Message.error(data.msg)
        }
      })
    },
    loadData () {
      this.loadPage(this.id, this.number, this.size)
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
