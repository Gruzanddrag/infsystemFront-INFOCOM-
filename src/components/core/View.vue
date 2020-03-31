<template>
  <v-content class="grey darken-3 white--text">
    <div id="core-view">
      <v-fade-transition  mode="out-in">
        <router-view />
      </v-fade-transition>
    </div>
  </v-content>
</template>

<script>
  export default {
    name: 'CoreView',
    metaInfo () {
      return {
        title: 'Управление УМК',
      }
    },
  }
</script>
<style lang="scss">
  #core-view {
    height: 100%;
  }
</style>
