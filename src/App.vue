<template>
  <Layout :title="pageTitle" :subtitle="pageSubtitle">
    <router-view />
  </Layout>
</template>

<script setup>
import { ref, provide } from 'vue';
import Layout from './components/Layout.vue';

// 1) Maintain your header state here
const pageTitle = ref('');
const pageSubtitle = ref('');

// 2) Let pages call this to update the header
function setTitles(title, subtitle) {
  pageTitle.value = title;
  pageSubtitle.value = subtitle;
}

// 3) Make it available to all descendants
provide('setTitles', setTitles);

// 4) You still need statusLevel for CrtHeader:
const statusLevel = ref('white');
provide('statusLevel', statusLevel);
</script>
