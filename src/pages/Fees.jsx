import API_URL from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Fees() {

    const navigate = useNavigate();

    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("all");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        studentId: "",
        amount: "",
        month: "",
        paymentDate: "",
        status: ""
    });


    // ==========================================
    // GET TOKEN
    // ==========================================

    const getToken = () => {
        return localStorage.getItem("token");
    };


    // ==========================================
    // GET ALL FEES
    // ==========================================

    const fetchFees = async () => {

        try {

            setLoading(true);

            const token = getToken();

            console.log("Fee Token:", token);

            const response = await fetch(
                `${API_URL}/fees`,
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Fee GET Status:", response.status);

            if (response.status === 401 ||
                response.status === 403) {

                alert(
                    "Authorization failed. Please login again."
                );

                return;
            }

            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );
            }

            const data = await response.json();

            console.log("Fee API Response:", data);

            setFees(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading fees:",
                error
            );

            alert(
                "Failed to load fees"
            );

            setFees([]);

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // GET STUDENTS
    // ==========================================

    const fetchStudents = async () => {

        try {

            const token = getToken();

            const response = await fetch(
                `${API_URL}/students`,
                {
                    method: "GET",

                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );
            }

            const data = await response.json();

            setStudents(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading students:",
                error
            );

        }
    };


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        fetchFees();
        fetchStudents();

    }, []);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // ==========================================
    // ADD / UPDATE FEE
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!formData.studentId) {

            alert(
                "Please select a student"
            );

            return;
        }

        if (!formData.amount) {

            alert(
                "Please enter the amount"
            );

            return;
        }


        try {

            const token = getToken();

            let url;
            let method;


            // UPDATE

            if (editingId) {

                url =
                    `${API_URL}/fees/${editingId}`;

                method = "PUT";

            }

            // CREATE

            else {

                url =
                    `${API_URL}/fees?studentId=${formData.studentId}`;

                method = "POST";

            }


            const body = {

                amount:
                    Number(formData.amount),

                month:
                    formData.month,

                paymentDate:
                    formData.paymentDate,

                status:
                    formData.status

            };


            console.log(
                "Sending Fee:",
                body
            );


            const response = await fetch(
                url,
                {
                    method: method,

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(body)
                }
            );


            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );

            }


            alert(
                editingId
                    ? "Fee updated successfully"
                    : "Fee added successfully"
            );


            resetForm();

            fetchFees();


        } catch (error) {

            console.error(
                "Fee Save Error:",
                error
            );

            alert(
                "Failed to save fee"
            );

        }

    };


    // ==========================================
    // EDIT FEE
    // ==========================================

    const handleEdit = (fee) => {

        setEditingId(
            fee.id
        );

        setFormData({

            studentId:
                fee.student?.id
                    ? String(
                        fee.student.id
                    )
                    : "",

            amount:
                fee.amount ?? "",

            month:
                fee.month ?? "",

            paymentDate:
                fee.paymentDate ?? "",

            status:
                fee.status ?? ""

        });

        setShowForm(true);

    };


    // ==========================================
    // DELETE FEE
    // ==========================================

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this fee?"
            );

        if (!confirmDelete) {
            return;
        }


        try {

            const token =
                getToken();


            const response =
                await fetch(
                    `${API_URL}/fees/${id}`,
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
                    `HTTP Error: ${response.status}`
                );

            }


            alert(
                "Fee deleted successfully"
            );


            fetchFees();


        } catch (error) {

            console.error(
                "Delete Fee Error:",
                error
            );

            alert(
                "Failed to delete fee"
            );

        }

    };


    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {

        setFormData({

            studentId: "",
            amount: "",
            month: "",
            paymentDate: "",
            status: ""

        });

        setEditingId(null);

        setShowForm(false);

    };


    // ==========================================
    // SEARCH
    // ==========================================

    const filteredFees =
        fees.filter((fee) => {

            const value =
                search
                    .toLowerCase()
                    .trim();


            if (!value) {
                return true;
            }


            if (
                searchType === "student"
            ) {

                return (
                    fee.student?.name
                        ?.toLowerCase()
                        .includes(value)
                );

            }


            if (
                searchType === "status"
            ) {

                return (
                    fee.status
                        ?.toLowerCase()
                        .includes(value)
                );

            }


            if (
                searchType === "month"
            ) {

                return (
                    fee.month
                        ?.toLowerCase()
                        .includes(value)
                );

            }


            return (

                String(
                    fee.id
                ).includes(value)

                ||

                fee.student?.name
                    ?.toLowerCase()
                    .includes(value)

                ||

                fee.student?.email
                    ?.toLowerCase()
                    .includes(value)

                ||

                fee.status
                    ?.toLowerCase()
                    .includes(value)

                ||

                fee.month
                    ?.toLowerCase()
                    .includes(value)

            );

        });


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="page-container">


            {/* =================================
                HEADER
            ================================= */}

            <div className="page-header">

                <div>

                    <h1>
                        Fees Management
                    </h1>

                    <p>
                        View and manage hostel fee payments
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
                        onClick={fetchFees}
                    >
                        🔄 Refresh
                    </button>


                    <button
                        onClick={() => {

                            resetForm();

                            setShowForm(true);

                        }}
                    >
                        + Add Fee
                    </button>

                </div>

            </div>


            {/* =================================
                ADD / EDIT FORM
            ================================= */}

            {showForm && (

                <div className="form-card">

                    <h2>

                        {editingId
                            ? "Edit Fee"
                            : "Add Fee"}

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


                        {/* AMOUNT */}

                        <div className="form-group">

                            <label>
                                Amount
                            </label>

                            <input
                                type="number"

                                name="amount"

                                value={
                                    formData.amount
                                }

                                onChange={
                                    handleChange
                                }

                                placeholder="Enter amount"

                                min="0"

                                required
                            />

                        </div>


                        {/* MONTH */}

                        <div className="form-group">

                            <label>
                                Month
                            </label>

                            <input
                                type="text"

                                name="month"

                                value={
                                    formData.month
                                }

                                onChange={
                                    handleChange
                                }

                                placeholder="Example: September 2026"
                            />

                        </div>


                        {/* PAYMENT DATE */}

                        <div className="form-group">

                            <label>
                                Payment Date
                            </label>

                            <input
                                type="date"

                                name="paymentDate"

                                value={
                                    formData.paymentDate
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
                            >

                                <option value="">
                                    Select Status
                                </option>

                                <option value="PAID">
                                    PAID
                                </option>

                                <option value="PENDING">
                                    PENDING
                                </option>

                                <option value="PARTIAL">
                                    PARTIAL
                                </option>

                            </select>

                        </div>


                        {/* BUTTONS */}

                        <div className="form-buttons">

                            <button
                                type="submit"
                            >

                                {editingId
                                    ? "Update Fee"
                                    : "Add Fee"}

                            </button>


                            <button
                                type="button"

                                onClick={
                                    resetForm
                                }
                            >

                                Cancel

                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* =================================
                SEARCH
            ================================= */}

            <div className="search-card">

                <h2>
                    Search Fee
                </h2>


                <div className="search-row">

                    <input
                        type="text"

                        placeholder="Search..."

                        value={
                            search
                        }

                        onChange={
                            (e) =>
                                setSearch(
                                    e.target.value
                                )
                        }
                    />


                    <select
                        value={
                            searchType
                        }

                        onChange={
                            (e) =>
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

                        <option value="month">
                            Month
                        </option>

                    </select>

                </div>

            </div>


            {/* =================================
                FEE TABLE
            ================================= */}

            <div className="table-card">

                <h2>
                    Fee List
                </h2>


                {loading ? (

                    <p>
                        Loading fees...
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
                                        Amount
                                    </th>

                                    <th>
                                        Month
                                    </th>

                                    <th>
                                        Payment Date
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

                                {filteredFees.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                        >
                                            No fees found
                                        </td>

                                    </tr>

                                ) : (

                                    filteredFees.map(
                                        (fee) => (

                                            <tr
                                                key={
                                                    fee.id
                                                }
                                            >

                                                <td>
                                                    {fee.id}
                                                </td>


                                                <td>

                                                    <strong>
                                                        {
                                                            fee.student?.name
                                                        }
                                                    </strong>

                                                    <br />

                                                    <small>
                                                        {
                                                            fee.student?.email
                                                        }
                                                    </small>

                                                </td>


                                                <td>

                                                    ₹
                                                    {Number(
                                                        fee.amount
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}

                                                </td>


                                                <td>

                                                    {
                                                        fee.month ||
                                                        "-"
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        fee.paymentDate ||
                                                        "-"
                                                    }

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            fee.status === "PAID"
                                                                ? "status-paid"
                                                                : fee.status === "PENDING"
                                                                    ? "status-pending"
                                                                    : "status-other"
                                                        }
                                                    >

                                                        {
                                                            fee.status ||
                                                            "-"
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                fee
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                fee.id
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

export default Fees;