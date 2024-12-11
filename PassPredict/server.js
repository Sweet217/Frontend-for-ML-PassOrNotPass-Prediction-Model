import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "*",  
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);  // Log request headers
  next();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.json());

const filePath = path.join(process.cwd(), "data", "students.json");

const readStudents = (callback) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading students.json:", err);
      return callback(err);
    }
    const students = JSON.parse(data);
    callback(null, students);
  });
};

const writeStudents = (students, callback) => {
  fs.writeFile(filePath, JSON.stringify(students, null, 2), (err) => {
    if (err) {
      console.error("Error writing to students.json:", err);
      return callback(err);
    }
    callback(null);
  });
};

app.get("/students", (req, res) => {
  readStudents((err, students) => {
    if (err) return res.status(500).send("Error reading students data.");
    res.json(students);
  });
});

app.post("/add-student", (req, res) => {
  const newStudent = req.body;

  readStudents((err, students) => {
    if (err) return res.status(500).send("Error reading students data.");
    
    newStudent.id = students.length ? Math.max(...students.map(s => s.id)) + 1 : 1;

    students.push(newStudent);

    writeStudents(students, (err) => {
      if (err) return res.status(500).send("Error adding student.");
      res.send("Student added successfully!");
    });
  });
});

app.post("/update-student", (req, res) => {
  const updatedStudent = req.body;

  readStudents((err, students) => {
    if (err) return res.status(500).send("Error reading students data.");
    
    const index = students.findIndex(s => s.id === updatedStudent.id);
    if (index === -1) return res.status(404).send("Student not found.");

    students[index] = updatedStudent;

    writeStudents(students, (err) => {
      if (err) return res.status(500).send("Error updating student.");
      res.send("Student updated successfully!");
    });
  });
});

app.post("/remove-student", (req, res) => {
  const studentId = req.body.id;

  readStudents((err, students) => {
    if (err) return res.status(500).send("Error reading students data.");

    const updatedStudents = students.filter(student => student.id !== studentId);

    writeStudents(updatedStudents, (err) => {
      if (err) return res.status(500).send("Error removing student.");
      res.send("Student removed successfully!");
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
