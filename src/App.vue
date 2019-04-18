<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getToken } from '@/libs/util'
export default {
  name: 'App',
  methods: {
    ...mapActions(['handleToken'])
  },
  beforeMount () {
    const token = getToken()
    if (token && token['token']) {
      this.handleToken(token)
    }
  }
}
</script>

<style lang="less">
.size {
  width: 100%;
  height: 100%;
}
html,
body {
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}
</style>
