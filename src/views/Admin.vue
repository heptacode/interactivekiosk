<template>
  <div class="page-admin">
    <header class="path-list">
      <router-link to="/" class="path">
        <i class="iconify home" data-icon="mdi-home"></i>
      </router-link>
      <span class="path">관리자</span>
    </header>
    <div v-for="(item, index) in stock" :key="index">
      {{ item }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { StockItem } from "../schema";

@Component({})
export default class Admin extends Vue {
  stock: StockItem[] = this.$store.state.stock;
}
</script>

<style lang="scss" scoped></style>
