<template>
  <Card>
    <tables
      v-model="list"
      :columns="columns"
      @on-delete="onDelete"
    ></tables>
    <Button
      type="primary"
      @click="showAddModal"
      style="margin-top: 10px;"
    >添加流程</Button>
    <Modal
      fullscreen
      v-model="show"
    >
      <process-item
        :roles="roles"
        @add="onAddProcess"
      ></process-item>
    </Modal>
    <Modal
      v-model="displayEditModal"
      @on-ok="onSaveProcess"
    >
      <Form :model="edit">
        <FormItem label="流程名称">
          <Input v-model="edit.name" />
        </FormItem>
        <FormItem label="权限要求">
          <CheckboxGroup v-model="edit.roleList">
            <Checkbox
              v-for="(it, idx) in roles"
              :key="idx"
              :label="it.roleName"
            ><span>{{it.name}}</span></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="资产状态要求">
          <Select
            multiple
            v-model="edit.statusList"
            placeholder="资产状态要求"
          >
            <Option
              v-for="(v,k) in PropertyStatus"
              :key="k"
              :value="k"
            >{{v}}</Option>
          </Select>
        </FormItem>
        <FormItem label="资产终态">
          <Select
            clearable
            v-model="edit.finalStatus"
            placeholder="资产终态"
          >
            <Option
              v-for="(v,k) in PropertyStatus"
              :key="k"
              :value="k"
            >{{v}}</Option>
          </Select>
        </FormItem>
        <FormItem label="流转人">
          <RadioGroup v-model="edit.transferType">
            <Radio :label="null"><span>无</span></Radio>
            <Radio label="APPLY_USER"><span>流程发起人</span></Radio>
            <Radio label="STEP_HANDLER"><span>步骤处理人</span></Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>
<script>
import Tables from '_c/tables'
import { listProcess, addProcess, updateProcess } from '@/api/process'
import { listRole } from '@/api/role'
import ProcessItem from './process-item.vue'
import { PropertyStatus } from '@/libs/util'
import ProcessStepExpand from './process-step-expand.vue'
// import { PropertyStatus } from '@/libs/util'
export default {
  name: 'process',
  components: {
    Tables,
    ProcessItem
  },
  data () {
    return {
      PropertyStatus,
      show: false,
      displayEditModal: false,
      roles: [],
      list: [],
      edit: {},
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return (
              <ProcessStepExpand row={params.row} on-updated={(obj) => { this.loadData() }}></ProcessStepExpand>
            )
          }
        },
        {
          title: 'id',
          render: (h, params) => {
            return (<span>{params.row.process.id}</span>)
          }
        },
        {
          title: '创建时间',
          render: (h, params) => {
            return (<span>{params.row.process.gmtCreate}</span>)
          }
        },
        {
          title: '流程名',
          render: (h, params) => {
            return (<span>{params.row.process.name}</span>)
          }
        },
        {
          title: '资产初始状态',
          render: (h, params) => {
            return (<span>{params.row.process.statusRequired}</span>)
          }
        },
        {
          title: '资产最终状态',
          render: (h, params) => {
            return (<span>{params.row.process.finalStatus ? params.row.process.finalStatus : '原状态'}</span>)
          }
        },
        {
          title: '操作',
          render: (h, params) => {
            return (<span style="color: blue;" onClick={() => this.onEditProcess(params.row)}>修改</span>)
          }
        }
      ]
    }
  },
  methods: {
    onSaveProcess () {
      const data = { ...this.edit }
      data.statusRequired = data.statusList.join(',')
      data.roleRequired = data.roleList.join(',')
      updateProcess(data).then(res => {
        const { data } = res
        if (data.ok) {
          this.$Message.success('修改成功')
          this.loadData()
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(err => {
        this.$Message.error(err)
      })
    },
    onEditProcess (row) {
      this.edit = row.process
      const { statusRequired, roleRequired } = this.edit
      this.edit = { ...this.edit, statusList: statusRequired.split(',') }
      this.edit = { ...this.edit, roleList: roleRequired.split(',') }
      this.displayEditModal = true
    },
    onAddProcess (data) {
      addProcess(data).then(res => {
        const { data } = res
        if (data.ok) {
          this.$Message.success('添加成功')
          this.show = false
          this.loadData()
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
      this.show = true
    },
    loadData () {
      listRole().then(res => {
        const { data } = res
        if (data.ok) {
          this.roles = data.obj
        }
        listProcess().then(res => {
          const { data } = res
          if (data.ok) {
            this.list = data.obj
          } else {
            this.$Message.error(data.msg)
          }
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
