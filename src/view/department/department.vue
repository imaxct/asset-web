<template>
  <Card
    shadow
    style="height: 100%;width: 100%;overflow:hidden"
  >
    <div class="department-outer">
      <div class="view-box">
        <div
          ref="dragWrapper"
          class="org-tree-drag-wrapper"
          @mousedown="mousedownView"
          @contextmenu="handleDocumentContextmenu"
        >
          <div
            class="org-tree-wrapper"
            :style="orgTreeStyle"
          >
            <v-org-tree
              v-if="tree"
              :data="tree"
              :node-render="nodeRender"
              :expand-all="true"
              @on-node-click="handleNodeClick"
              collapsable
            ></v-org-tree>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>
<script>
import { listDep, deleteDep } from '@/api/dep'
import { on, off } from '@/libs/tools'
import './department.less'
const menuList = [
  {
    key: 'edit',
    label: '编辑部门'
  },
  {
    key: 'new',
    label: '新增子部门'
  },
  {
    key: 'delete',
    label: '删除部门'
  }
]
export default {
  name: 'department',
  data () {
    return {
      tree: null,
      list: null,
      currentContextMenuId: '',
      orgTreeOffsetLeft: 0,
      orgTreeOffsetTop: 0,
      initPageX: 0,
      initPageY: 0,
      oldMarginLeft: 0,
      oldMarginTop: 0,
      canMove: false,
      edit: {
        parentDep: null,
        id: null,
        name: null
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData () {
      listDep().then(res => {
        if (res.data.ok) {
          this.tree = res.data.obj.tree
          this.list = res.data.obj.list
          this.list.unshift({
            'id': 0,
            'label': '总公司'
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    handleMenuClick ({ data, key }) {
      console.log({ data, key })
      let del = false
      this.edit = {}
      switch (key) {
        case 'edit':
          if (data.id !== 0) {
            this.edit.parentDep = this.findParent(this.tree, data.id)
          }
          this.edit.id = data.id
          this.edit.name = data.label
          break
        case 'new':
          this.edit.parentDep = data.id
          this.edit.name = ''
          break
        case 'delete':
          del = true
          this.edit.id = data.id
          this.edit.name = data.label
          break
        default:
          this.edit = {}
      }
      if (del) {
        if (this.edit.id === 0) {
          this.$Message.error('总公司不能删除!')
          return
        }
        this.$Modal.confirm({
          title: '警告',
          content: `你确认要删除部门：${this.edit.name}吗？(删除后不可恢复)`,
          onOk: () => {
            deleteDep({ id: this.edit.id }).then(res => {
              const { ok, msg } = res.data
              if (ok) {
                this.$Message.success('删除成功')
              } else {
                this.$Message.error(msg)
              }
              this.$router.replace({
                path: '/department/dep',
                query: {
                  t: Date.now()
                }
              })
            })
          }
        })
        return
      }
      this.$Modal.confirm({
        render: (h) => {
          return (
            <div>
              <Form v-model={this.edit}>
                <FormItem label="父部门">
                  <Select v-model={this.edit.parentDep} placeholder="请选择父部门" v-model={this.edit.parentDep}>
                    {this.list.map(it => {
                      return (
                        <Option value={it.id} key={it.id}>{it.label}</Option>
                      )
                    })}
                  </Select>
                </FormItem>
                <FormItem label="部门名称">
                  <Input v-model={this.edit.name} placeholder="请输入部门名称"></Input>
                </FormItem>
              </Form>
            </div>
          )
        },
        onOk: () => {
          console.log({ key, edit: this.edit })
        }
      })
    },
    findParent (root, value) {
      for (let key in root.children) {
        if (root.children[key].id === value) {
          return root.id
        } else {
          return this.findParent(root.children[key], value)
        }
      }
    },
    handleNodeClick (e, data, expand) {
      expand()
    },
    closeMenu () {
      this.currentContextMenuId = ''
    },
    getBgColor (data) {
      return this.currentContextMenuId === data.id
        ? data.isRoot
          ? '#0d7fe8'
          : '#5d6c7b'
        : ''
    },
    nodeRender (h, data) {
      return (
        <div
          class={[
            'custom-org-node',
            data.children && data.children.length ? 'has-children-label' : ''
          ]}
          on-mousedown={event => event.stopPropagation()}
          on-contextmenu={this.contextmenu.bind(this, data)}
        >
          {data.label}
          <dropdown
            trigger="custom"
            class="context-menu"
            visible={this.currentContextMenuId === data.id}
            nativeOn-click={this.handleDropdownClick}
            on-on-click={this.handleContextMenuClick.bind(this, data)}
            style={{
              transform: `scale(${1 / this.zoomHandled}, ${1 /
                this.zoomHandled})`
            }}
            v-click-outside={this.closeMenu}
          >
            <dropdown-menu slot="list">
              {menuList.map(item => {
                return (
                  <dropdown-item name={item.key}>{item.label}</dropdown-item>
                )
              })}
            </dropdown-menu>
          </dropdown>
        </div>
      )
    },
    contextmenu (data, $event) {
      let event = $event || window.event
      event.preventDefault
        ? event.preventDefault()
        : (event.returnValue = false)
      this.currentContextMenuId = data.id
    },
    setDepartmentData (data) {
      data.isRoot = true
      this.departmentData = data
    },
    mousedownView (event) {
      this.canMove = true
      this.initPageX = event.pageX
      this.initPageY = event.pageY
      this.oldMarginLeft = this.orgTreeOffsetLeft
      this.oldMarginTop = this.orgTreeOffsetTop
      on(document, 'mousemove', this.mousemoveView)
      on(document, 'mouseup', this.mouseupView)
    },
    mousemoveView (event) {
      if (!this.canMove) return
      const { pageX, pageY } = event
      this.orgTreeOffsetLeft = this.oldMarginLeft + pageX - this.initPageX
      this.orgTreeOffsetTop = this.oldMarginTop + pageY - this.initPageY
    },
    mouseupView () {
      this.canMove = false
      off(document, 'mousemove', this.mousemoveView)
      off(document, 'mouseup', this.mouseupView)
    },
    handleDropdownClick (event) {
      event.stopPropagation()
    },
    handleDocumentContextmenu () {
      this.canMove = false
    },
    handleContextMenuClick (data, key) {
      this.handleMenuClick({ data, key })
      this.closeMenu()
    }
  },
  computed: {
    orgTreeStyle () {
      return {
        transform: `translate(-50%, -50%) scale(${this.zoomHandled}, ${this.zoomHandled})`,
        marginLeft: `${this.orgTreeOffsetLeft}px`,
        marginTop: `${this.orgTreeOffsetTop}px`
      }
    }
  },
  beforeDestroy () {
    off(document, 'contextmenu', this.handleDocumentContextmenu)
  }
}
</script>
