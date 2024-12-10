<template>
  <router-view></router-view>
</template>

<script>
export default {
  methods: {
    goToPage(pageName) {
      this.$router.push({ name: pageName });
    },
  },
};
</script>
