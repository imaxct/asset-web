<template>
  <Card>
    <tables
      editable
      :columns="columns"
      v-model="list"
      @on-save-edit="saveEdit"
    ></tables>
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
    >添加用户</Button>
  </Card>
</template>
<script>
import { listUser, saveUser, newUser } from '@/api/user'
import { listDep } from '@/api/dep'
import { listRole } from '@/api/role'
import Tables from '_c/tables'
import config from '@/config'
export default {
  components: {
    Tables
  },
  data () {
    return {
      list: [],
      size: config.pageSize,
      edit: {
        username: '',
        name: '',
        password: '',
        depId: 0,
        roleId: 0
      },
      totalPages: 0,
      totalElements: 0,
      number: 0,
      depList: [],
      depMap: {},
      roleList: [],
      roleMap: {},
      columns: [
        { title: 'id', key: 'id', sortable: true },
        { title: '用户名', key: 'username' },
        { title: '姓名', key: 'name', editable: true },
        {
          title: '部门',
          key: 'depId',
          render: (h, params, vm) => {
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
          title: '角色',
          key: 'roleId',
          render: (h, params, vm) => {
            return (
              <Select
                transfer={true}
                v-model={this.list[params.index].roleId}
                on-on-change={e => this.onChange({ id: this.list[params.index].id, roleId: this.list[params.index].roleId })}>
                {this.roleList.map(it => {
                  return (
                    <Option value={it.id} key={it.id}>{it.name}</Option>
                  )
                })}
              </Select>
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
          return (
            <Form v-model={this.edit}>
              <FormItem label="用户名">
                <Input v-model={this.edit.username} placeholder="请输入用户名"></Input>
              </FormItem>
              <FormItem label="姓名">
                <Input v-model={this.edit.name} placeholder="请输入姓名"></Input>
              </FormItem>
              <FormItem label="密码">
                <Input v-model={this.edit.password} placeholder="请输入密码"></Input>
              </FormItem>

              <FormItem label="角色">
                <Select
                  transfer={true}
                  v-model={this.edit.roleId}
                >
                  {this.roleList.map(it => {
                    return (
                      <Option value={it.id} key={it.id}>{it.name}</Option>
                    )
                  })}
                </Select>
              </FormItem>

              <FormItem label="部门">
                <Select
                  transfer={true}
                  v-model={this.edit.depId}
                >
                  {this.depList.map(it => {
                    return (
                      <Option value={it.id} key={it.id}>{it.label}</Option>
                    )
                  })}
                </Select>
              </FormItem>
            </Form>
          )
        },
        onOk: () => {
          newUser(this.edit).then(res => {
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
    saveEdit ({ row, index, column, value }) {
      const { key } = column
      const data = {
        id: parseInt(row.id),
        [key]: value
      }
      this.onChange(data)
    },
    onChange (data) {
      saveUser(data).then(res => {
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
    onChangeNo (number) {
      this.number = number - 1
      this.loadPage(this.number, this.size)
    },
    loadPage (pageNo, size) {
      listUser({ pageNo, size }).then(res => {
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
        listRole().then(res => {
          if (res.data.ok) {
            this.roleList = res.data.obj
          }
          this.loadPage(this.number, this.size)
        })
      }).catch(err => {
        this.$Message.error(err)
      })
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>
