<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Hometp from './components/homepages/Hometp.vue';
import Headerd from './components/homepages/Header.vue';
import Footerd from './components/homepages/footer.vue';
import policed from './components/homepages/police.vue';
import Admin from './components/Admin.vue';
import ChatBox from "./components/chatbot.vue";

const route = useRoute();
const isAdminPage = computed(() => route.path.startsWith('/admin'));
</script>

<template>
  <div>
    <Admin v-if="isAdminPage" />
    <template v-else>
      <Hometp />
      <Headerd />
      <RouterView />
      <policed />
      <Footerd />
      <ChatBox />
    </template>
  </div>
</template>
