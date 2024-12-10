<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center">
      <h1 class="text-4xl font-bold text-blue-600 mb-4">Student Predictor</h1>
      <p class="text-lg text-gray-700 max-w-md">
        This project predicts if a student is likely to pass or not based on their academic grades. Select a student, provide their grades, and let the predictor do the rest!
      </p>
      <button 
        class="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600" 
        @click="navigateToPredicter">
        Start Predicting
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Mainpage',
    methods: {
      navigateToPredicter() {
        this.$router.push('/predicter');
      }
    }
  };
  </script>
  
  <style scoped>
  body {
    font-family: 'Inter', sans-serif;
  }
  </style>