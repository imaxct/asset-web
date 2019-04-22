<template>
  <div>
    <tables
      editable
      :columns="columns"
      v-model="list"
      @on-save-edit="saveEdit"
    >
    </tables>
    <Page
      :total="totalElements"
      show-total
      :page-size="size"
      :current="number + 1"
      @on-change="onChangeNo"
    ></Page>
  </div>
</template>
<script>
import { listAsset, updateAsset } from '@/api/asset'
import { listDep } from '@/api/dep'
import { PropertyStatus } from '@/libs/util'
import Tables from '_c/tables'
import config from '@/config'
import QrcodeVue from 'qrcode.vue'
export default {
  components: {
    Tables,
    QrcodeVue
  },
  data () {
    return {
      list: [],
      size: config.pageSize,
      totalPages: 0,
      totalElements: 0,
      number: 0,
      depList: [],
      columns: [
        { title: 'id', key: 'id', sortable: true },
        { title: '资产名称', key: 'name', editable: true },
        {
          title: '当前状态',
          key: 'curStatus',
          render: (h, params) => {
            return (
              <Tag>{PropertyStatus[params.row.curStatus]}</Tag>
            )
          }
        },
        {
          title: '部门',
          key: 'depId',
          render: (h, params) => {
            return (
              <Select
                transfer={true}
                v-model={this.list[params.index].depId}
                on-on-change={e => this.onChange({ id: this.list[params.index].id, depId: this.list[params.index].depId })}>
                {this.depList.map(it => {
                  return (
                    <Option value={it.id} key={it.id}>{it.label}</Option>
                  )
                })}
              </Select>
            )
          }
        },
        {
          title: '二维码',
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
  methods: {
    onChange ({ id, name, depId }) {
      updateAsset({ id, name, depId }).then(res => {
        const { data } = res
        if (data.ok) {
          this.$Message.success('修改成功')
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
    saveEdit ({ row, index, column, value }) {
      const { key } = column
      this.onChange({
        id: parseInt(row.id),
        [key]: value
      })
    },
    onChangeNo (number) {
      this.number = number - 1
      this.loadPage(this.number, this.size)
    },
    loadPage (pageNo, size) {
      listAsset({ pageNo, size }).then(res => {
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
      listDep().then(res => {
        if (res.data.ok) {
          this.depList = res.data.obj.list
        }
        this.loadPage(this.number, this.size)
      })
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
