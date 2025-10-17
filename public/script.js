//Function: Load all students and display in table
async function loadStudents() {
  const response = await fetch("/students"); // Get data from server
  const students = await response.json();

  const tbody = document.querySelector("#studentTable tbody");
  const thead = document.querySelector("#studentTable thead");

  // Create table header
  thead.innerHTML = `
    <tr>
      <th>Student ID</th>
      <th>Full Name</th>
      <th>Gender</th>
      <th>Email</th>
      <th>Program</th>
      <th>Year Level</th>
      <th>University</th>
      <th>Actions</th>
    </tr>
  `;

  // Get search/filter values
  const searchQuery = document.querySelector("#searchInput").value.toLowerCase();
  const genderFilter = document.querySelector("#genderFilter").value;

  // Filter students by search or gender
  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery) ||
      s.course.toLowerCase().includes(searchQuery);
    const matchesGender =
      !genderFilter || s.gender.toLowerCase() === genderFilter.toLowerCase();
    return matchesSearch && matchesGender;
  });

  // Display table rows dynamically
  tbody.innerHTML = filtered
    .map(
      (s) => `
      <tr>
        <td>${s.student_id}</td>
        <td>${s.name}</td>
        <td>${s.gender}</td>
        <td>${s.email}</td>
        <td>${s.course}</td>
        <td>${s.year}</td>
        <td>${s.university}</td>
        <td><button class="deleteBtn" onclick="deleteStudent('${s.student_id}')">🗑️ Delete</button></td>
      </tr>
    `
    )
    .join("");
}

//Form submission: Add new student
document.getElementById("studentForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent page reload

  // Collect form data
  const student = {
    student_id: document.getElementById("studentID").value.trim(),
    name: document.getElementById("fullName").value.trim(),
    gender: document.getElementById("gender").value.trim(),
    email: document.getElementById("gmail").value.trim(),
    course: document.getElementById("program").value.trim(),
    year: document.getElementById("yearLevel").value.trim(),
    university: document.getElementById("university").value.trim(),
  };

// ✅ Validate inputs
if (!student.student_id || !student.name || !student.gender || !student.email) {
  alert("Please fill in all required fields!");
  return;
}

if (!/^[A-Za-z\s]+$/.test(student.name)) {
  alert("Name should only contain letters!");
  return;
}

if (!/^[A-Za-z\s]+$/.test(student.gender)) {
  alert("Gender should only contain letters!");
  return;
}

if (!["male", "female"].includes(student.gender.toLowerCase())) {
  alert("Gender must be either Male or Female!");
  return;
}

if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(student.email)) {
  alert("Please enter a valid Gmail address (e.g., example@gmail.com).");
  return;
}


  // Send POST request to add student
  const response = await fetch("/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });

  // Handle response
  if (response.ok) {
    alert("✅ Student added successfully!");
    e.target.reset(); // Clear form
    await loadStudents(); // Refresh table
  } else {
    alert("❌ Failed to add student.");
  }
});

// Function: Delete a student
async function deleteStudent(studentId) {
  if (!confirm("Are you sure you want to delete this student?")) return;

  const response = await fetch(`/students/${studentId}`, { method: "DELETE" });

  if (response.ok) {
    alert("🗑️ Student deleted successfully!");
    await loadStudents(); // Refresh table
  } else {
    alert("❌ Failed to delete student");
  }
}

// Event listeners for live search & filter
document.getElementById("searchInput").addEventListener("input", loadStudents);
document.getElementById("genderFilter").addEventListener("change", loadStudents);

// Initial page load
loadStudents();


// Theme toggle logic
const toggleBtn = document.getElementById("themeToggle");
toggleBtn.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  toggleBtn.textContent = newTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
});
