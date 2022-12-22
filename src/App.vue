<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import PaperStyler from './components/stylers/Paper.vue';
import ShowGridSwitch from "./components/ShowGridSwitch.vue";
</script>

<script lang="ts">
import { useGrid } from './stores/useGrid';
import { mapState } from 'pinia';

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState(useGrid, ['classObject']),
  }
}
</script>

<template>
  <PaperStyler>
    <div class="grid-container" :class="classObject">
      <ShowGridSwitch />
      <header class="grid-item" :class="classObject">
        <div class="wrapper">
          <HelloWorld msg="You did it!" />
          <font-awesome-icon icon="fa-solid fa-house" />
          <font-awesome-icon icon="fa-regular fa-user" />

          <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
          </nav>
        </div>
      </header>
      <RouterView />
    </div>
  </PaperStyler>
</template>

<style scoped>

</style>
