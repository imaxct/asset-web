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
    <Button
      style="margin-top: 10px;"
      type="primary"
      @click="showAddModal"
    >添加资产</Button>
  </div>
</template>
<script>
import { listAsset, updateAsset, addAsset } from '@/api/asset'
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
      edit: [{ name: '', depId: 0, num: 1 }],
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
          title: '当前流程',
          key: 'curProcess'
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
          title: '当前使用人',
          key: 'occupyUserName'
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
    showAddModal () {
      this.$Modal.confirm({
        render: (h) => {
          const addItem = (length) => {
            const result = []
            for (let i = 0; i < length; i++) {
              result.push(
                <FormItem>
                  <Row>
                    <Col span={7}><Input placeholder="资产名" v-model={this.edit[i].name}></Input></Col>
                    <Col span={7}>
                      <Select placeholder="部门" v-model={this.edit[i].depId}>
                        {this.depList.map(it => {
                          return (
                            <Option value={it.id} key={it.id}>{it.label}</Option>
                          )
                        })}
                      </Select>
                    </Col>
                    <Col span={7}><InputNumber min={1} v-model={this.edit[i].num}></InputNumber></Col>
                    <Col span={3}><Button onClick={() => { this.edit.splice(i, 1) }}>删除</Button></Col>
                  </Row>
                </FormItem>
              )
            }
            return result
          }
          return (
            <div>
              <Form>
                {addItem(this.edit.length)}
                <FormItem><Button icon="md-add" onClick={() => this.edit.push({ name: '', depId: 0, num: 1 })}>添加资产</Button></FormItem>
              </Form>
            </div>
          )
        },
        onOk: () => {
          const assetList = []
          for (let idx in this.edit) {
            const it = this.edit[idx]
            for (let num = 1; num <= it.num; num++) {
              assetList.push({ name: it.name, depId: it.depId })
            }
          }
          addAsset(assetList).then(res => {
            const { data } = res
            if (data.ok) {
              this.$Message.success('添加成功')
              this.loadPage(this.number, this.size)
            } else {
              this.$Message.error(data.msg)
            }
          }).catch(err => {
            this.$Message.error(err)
          })
        },
        onCancel: () => {
          this.edit = [{ name: '', depId: 0, num: 1 }]
        }
      })
    },
    onAddAsset () {

    },
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
