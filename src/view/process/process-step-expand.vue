<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <Row
      class="expand-row"
      v-for="(it, idx) in row.steps"
      :key="idx"
    >
      <Col span="2">
      <span>步骤{{idx+1}}：</span>{{it.name}}
      </Col>
      <Col span="4">
      <span>创建时间：</span>{{it.gmtCreate}}
      </Col>
      <Col span="4">
      <span>修改时间：</span>{{it.gmtModified}}
      </Col>
      <Col span="7">
      <span>权限要求：</span>{{it.roleRequired}}
      </Col>
      <Col span="5">
      <span>资产状态要求：</span>{{it.statusRequired ? it.statusRequired : '无'}}
      </Col>
      <Col span="1">
      <span
        style="color: blue;"
        class="expand-key"
        @click="showEditModal(it)"
      >点击修改</span>
      </Col>
    </Row>
    <Modal
      v-model="show"
      @on-ok="onUpdateStep"
    >
      <Form :model="edit">
        <FormItem label="步骤名">
          <Input v-model="edit.name" />
        </FormItem>
        <FormItem label="审批权限">
          <Input v-model="edit.roleRequired" />
        </FormItem>
        <FormItem label="资产状态">
          <Input v-model="edit.statusRequired" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { updateStep } from '@/api/step'
export default {
  props: {
    row: Object
  },
  data () {
    return {
      edit: {},
      show: false
    }
  },
  methods: {
    showEditModal (item) {
      this.edit = item
      this.show = true
    },
    onUpdateStep () {
      updateStep({ ...this.edit }).then(res => {
        const { data } = res
        if (data.ok) {
          this.$Message.success('更新成功')
          this.$emit('updated', data.obj)
        } else {
          this.$Message.error(data.msg)
        }
      }).catch(err => {
        this.$Message.error(err)
      })
    }
  }
}
</script>
