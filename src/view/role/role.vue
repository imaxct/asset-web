<template>
  <Card>
    <tables
      editable
      searchable
      search-place="top"
      v-model="list"
      :columns="columns"
      @on-save-edit="saveEdit"
      @on-delete="onDelete"
    ></tables>
    <Button
      type="primary"
      @click="showAddModal"
      style="margin-top: 10px;"
    >添加角色</Button>
  </Card>
</template>
<script>
import { listRole, saveRole, deleteRole } from '@/api/role'
import Tables from '_c/tables'
export default {
  name: 'role',
  components: {
    Tables
  },
  data () {
    return {
      list: [],
      edit: {},
      columns: [
        { title: 'id', key: 'id', sortable: true },
        { title: '角色标识', key: 'roleName', editable: true },
        { title: '角色名', key: 'name', editable: true },
        { title: '允许访问的uri', key: 'authorizedMapping', editable: true },
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
        name: row.name,
        roleName: row.roleName,
        authorizedMapping: row.authorizedMapping
      }
      saveRole({ ...data, [key]: value }).then(res => {
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
      deleteRole({ id: parseInt(params.row.id) }).then(res => {
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
              <FormItem label="角色名">
                <Input v-model={this.edit.name} placeholder="请输入角色名"></Input>
              </FormItem>
              <FormItem label="角色标识">
                <Input v-model={this.edit.roleName} placeholder="请输入角色标识"></Input>
              </FormItem>
              <FormItem label="允许访问uri">
                <Input v-model={this.edit.authorizedMapping} placeholder="请输入uri,英文逗号分隔"></Input>
              </FormItem>
            </Form>
          )
        },
        onOk: () => {
          saveRole({
            name: this.edit.name,
            roleName: this.edit.roleName,
            authorizedMapping: this.edit.authorizedMapping
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
    loadData () {
      listRole().then(res => {
        const { data } = res
        if (data.ok) {
          data.obj.map(it => {
            this.list.push({ ...it, id: '' + it.id })
          })
        } else {
          this.$Message.error(data.msg)
        }
      })
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
