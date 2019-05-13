<template>
  <Card>
    <tables
      editable
      v-model="list"
      :columns="columns"
      @on-save-edit="saveEdit"
      @on-delete="onDelete"
    ></tables>
    <Page
      :total="totalElements"
      show-total
      :page-size="size"
      :current="number + 1"
      @on-change="onChangeNo"
    ></Page>
    <Button
      type="primary"
      @click="showAddModal"
      style="margin-top: 10px;"
    >添加消息</Button>
  </Card>
</template>
<script>
import { listMsg, addMsg, deleteMsg, updateMsg } from '@/api/message'
import Tables from '_c/tables'
import config from '@/config'
export default {
  name: 'message',
  components: {
    Tables
  },
  data () {
    return {
      size: config.pageSize,
      totalPages: 0,
      totalElements: 0,
      number: 0,
      list: [],
      edit: {},
      columns: [
        { title: 'id', key: 'id', sortable: true },
        { title: '发布时间', key: 'gmtCreate' },
        { title: '标题', key: 'title', editable: true },
        { title: '内容', key: 'content', editable: true },
        {
          title: '删除',
          key: 'handle',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return (
                <Poptip title="确定删除吗?" transfer={true} confirm={true} on-on-ok={() => {
                  vm.$emit('on-delete', params)
                }} />
              )
            }
          ]
        }
      ]
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
    onDelete (params) {
      deleteMsg({ id: parseInt(params.row.id) }).then(res => {
        const { data } = res
        if (data.ok) {
          this.$Message.success('删除成功')
          return true
        } else {
          this.$Message.error(data.msg)
          return false
        }
      }).catch(err => {
        this.$Message.error(err)
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
    loadPage (pageNo, size) {
      listMsg({ pageNo, size }).then(res => {
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
      this.loadPage(this.number, this.size)
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
