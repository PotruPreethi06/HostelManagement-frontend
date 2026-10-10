import API_URL from "./api";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Students() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [searchId, setSearchId] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        course: "",
        year: ""
    });


    // =========================
    // GET JWT TOKEN
    // =========================

    const getToken = () => {

        return localStorage.getItem("token");

    };


    // =========================
    // COMMON HEADERS
    // =========================

    const getHeaders = () => {

        return {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        };

    };


    // =========================
    // GET ALL STUDENTS
    // =========================

    const fetchStudents = async () => {

        setLoading(true);

        setError("");
        setMessage("");

        try {

            const response = await fetch(
                `${API_URL}/students`,
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );

            if (response.status === 401) {

                localStorage.clear();

                navigate("/");

                return;
            }

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch students"
                );

            }

            const data = await response.json();

            setStudents(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // LOAD STUDENTS
    // =========================

    useEffect(() => {

        fetchStudents();

    }, []);


    // =========================
    // FORM INPUT
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // =========================
    // ADD / UPDATE STUDENT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        try {

            const url = editingId
                ? `${API_URL}/students/${editingId}`
                : `${API_URL}/students`;

            const method = editingId
                ? "PUT"
                : "POST";

            const response = await fetch(
                url,
                {
                    method: method,
                    headers: getHeaders(),
                    body: JSON.stringify({
                        ...formData,
                        year: Number(formData.year)
                    })
                }
            );

            if (response.status === 401) {

                localStorage.clear();

                navigate("/");

                return;
            }

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Operation failed"
                );

            }

            if (editingId) {

                setMessage(
                    "Student updated successfully"
                );

            } else {

                setMessage(
                    "Student added successfully"
                );

            }

            resetForm();

            fetchStudents();

        } catch (err) {

            setError(err.message);

        }

    };


    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {

        setFormData({
            name: "",
            email: "",
            password: "",
            phone: "",
            course: "",
            year: ""
        });

        setEditingId(null);

        setShowForm(false);

    };


    // =========================
    // EDIT STUDENT
    // =========================

    const handleEdit = (student) => {

        setEditingId(student.id);

        setFormData({
            name: student.name || "",
            email: student.email || "",
            password: "",
            phone: student.phone || "",
            course: student.course || "",
            year: student.year || ""
        });

        setShowForm(true);

        setMessage("");
        setError("");

    };


    // =========================
    // DELETE STUDENT
    // =========================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this student?"
            );

        if (!confirmDelete) {

            return;

        }

        setError("");
        setMessage("");

        try {

            const response = await fetch(
                `${API_URL}/students/${id}`,
                {
                    method: "DELETE",
                    headers: getHeaders()
                }
            );

            if (response.status === 401) {

                localStorage.clear();

                navigate("/");

                return;
            }

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to delete student"
                );

            }

            setMessage(
                "Student deleted successfully"
            );

            fetchStudents();

        } catch (err) {

            setError(err.message);

        }

    };


    // =========================
    // GET STUDENT BY ID
    // =========================

    const handleSearch = async () => {

        if (!searchId.trim()) {

            setError(
                "Please enter a student ID"
            );

            return;

        }

        setError("");
        setMessage("");
        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/students/${searchId}`,
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );

            if (response.status === 401) {

                localStorage.clear();

                navigate("/");

                return;
            }

            if (!response.ok) {

                throw new Error(
                    "Student not found"
                );

            }

            const student =
                await response.json();

            setStudents([student]);

            setMessage(
                `Student with ID ${searchId} found`
            );

        } catch (err) {

            setStudents([]);

            setError(err.message);

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // MAIN UI
    // =========================

    return (

        <div className="students-page">

            {/* HEADER */}

            <div className="students-header">

                <div>

                    <h1>
                        Students Management
                    </h1>

                    <p>
                        View and manage hostel students
                    </p>

                </div>


                <div className="header-buttons">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="back-button"
                    >
                        ← Dashboard
                    </button>

                    <button
                        onClick={fetchStudents}
                        className="refresh-button"
                    >
                        🔄 Refresh
                    </button>

                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({
                                name: "",
                                email: "",
                                password: "",
                                phone: "",
                                course: "",
                                year: ""
                            });
                            setShowForm(true);
                            setMessage("");
                            setError("");
                        }}
                        className="add-button"
                    >
                        + Add Student
                    </button>

                </div>

            </div>


            {/* SUCCESS MESSAGE */}

            {message && (

                <div className="success-message">

                    {message}

                </div>

            )}


            {/* ERROR MESSAGE */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* ADD / UPDATE FORM */}

            {showForm && (

                <div className="student-form-card">

                    <h2>

                        {editingId
                            ? "Update Student"
                            : "Add Student"}

                    </h2>


                    <form
                        onSubmit={handleSubmit}
                    >

                        <div className="form-grid">


                            {/* NAME */}

                            <div className="form-group">

                                <label>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter student name"
                                    required
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    required
                                />

                            </div>


                            {/* PASSWORD */}

                            <div className="form-group">

                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder={
                                        editingId
                                            ? "Leave empty to keep current password"
                                            : "Enter password"
                                    }
                                    required={!editingId}
                                />

                            </div>


                            {/* PHONE */}

                            <div className="form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                    required
                                />

                            </div>


                            {/* COURSE */}

                            <div className="form-group">

                                <label>
                                    Course
                                </label>

                                <input
                                    type="text"
                                    name="course"
                                    value={formData.course}
                                    onChange={handleChange}
                                    placeholder="Enter course"
                                    required
                                />

                            </div>


                            {/* YEAR */}

                            <div className="form-group">

                                <label>
                                    Year
                                </label>

                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    placeholder="Enter year"
                                    min="1"
                                    max="6"
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="save-button"
                            >

                                {editingId
                                    ? "Update Student"
                                    : "Add Student"}

                            </button>


                            <button
                                type="button"
                                className="cancel-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* SEARCH */}

            <div className="search-card">

                <h2>
                    Search Student
                </h2>

                <div className="search-container">

                    <input
                        type="number"
                        value={searchId}
                        onChange={(e) =>
                            setSearchId(e.target.value)
                        }
                        placeholder="Enter Student ID"
                    />

                    <button
                        onClick={handleSearch}
                        className="search-button"
                    >
                        Search
                    </button>

                    <button
                        onClick={() => {
                            setSearchId("");
                            fetchStudents();
                        }}
                        className="show-all-button"
                    >
                        Show All
                    </button>

                </div>

            </div>


            {/* STUDENTS TABLE */}

            <div className="students-table-card">

                <h2>
                    Student List
                </h2>


                {loading ? (

                    <div className="loading">
                        Loading students...
                    </div>

                ) : students.length === 0 ? (

                    <div className="no-data">
                        No students found.
                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Course</th>
                                    <th>Year</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {students.map(
                                    (student) => (

                                        <tr
                                            key={student.id}
                                        >

                                            <td>
                                                {student.id}
                                            </td>

                                            <td>
                                                {student.name}
                                            </td>

                                            <td>
                                                {student.email}
                                            </td>

                                            <td>
                                                {student.phone}
                                            </td>

                                            <td>
                                                {student.course}
                                            </td>

                                            <td>
                                                {student.year}
                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(student)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                student.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );
}

export default Students;