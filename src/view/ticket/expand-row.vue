<style scoped>
.expand-row {
  margin-bottom: 16px;
}
</style>
<template>
  <div>
    <Row class="expand-row">
      <Col span="8">
      <span class="expand-key">当前步骤：</span>
      <span class="expand-value">{{row.curStep ? row.curStep.name : '无'}}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">申请原因：</span>
      <span class="expand-value">{{row.ticket.applyReason}}</span>
      </Col>
      <Col span="8">
      <span
        class="expand-key"
        @click="showDetail"
      >查看详情</span>
      </Col>
    </Row>
  </div>
</template>
<script>
import { getTicketDetail } from '@/api/ticket'
import { getProcess } from '@/api/process'
export default {
  data () {
    return {
      obj: {},
      pro: {},
      stepMap: {},
      logMap: {}
    }
  },
  props: {
    row: Object
  },
  methods: {
    showDetail () {
      getProcess(this.row.ticket.processId)
        .then(res => {
          if (res.data.ok) {
            this.pro = res.data.obj
            this.pro.steps.unshift({ id: 0, name: '提交流程' })
            getTicketDetail(this.row.ticket.id)
              .then(res => {
                const { data } = res
                if (data.ok) {
                  this.obj = data.obj
                  this.showModal()
                } else {
                  this.$Message.error(data.msg)
                }
              })
          }
        })
        .catch(err => {
          this.$Message.error(err)
        })
    },
    showModal () {
      const getStatus = (s) => {
        switch (s) {
          case 'PROCESSING':
            return 'process'
          case 'DENY':
          case 'DONE':
            return 'error'
          case 'PASS':
            return 'finish'
        }
        return 'wait'
      }
      let curIdx = 0
      const lastItem = this.obj.logs[this.obj.logs.length - 1]
      for (let idx in this.pro.steps) {
        const it = this.pro.steps[idx]
        if (!this.stepMap['_' + it.id]) {
          this.stepMap['_' + it.id] = {}
        }
        this.stepMap['_' + it.id] = { ...this.stepMap['_' + it.id], name: it.name }
        this.stepMap['_' + it.id] = { ...this.stepMap['_' + it.id], newStatus: 'wait' }
        if (lastItem.stepId === it.id) {
          curIdx = parseInt(idx)
        }
      }
      for (let idx in this.obj.logs) {
        const it = this.obj.logs[idx]
        this.logMap['_' + it.stepId] = it
        this.stepMap['_' + it.stepId].newStatus = it.pass ? 'finish' : 'error'
      }
      const that = this
      this.$Modal.info({
        render: (h) => {
          return (
            <div style="padding: 15px;">
              <Steps
                direction="vertical"
                current={curIdx}
                status={getStatus(this.obj.ticket.curStatus)}>
                {that.pro.steps.map(t => {
                  return (
                    <Step
                      title={t.name}
                      status={this.stepMap['_' + t.id]['newStatus']}
                      content={this.logMap['_' + t.id] ? `${this.logMap['_' + t.id].processUser} - ${this.logMap['_' + t.id].processProposal} - ${this.logMap['_' + t.id].gmtCreate}` : '待审批'}
                    ></Step>
                  )
                })}
              </Steps>
            </div>
          )
        }
      })
    }
  }
}
</script>
