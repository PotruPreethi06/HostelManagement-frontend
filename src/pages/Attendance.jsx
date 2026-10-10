import API_URL from "./api";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Attendance() {

    const navigate = useNavigate();

    const [attendance, setAttendance] = useState([]);
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("all");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        studentId: "",
        attendanceDate: "",
        status: ""
    });

    const token = localStorage.getItem("token");


    // =====================================
    // GET ALL ATTENDANCE
    // =====================================

    const fetchAttendance = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/attendance`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch attendance");
            }

            const data = await response.json();

            setAttendance(data);

        } catch (error) {

            console.error(error);

            alert("Failed to load attendance");

        } finally {

            setLoading(false);

        }
    };


    // =====================================
    // GET STUDENTS
    // =====================================

    const fetchStudents = async () => {

        try {

            const response = await fetch(
                `${API_URL}/students`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch students");
            }

            const data = await response.json();

            setStudents(data);

        } catch (error) {

            console.error(error);

            alert("Failed to load students");

        }
    };


    // =====================================
    // LOAD DATA
    // =====================================

    useEffect(() => {

        fetchAttendance();
        fetchStudents();

    }, []);


    // =====================================
    // FORM CHANGE
    // =====================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // =====================================
    // ADD / UPDATE
    // =====================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!formData.studentId) {

            alert("Please select a student");

            return;
        }

        try {

            let url;
            let method;

            // UPDATE
            if (editingId) {

                url =
                    `${API_URL}/attendance/${editingId}`;

                method = "PUT";

            }

            // CREATE
            else {

                url =
                    `${API_URL}/attendance?studentId=${formData.studentId}`;

                method = "POST";

            }


            const body = {

                attendanceDate:
                    formData.attendanceDate,

                status:
                    formData.status

            };


            const response = await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },

                    body: JSON.stringify(body)
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to save attendance"
                );

            }


            alert(
                editingId
                    ? "Attendance updated successfully"
                    : "Attendance added successfully"
            );


            resetForm();

            fetchAttendance();


        } catch (error) {

            console.error(error);

            alert("Failed to save attendance");

        }

    };


    // =====================================
    // EDIT
    // =====================================

    const handleEdit = (record) => {

        setEditingId(record.id);

        setFormData({

            studentId:
                record.student?.id
                    ? String(record.student.id)
                    : "",

            attendanceDate:
                record.attendanceDate || "",

            status:
                record.status || ""

        });

        setShowForm(true);

    };


    // =====================================
    // DELETE
    // =====================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this attendance record?"
            );

        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(`${API_URL}/attendance/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete attendance"
                );

            }


            alert(
                "Attendance deleted successfully"
            );

            fetchAttendance();


        } catch (error) {

            console.error(error);

            alert(
                "Failed to delete attendance"
            );

        }

    };


    // =====================================
    // RESET FORM
    // =====================================

    const resetForm = () => {

        setFormData({

            studentId: "",
            attendanceDate: "",
            status: ""

        });

        setEditingId(null);

        setShowForm(false);

    };


    // =====================================
    // SEARCH
    // =====================================

    const filteredAttendance =
        attendance.filter((record) => {

            const searchValue =
                search.toLowerCase().trim();

            if (!searchValue) {
                return true;
            }


            // SEARCH STUDENT
            if (searchType === "student") {

                return (
                    record.student?.name
                        ?.toLowerCase()
                        .includes(searchValue)
                );

            }


            // SEARCH STATUS
            if (searchType === "status") {

                return (
                    record.status
                        ?.toLowerCase()
                        .includes(searchValue)
                );

            }


            // SEARCH DATE
            if (searchType === "date") {

                return (
                    record.attendanceDate
                        ?.toLowerCase()
                        .includes(searchValue)
                );

            }


            // SEARCH ALL
            return (

                String(record.id)
                    .includes(searchValue)

                ||

                record.student?.name
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                record.student?.email
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                record.status
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                record.attendanceDate
                    ?.toLowerCase()
                    .includes(searchValue)

            );

        });


    return (

        <div className="page-container">


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        Attendance Management
                    </h1>

                    <p>
                        View and manage student attendance
                    </p>

                </div>


                <div className="header-buttons">

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                    <button
                        onClick={fetchAttendance}
                    >
                        🔄 Refresh
                    </button>


                    <button
                        onClick={() => {

                            resetForm();

                            setShowForm(true);

                        }}
                    >
                        + Add Attendance
                    </button>

                </div>

            </div>


            {/* =====================================
                ADD / EDIT FORM
            ===================================== */}

            {showForm && (

                <div className="form-card">

                    <h2>

                        {editingId
                            ? "Edit Attendance"
                            : "Add Attendance"}

                    </h2>


                    <form
                        onSubmit={handleSubmit}
                    >


                        {/* STUDENT */}

                        <div className="form-group">

                            <label>
                                Student
                            </label>

                            <select
                                name="studentId"
                                value={
                                    formData.studentId
                                }
                                onChange={
                                    handleChange
                                }
                                required
                                disabled={
                                    editingId !== null
                                }
                            >

                                <option value="">
                                    Select Student
                                </option>

                                {students.map(
                                    (student) => (

                                        <option
                                            key={
                                                student.id
                                            }
                                            value={
                                                student.id
                                            }
                                        >
                                            {student.name}
                                            {" "}
                                            (ID:{" "}
                                            {student.id})
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* DATE */}

                        <div className="form-group">

                            <label>
                                Attendance Date
                            </label>

                            <input
                                type="date"
                                name="attendanceDate"
                                value={
                                    formData.attendanceDate
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        {/* STATUS */}

                        <div className="form-group">

                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select Status
                                </option>

                                <option value="PRESENT">
                                    PRESENT
                                </option>

                                <option value="ABSENT">
                                    ABSENT
                                </option>

                                <option value="LEAVE">
                                    LEAVE
                                </option>

                            </select>

                        </div>


                        {/* BUTTONS */}

                        <div className="form-buttons">

                            <button
                                type="submit"
                            >
                                {editingId
                                    ? "Update Attendance"
                                    : "Add Attendance"}
                            </button>


                            <button
                                type="button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* =====================================
                SEARCH
            ===================================== */}

            <div className="search-card">

                <h2>
                    Search Attendance
                </h2>


                <div className="search-row">

                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />


                    <select
                        value={searchType}
                        onChange={(e) =>
                            setSearchType(
                                e.target.value
                            )
                        }
                    >

                        <option value="all">
                            Show All
                        </option>

                        <option value="student">
                            Student
                        </option>

                        <option value="status">
                            Status
                        </option>

                        <option value="date">
                            Date
                        </option>

                    </select>

                </div>

            </div>


            {/* =====================================
                ATTENDANCE LIST
            ===================================== */}

            <div className="table-card">

                <h2>
                    Attendance List
                </h2>


                {loading ? (

                    <p>
                        Loading attendance...
                    </p>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Attendance Date
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredAttendance.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="5"
                                        >
                                            No attendance records found
                                        </td>

                                    </tr>

                                ) : (

                                    filteredAttendance.map(
                                        (record) => (

                                            <tr
                                                key={
                                                    record.id
                                                }
                                            >

                                                <td>
                                                    {record.id}
                                                </td>


                                                <td>

                                                    <strong>
                                                        {
                                                            record
                                                                .student
                                                                ?.name
                                                        }
                                                    </strong>

                                                    <br />

                                                    <small>
                                                        {
                                                            record
                                                                .student
                                                                ?.email
                                                        }
                                                    </small>

                                                </td>


                                                <td>
                                                    {
                                                        record
                                                            .attendanceDate
                                                    }
                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            record.status ===
                                                            "PRESENT"
                                                                ? "status-paid"
                                                                : record.status ===
                                                                  "ABSENT"
                                                                ? "status-pending"
                                                                : "status-other"
                                                        }
                                                    >
                                                        {
                                                            record.status ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                record
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                record.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        )
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

export default Attendance;