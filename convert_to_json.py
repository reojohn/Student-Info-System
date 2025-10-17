import pandas as pd
import json

df = pd.read_csv("students_data_2.0.csv")

# Convert each row into a dictionary
students_list = []
for _, row in df.iterrows():
    students_list.append({
        "student_id": row["Student ID"],
        "name": row["Full Name"],
        "gender": row["Gender"],
        "email": row["Gmail"],
        "course": row["Program"],
        "year": row["Year Level"],
        "university": row["University"],
        "age": "" 
    })

# Save as JSON
with open("students.json", "w", encoding="utf-8") as f:
    json.dump(students_list, f, indent=2)

print("students.json created successfully!")
