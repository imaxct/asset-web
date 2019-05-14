<template>
  <Card>
    <Form :model="obj">
      <FormItem label="流程名称">
        <Input
          type="text"
          v-model="obj.name"
          placeholder="请输入流程名称"
        ></Input>
      </FormItem>
      <FormItem label="资产接收人">
        <RadioGroup v-model="obj.transferType">
          <Radio :label="null"><span>无</span></Radio>
          <Radio label="APPLY_USER"><span>流程发起人</span></Radio>
          <Radio label="STEP_HANDLER"><span>步骤处理人</span></Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="资产满足状态,留空为不限制状态">
        <CheckboxGroup v-model="obj.statusList">
          <Checkbox
            v-for="(v,k) in PropertyStatus"
            :key="k"
            :label="k"
          ><span>{{v}}</span></Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="资产终态,留空为保持原状态">
        <RadioGroup v-model="obj.finalStatus">
          <Radio
            v-for="(v,k) in PropertyStatus"
            :key="k"
            :label="k"
          >{{v}}</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="需要的权限">
        <CheckboxGroup v-model="obj.roleList">
          <Checkbox
            v-for="(it, idx) in roles"
            :key="idx"
            :label="it.roleName"
          ><span>{{it.name}}</span></Checkbox>
        </CheckboxGroup>
      </FormItem>
    </Form>
    <Form inline>
      <FormItem
        v-for="(it, idx) in steps"
        :key="idx"
        :label="'步骤' + (idx + 1)"
        style="width: 80%;"
      >
        <Row>
          <Col span="6"><Input
            v-model="steps[idx].name"
            placeholder="步骤名"
          ></Input></Col>
          <Col span="6">
          <Select
            multiple
            v-model="steps[idx].roleList"
            placeholder="权限设置,留空为不限制权限"
          >
            <Option
              v-for="(it, idx) in roles"
              :key="idx"
              :value="it.roleName"
            ><span>{{it.name}}</span></Option>
          </Select>
          </Col>
          <Col span="6">
          <Select
            clearable
            v-model="steps[idx].statusRequired"
            placeholder="资产终态,留空为保持原状态"
          >
            <Option
              v-for="(v,k) in PropertyStatus"
              :key="k"
              :value="k"
            >{{v}}</Option>
          </Select>
          </Col>
          <Col span="3">
          <Button
            type="error"
            @click="del(idx)"
          >删除</Button>
          </Col>
        </Row>
      </FormItem>
      <Row style="margin-bottom: 10px;">
        <Button @click="addStep">添加步骤</Button>
      </Row>
    </Form>
    <Row>
      <Button
        type="primary"
        @click="onSubmit"
      >提交</Button>
    </Row>
  </Card>
</template>
<script>
import { PropertyStatus } from '@/libs/util'
export default {
  props: {
    roles: Array
  },
  data () {
    return {
      obj: {},
      PropertyStatus,
      steps: [{ name: null, roleList: [], statusRequired: null }]
    }
  },
  methods: {
    onSubmit () {
      const data = {
        ...this.obj,
        roleRequired: this.obj.roleList.join(','),
        statusRequired: this.obj.statusList.join(',')
      }
      const steps = []
      for (let idx in this.steps) {
        const it = this.steps[idx]
        steps.push({ ...it, roleRequired: it.roleList.join(',') })
      }
      data.step = steps
      this.$emit('add', data)
    },
    del (idx) {
      this.steps.splice(idx, 1)
    },
    addStep () {
      this.steps.push({ name: null, roleList: [], statusRequired: null })
    }
  }
}
</script>
