import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HostelUpdates() {

    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        updateDate: "",
        category: "",
        status: "ACTIVE"
    });

    const navigate = useNavigate();

    const token = localStorage.getItem("token");


    // =========================
    // GET ALL HOSTEL UPDATES
    // =========================

    const fetchUpdates = async () => {

        try {

            setLoading(true);

            const response = await axios.get(
                "http://localhost:8080/hostel-updates",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUpdates(response.data);

        } catch (error) {

            console.error(
                "Error fetching hostel updates:",
                error
            );

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                alert(
                    "Authentication failed. Please login again."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {

        fetchUpdates();

    }, []);


    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    // =========================
    // OPEN ADD FORM
    // =========================

    const openAddForm = () => {

        setEditingId(null);

        setFormData({
            title: "",
            description: "",
            updateDate: "",
            category: "",
            status: "ACTIVE"
        });

        setShowForm(true);
    };


    // =========================
    // OPEN EDIT FORM
    // =========================

    const openEditForm = (update) => {

        setEditingId(update.id);

        setFormData({
            title: update.title || "",
            description: update.description || "",
            updateDate: update.updateDate || "",
            category: update.category || "",
            status: update.status || "ACTIVE"
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // =========================
    // SAVE UPDATE
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingId === null) {

                // =========================
                // CREATE
                // =========================

                await axios.post(
                    "http://localhost:8080/hostel-updates",
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                alert(
                    "Hostel update added successfully"
                );

            } else {

                // =========================
                // UPDATE
                // =========================

                await axios.put(
                    `http://localhost:8080/hostel-updates/${editingId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                alert(
                    "Hostel update updated successfully"
                );
            }


            // Reset form

            setFormData({
                title: "",
                description: "",
                updateDate: "",
                category: "",
                status: "ACTIVE"
            });

            setEditingId(null);

            setShowForm(false);

            fetchUpdates();

        } catch (error) {

            console.error(
                "Error saving hostel update:",
                error
            );

            alert(
                "Failed to save hostel update"
            );
        }
    };


    // =========================
    // DELETE UPDATE
    // =========================

    const deleteUpdate = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this update?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await axios.delete(
                `http://localhost:8080/hostel-updates/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(
                "Hostel update deleted successfully"
            );

            fetchUpdates();

        } catch (error) {

            console.error(
                "Error deleting hostel update:",
                error
            );

            alert(
                "Failed to delete hostel update"
            );
        }
    };


    return (

        <div className="page-container">

            {/* =========================
                HEADER
            ========================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Hostel Updates
                    </h1>

                    <p>
                        View and manage hostel announcements
                    </p>

                </div>


                <div className="page-actions">

                    <button
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        ← Dashboard
                    </button>


                    <button
                        onClick={fetchUpdates}
                    >
                        🔄 Refresh
                    </button>

                </div>

            </div>


            {/* =========================
                ADD UPDATE BUTTON
            ========================= */}

            <div className="action-section">

                <button
                    onClick={openAddForm}
                >
                    + Add Update
                </button>

            </div>


            {/* =========================
                ADD / EDIT FORM
            ========================= */}

            {showForm && (

                <div className="content-card">

                    <h2>

                        {editingId === null
                            ? "Add Hostel Update"
                            : "Edit Hostel Update"}

                    </h2>


                    <form onSubmit={handleSubmit}>

                        {/* TITLE */}

                        <div>

                            <label>
                                Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter update title"
                                required
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div>

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter update description"
                                required
                            />

                        </div>


                        {/* DATE */}

                        <div>

                            <label>
                                Update Date
                            </label>

                            <input
                                type="date"
                                name="updateDate"
                                value={formData.updateDate}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* CATEGORY */}

                        <div>

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Category
                                </option>

                                <option value="MAINTENANCE">
                                    Maintenance
                                </option>

                                <option value="ANNOUNCEMENT">
                                    Announcement
                                </option>

                                <option value="EVENT">
                                    Event
                                </option>

                                <option value="GENERAL">
                                    General
                                </option>

                            </select>

                        </div>


                        {/* STATUS */}

                        <div>

                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >

                                <option value="ACTIVE">
                                    Active
                                </option>

                                <option value="INACTIVE">
                                    Inactive
                                </option>

                            </select>

                        </div>


                        {/* BUTTONS */}

                        <div>

                            <button
                                type="submit"
                            >

                                {editingId === null
                                    ? "Save Update"
                                    : "Update"}

                            </button>


                            <button
                                type="button"
                                onClick={() => {

                                    setShowForm(false);
                                    setEditingId(null);

                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* =========================
                UPDATE LIST
            ========================= */}

            <div className="content-card">

                <h2>
                    Hostel Update List
                </h2>


                {loading ? (

                    <p>
                        Loading hostel updates...
                    </p>

                ) : updates.length === 0 ? (

                    <p>
                        No hostel updates found.
                    </p>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>Title</th>

                                    <th>Description</th>

                                    <th>Category</th>

                                    <th>Update Date</th>

                                    <th>Status</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {updates.map(
                                    (update) => (

                                    <tr key={update.id}>

                                        <td>
                                            {update.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {update.title}
                                            </strong>
                                        </td>

                                        <td>
                                            {update.description}
                                        </td>

                                        <td>
                                            {update.category}
                                        </td>

                                        <td>
                                            {update.updateDate}
                                        </td>

                                        <td>
                                            {update.status}
                                        </td>

                                        <td>

                                            <button
                                                onClick={() =>
                                                    openEditForm(
                                                        update
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>


                                            <button
                                                onClick={() =>
                                                    deleteUpdate(
                                                        update.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default HostelUpdates;

