<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-3xl font-bold text-center text-blue-600 mb-6">
      Predict Student Outcome
    </h1>

    <div class="mb-6">
      <label for="student" class="block text-gray-700 font-medium mb-2">
        Select a Student:
      </label>
      <select
        id="student"
        class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
        v-model="selectedStudent"
      >
        <option v-for="student in students" :key="student.id" :value="student">
          {{ student.name }} - GPA: ({{ calculateAverage(student.grades) }})
        </option>
      </select>
    </div>

    <div class="flex justify-between mb-4">
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        @click="predict"
        :disabled="!selectedStudent"
      >
        Predict
      </button>
      <button
        class="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
        @click="editStudent"
        :disabled="!selectedStudent"
      >
        Edit Student
      </button>
      <button
        class="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        @click="removeStudent"
        :disabled="!selectedStudent"
      >
        Remove Student
      </button>
    </div>

    <div v-if="result !== null" class="mt-6 p-4 border rounded-lg bg-gray-100">
      <p class="text-lg font-medium text-gray-800">
        Prediction Result:
        <span class="font-bold" :class="result ? 'text-green-500' : 'text-red-500'">
          {{ resultMessage }}
        </span>
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
      students: [],
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
    async fetchStudents() {
      try {
        const response = await axios.get("http://localhost:3000/students");
        console.log(response.data);
        this.students = response.data;
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    },
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
    async addStudent() {
      try {
        await axios.post("http://localhost:3000/add-student", this.newStudent);
        this.newStudent = { name: "", grades: Array(14).fill(0) }; // Reset form
        this.fetchStudents(); // Refresh the list of students
        alert("New student added successfully!");
      } catch (error) {
        console.error("Error adding student:", error);
        alert("There was an error adding the student. Please try again.");
      }
    },
    async removeStudent() {
      if (!this.selectedStudent) return;

      try {
        await axios.post("http://localhost:3000/remove-student", {
          id: this.selectedStudent.id,
        });
        this.selectedStudent = null; // Clear selected student
        this.fetchStudents(); // Refresh the student list
        alert("Student removed successfully!");
      } catch (error) {
        console.error("Error removing student:", error);
        alert("There was an error removing the student. Please try again.");
      }
    },
    async editStudent() {
      if (!this.selectedStudent) return;

      const updatedName = prompt("Edit student name:", this.selectedStudent.name);
      if (updatedName !== null && updatedName.trim() !== "") {
        const updatedStudent = { ...this.selectedStudent, name: updatedName };
        try {
          await axios.post("http://localhost:3000/update-student", updatedStudent);
          this.fetchStudents(); // Refresh the student list
          alert("Student updated successfully!");
        } catch (error) {
          console.error("Error updating student:", error);
          alert("There was an error updating the student. Please try again.");
        }
      }
    },
    calculateAverage(grades) {
      const total = grades.reduce((sum, grade) => sum + grade, 0);
      return (total / grades.length).toFixed(2);
    },
  },
  mounted() {
    this.fetchStudents(); // Load students when the component is mounted
  },
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
