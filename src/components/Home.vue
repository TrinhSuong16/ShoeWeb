<script setup>
import Hometp from './homepages/Hometp.vue';
import Headerd from './homepages/Header.vue';
import footerd from './homepages/footer.vue';
import policed from './homepages/police.vue';
import Admin from './Admin.vue';
</script>

<template>
  <div>
      <Hometp/>
      <headerd/>
     <RouterView></RouterView>
     <policed/>
      <footerd/>
  </div>
</template>
