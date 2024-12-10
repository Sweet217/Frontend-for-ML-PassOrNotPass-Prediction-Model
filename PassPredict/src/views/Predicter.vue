<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-3xl font-bold text-center text-blue-600 mb-6">
      Predict Student Outcome
    </h1>

    <div class="mb-6">
      <label for="student" class="block text-gray-700 font-medium mb-2"
        >Select a Student:</label
      >
      <select
        id="student"
        class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        v-model="selectedStudent"
      >
        <option v-for="student in students" :key="student.id" :value="student">
          {{ student.name }}
        </option>
      </select>
    </div>

    <button
      class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 mb-4"
      @click="predict"
      :disabled="!selectedStudent"
    >
      Predict
    </button>

    <div v-if="result !== null" class="mt-6 p-4 border rounded-lg bg-gray-100">
      <p class="text-lg font-medium text-gray-800">
        Prediction Result:
        <span class="font-bold" :class="result ? 'text-green-500' : 'text-red-500'">{{
          resultMessage
        }}</span>
      </p>
    </div>

    <hr class="my-6" />

    <h2 class="text-2xl font-bold text-center text-blue-600 mb-4">Add New Student</h2>

    <form @submit.prevent="addStudent" class="space-y-4">
      <div>
        <label for="name" class="block text-gray-700 font-medium mb-2">Name:</label>
        <input
          id="name"
          v-model="newStudent.name"
          type="text"
          class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          required
        />
      </div>

      <div>
        <label class="block text-gray-700 font-medium mb-2">Grades (14):</label>
        <div class="grid grid-cols-7 gap-2">
          <input
            v-for="(grade, index) in newStudent.grades"
            :key="index"
            v-model.number="newStudent.grades[index]"
            type="number"
            step="0.1"
            class="block w-full px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
      >
        Add Student
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Predicter",
  data() {
    return {
      students: [
        {
          id: 1,
          name: "Alice Johnson",
          grades: [10, 10, 10, 10, 9.5, 9.6, 9.7, 9.8, 9.9, 9.0, 9.1, 9.2, 9.3, 9.4],
        },
        {
          id: 2,
          name: "Benjamin Smith",
          grades: [9.5, 9.3, 9.8, 9.6, 9.7, 9.2, 10, 9.9, 9.4, 9.0, 10, 10, 9.6, 9.8],
        },
        {
          id: 3,
          name: "Catherine Bell",
          grades: [9.8, 9.6, 9.7, 9.5, 9.4, 10, 10, 9.9, 9.3, 9.2, 9.1, 9.0, 9.5, 10],
        },
        {
          id: 4,
          name: "Daniel Carter",
          grades: [10, 10, 9.9, 9.8, 9.7, 9.6, 9.5, 9.4, 9.3, 9.2, 9.1, 9.0, 9.5, 10],
        },
        {
          id: 5,
          name: "Emily Davis",
          grades: [9.7, 9.5, 9.6, 10, 9.8, 10, 9.9, 9.4, 9.3, 9.2, 9.1, 9.0, 10, 10],
        },
        {
          id: 6,
          name: "Frank Green",
          grades: [9.6, 9.7, 9.8, 9.9, 9.5, 9.4, 10, 9.3, 9.2, 10, 9.0, 9.1, 9.7, 9.6],
        },
        {
          id: 7,
          name: "Grace Hall",
          grades: [9.4, 9.3, 9.2, 9.1, 10, 9.0, 9.7, 9.6, 9.8, 9.9, 9.5, 10, 10, 9.7],
        },
        {
          id: 8,
          name: "Henry Adams",
          grades: [10, 9.9, 9.8, 9.7, 9.6, 9.5, 9.4, 9.3, 9.2, 9.1, 9.0, 10, 9.6, 9.8],
        },
        {
          id: 9,
          name: "Isabella Perez",
          grades: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4],
        },
        {
          id: 10,
          name: "Jack Brown",
          grades: [1.9, 1.8, 1.7, 5.6, 3.5, 6.0, 2.4, 1.3, 4.2, 2.1, 7.0, 1.2, 4.5, 2.3],
        },
      ],
      selectedStudent: null,
      result: null,
      newStudent: {
        name: "",
        grades: Array(14).fill(0),
      },
    };
  },
  computed: {
    resultMessage() {
      return this.result
        ? "This student is probable to pass."
        : "This student isn’t probable to pass.";
    },
  },
  methods: {
    async predict() {
      if (!this.selectedStudent) return alert("Please select a student.");

      const features = this.selectedStudent.grades;
      try {
        const response = await axios.post("http://localhost:5000/predict", { features });
        this.result = response.data.prediction;
      } catch (error) {
        console.error("Error predicting:", error);
        alert("There was an error with the prediction. Please try again.");
      }
    },
    addStudent() {
      const newId =
        this.students.length > 0 ? this.students[this.students.length - 1].id + 1 : 1;
      const newStudent = { ...this.newStudent, id: newId };
      this.students.push(newStudent);
      this.newStudent = { name: "", grades: Array(14).fill(0) };
      alert("New student added successfully!");
    },
  },
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
