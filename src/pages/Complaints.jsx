import API_URL from "../api";   
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Complaints() {

    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("all");

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        studentId: "",
        title: "",
        description: "",
        category: "",
        complaintDate: "",
        status: ""
    });

    const token = localStorage.getItem("token");


    // ==========================================
    // GET ALL COMPLAINTS
    // ==========================================

    const fetchComplaints = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API_URL}/complaints`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch complaints");
            }

            const data = await response.json();

            setComplaints(data);

        } catch (error) {

            console.error(error);

            alert("Failed to load complaints");

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // GET ALL STUDENTS
    // ==========================================

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


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        fetchComplaints();
        fetchStudents();

    }, []);


    // ==========================================
    // HANDLE FORM CHANGE
    // ==========================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // ==========================================
    // ADD / UPDATE COMPLAINT
    // ==========================================

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
                    `${API_URL}/complaints/${editingId}`;

                method = "PUT";

            }

            // CREATE
            else {

                url =
                    `${API_URL}/complaints?studentId=${formData.studentId}`;

                method = "POST";

            }


            const body = {

                title: formData.title,

                description: formData.description,

                category: formData.category,

                complaintDate: formData.complaintDate,

                status: formData.status

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
                    "Failed to save complaint"
                );

            }


            alert(
                editingId
                    ? "Complaint updated successfully"
                    : "Complaint added successfully"
            );


            resetForm();

            fetchComplaints();

        } catch (error) {

            console.error(error);

            alert("Failed to save complaint");

        }

    };


    // ==========================================
    // EDIT COMPLAINT
    // ==========================================

    const handleEdit = (complaint) => {

        setEditingId(complaint.id);

        setFormData({

            studentId:
                complaint.student?.id
                    ? String(complaint.student.id)
                    : "",

            title:
                complaint.title ?? "",

            description:
                complaint.description ?? "",

            category:
                complaint.category ?? "",

            complaintDate:
                complaint.complaintDate ?? "",

            status:
                complaint.status ?? ""

        });

        setShowForm(true);

    };


    // ==========================================
    // DELETE COMPLAINT
    // ==========================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this complaint?"
            );

        if (!confirmDelete) {
            return;
        }


        try {

            const response = await fetch(
                `${API_URL}/complaints/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to delete complaint"
                );

            }


            alert(
                "Complaint deleted successfully"
            );

            fetchComplaints();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to delete complaint"
            );

        }

    };


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {

        setFormData({

            studentId: "",
            title: "",
            description: "",
            category: "",
            complaintDate: "",
            status: ""

        });

        setEditingId(null);

        setShowForm(false);

    };


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredComplaints =
        complaints.filter((complaint) => {

            const searchValue =
                search.toLowerCase().trim();

            if (!searchValue) {
                return true;
            }


            // SEARCH BY STUDENT
            if (searchType === "student") {

                return complaint.student?.name
                    ?.toLowerCase()
                    .includes(searchValue);

            }


            // SEARCH BY STATUS
            if (searchType === "status") {

                return complaint.status
                    ?.toLowerCase()
                    .includes(searchValue);

            }


            // SEARCH BY CATEGORY
            if (searchType === "category") {

                return complaint.category
                    ?.toLowerCase()
                    .includes(searchValue);

            }


            // SEARCH ALL
            return (

                String(complaint.id)
                    .includes(searchValue)

                ||

                complaint.title
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                complaint.description
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                complaint.category
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                complaint.status
                    ?.toLowerCase()
                    .includes(searchValue)

                ||

                complaint.student?.name
                    ?.toLowerCase()
                    .includes(searchValue)

            );

        });


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="page-container">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        Complaints Management
                    </h1>

                    <p>
                        View and manage hostel complaints
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
                        onClick={fetchComplaints}
                    >
                        🔄 Refresh
                    </button>


                    <button
                        onClick={() => {

                            resetForm();

                            setShowForm(true);

                        }}
                    >
                        + Add Complaint
                    </button>

                </div>

            </div>


            {/* ==================================
                ADD / EDIT FORM
            ================================== */}

            {showForm && (

                <div className="form-card">

                    <h2>

                        {editingId
                            ? "Edit Complaint"
                            : "Add Complaint"}

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


                        {/* TITLE */}

                        <div className="form-group">

                            <label>
                                Complaint Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={
                                    formData.title
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter complaint title"
                                required
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter complaint description"
                                rows="4"
                                required
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={
                                    formData.category
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="ROOM">
                                    ROOM
                                </option>

                                <option value="FOOD">
                                    FOOD
                                </option>

                                <option value="ELECTRICITY">
                                    ELECTRICITY
                                </option>

                                <option value="WATER">
                                    WATER
                                </option>

                                <option value="CLEANING">
                                    CLEANING
                                </option>

                                <option value="MAINTENANCE">
                                    MAINTENANCE
                                </option>

                                <option value="OTHER">
                                    OTHER
                                </option>

                            </select>

                        </div>


                        {/* COMPLAINT DATE */}

                        <div className="form-group">

                            <label>
                                Complaint Date
                            </label>

                            <input
                                type="date"
                                name="complaintDate"
                                value={
                                    formData.complaintDate
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

                                <option value="PENDING">
                                    PENDING
                                </option>

                                <option value="IN_PROGRESS">
                                    IN_PROGRESS
                                </option>

                                <option value="RESOLVED">
                                    RESOLVED
                                </option>

                                <option value="REJECTED">
                                    REJECTED
                                </option>

                            </select>

                        </div>


                        {/* BUTTONS */}

                        <div className="form-buttons">

                            <button
                                type="submit"
                            >

                                {editingId
                                    ? "Update Complaint"
                                    : "Add Complaint"}

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


            {/* ==================================
                SEARCH
            ================================== */}

            <div className="search-card">

                <h2>
                    Search Complaint
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

                        <option value="category">
                            Category
                        </option>

                    </select>

                </div>

            </div>


            {/* ==================================
                COMPLAINT LIST
            ================================== */}

            <div className="table-card">

                <h2>
                    Complaint List
                </h2>


                {loading ? (

                    <p>
                        Loading complaints...
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
                                        Title
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Complaint Date
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

                                {filteredComplaints.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                        >
                                            No complaints found
                                        </td>

                                    </tr>

                                ) : (

                                    filteredComplaints.map(
                                        (complaint) => (

                                            <tr
                                                key={
                                                    complaint.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        complaint.id
                                                    }
                                                </td>


                                                <td>

                                                    <strong>
                                                        {
                                                            complaint
                                                                .student
                                                                ?.name
                                                        }
                                                    </strong>

                                                    <br />

                                                    <small>
                                                        {
                                                            complaint
                                                                .student
                                                                ?.email
                                                        }
                                                    </small>

                                                </td>


                                                <td>
                                                    {
                                                        complaint.title
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        complaint.description
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        complaint.category ||
                                                        "-"
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        complaint.complaintDate ||
                                                        "-"
                                                    }
                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            complaint.status ===
                                                            "RESOLVED"
                                                                ? "status-paid"
                                                                : complaint.status ===
                                                                  "PENDING"
                                                                ? "status-pending"
                                                                : "status-other"
                                                        }
                                                    >

                                                        {
                                                            complaint.status ||
                                                            "-"
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                complaint
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                complaint.id
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

export default Complaints;