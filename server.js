const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

// Server configuration
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "students.json"); // Path to JSON "database"

// Middleware setup
app.use(express.json()); // Enables parsing of JSON request bodies
app.use(express.static(path.join(__dirname, "public"))); // Serves files from 'public' folder

// ROUTE: Get all students (READ operation)
app.get("/students", (req, res) => {
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.json([]); // Return empty array if file not found or unreadable
    try {
      const students = JSON.parse(data || "[]"); // Parse JSON data or empty array
      res.setHeader("Cache-Control", "no-store"); // Prevent browser caching
      res.json(students); // Send list of students as JSON
    } catch (error) {
      console.error("JSON parse error:", error);
      res.json([]); // Return empty array if parsing fails
    }
  });
});

// ROUTE: Add a new student (CREATE operation)
app.post("/students", (req, res) => {
  const newStudent = req.body; // Get student data from client
  console.log("📥 Received new student:", newStudent);

  // Read existing student data
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    let students = [];
    if (!err && data) {
      try {
        students = JSON.parse(data);
      } catch {
        students = [];
      }
    }

    // Add the new student to the array
    students.push(newStudent);

    // Save updated data to students.json
    fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), (err) => {
      if (err) {
        console.error("❌ Error saving student:", err);
        return res.status(500).json({ message: "Error saving student" });
      }
      console.log("✅ Student saved!");
      res.status(201).json({ message: "Student added successfully!" });
    });
  });
});

// ROUTE: Delete a student by ID (DELETE operation)
app.delete("/students/:id", (req, res) => {
  const studentId = req.params.id; // Extract student ID from URL

  // Read existing student data
  fs.readFile(DATA_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading file" });

    let students = [];
    try {
      students = JSON.parse(data);
    } catch {
      return res.status(500).json({ message: "Invalid JSON data" });
    }

    // Filter out the student to delete
    const initialLength = students.length;
    students = students.filter((s) => s.student_id !== studentId);

    // If no student was deleted
    if (students.length === initialLength) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Save the updated list back to the file
    fs.writeFile(DATA_FILE, JSON.stringify(students, null, 2), (err) => {
      if (err) {
        console.error("❌ Error deleting student:", err);
        return res.status(500).json({ message: "Error deleting student" });
      }

      console.log(`🗑️ Deleted student: ${studentId}`);
      res.json({ message: "Student deleted successfully" });
    });
  });
});

// Serve the main webpage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
