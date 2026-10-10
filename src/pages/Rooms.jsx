import API_URL from "./api";

import { useEffect, useState } from "react";
import axios from "axios";

function Rooms() {

    // =========================
    // STATE
    // =========================

    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        roomNumber: "",
        block: "",
        floor: "",
        capacity: "",
        occupied: 0,
        type: "",
        status: "AVAILABLE"
    });


    // =========================
    // GET TOKEN
    // =========================

    const getToken = () => {

        return localStorage.getItem("token");

    };


    // =========================
    // LOAD ALL ROOMS
    // =========================

    const loadRooms = async () => {

        try {

            setLoading(true);

            const token = getToken();

            const response = await axios.get(
                `${API_URL}/rooms`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "ROOM DATA:",
                response.data
            );

            setRooms(response.data);

        } catch (error) {

            console.error(
                "ROOM LOAD ERROR:",
                error
            );

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                alert(
                    "Authentication failed. Please login again."
                );

            } else {

                alert(
                    "Failed to load rooms."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    // =========================
    // LOAD ROOMS WHEN PAGE OPENS
    // =========================

    useEffect(() => {

        loadRooms();

    }, []);


    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {

        setFormData({
            roomNumber: "",
            block: "",
            floor: "",
            capacity: "",
            occupied: 0,
            type: "",
            status: "AVAILABLE"
        });

        setEditingId(null);

    };


    // =========================
    // OPEN ADD FORM
    // =========================

    const openAddForm = () => {

        resetForm();

        setShowForm(true);

    };


    // =========================
    // OPEN EDIT FORM
    // =========================

    const openEditForm = (room) => {

        setEditingId(room.id);

        setFormData({

            roomNumber: room.roomNumber || "",

            block: room.block || "",

            floor: room.floor ?? "",

            capacity: room.capacity ?? "",

            occupied: room.occupied ?? 0,

            type: room.type || "",

            status: room.status || "AVAILABLE"

        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // =========================
    // ADD / UPDATE ROOM
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token = getToken();

            const roomData = {

                roomNumber:
                    formData.roomNumber,

                block:
                    formData.block,

                floor:
                    Number(formData.floor),

                capacity:
                    Number(formData.capacity),

                occupied:
                    Number(formData.occupied),

                type:
                    formData.type,

                status:
                    formData.status

            };


            // =========================
            // ADD ROOM
            // =========================

            if (editingId === null) {

                await axios.post(

                    `${API_URL}/rooms`,

                    roomData,

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"

                        }
                    }

                );

                alert(
                    "Room added successfully"
                );

            }


            // =========================
            // UPDATE ROOM
            // =========================

            else {

                await axios.put(

                    `${API_URL}/rooms/${editingId}`,

                    roomData,

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"

                        }
                    }

                );

                alert(
                    "Room updated successfully"
                );

            }


            resetForm();

            setShowForm(false);

            loadRooms();

        } catch (error) {

            console.error(
                "SAVE ROOM ERROR:",
                error
            );

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                alert(
                    "Authentication failed. Please login again."
                );

            } else {

                alert(
                    "Failed to save room."
                );
            }

        }

    };


    // =========================
    // DELETE ROOM
    // =========================

    const deleteRoom = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this room?"
            );

        if (!confirmDelete) {

            return;

        }


        try {

            const token = getToken();

            await axios.delete(

                `${API_URL}/rooms/${id}`,

                {
                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }
                }

            );

            alert(
                "Room deleted successfully"
            );

            loadRooms();

        } catch (error) {

            console.error(
                "DELETE ROOM ERROR:",
                error
            );

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                alert(
                    "Authentication failed. Please login again."
                );

            } else {

                alert(
                    "Failed to delete room."
                );
            }

        }

    };


    // =========================
    // RETURN UI
    // =========================

    return (

        <div>

            {/* =========================
                PAGE TITLE
            ========================= */}

            <h1>
                Rooms
            </h1>

            <h2>
                Rooms Management
            </h2>


            {/* =========================
                BUTTONS
            ========================= */}

            <button
                onClick={loadRooms}
            >
                🔄 Refresh
            </button>


            <button
                onClick={openAddForm}
            >
                + Add Room
            </button>


            <hr />


            {/* =========================
                ADD / EDIT FORM
            ========================= */}

            {showForm && (

                <div>

                    <h3>

                        {editingId === null
                            ? "Add New Room"
                            : "Edit Room"}

                    </h3>


                    <form
                        onSubmit={handleSubmit}
                    >


                        {/* ROOM NUMBER */}

                        <div>

                            <label>
                                Room Number:
                            </label>

                            <br />

                            <input
                                type="text"
                                name="roomNumber"
                                value={
                                    formData.roomNumber
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="A-101"
                                required
                            />

                        </div>


                        <br />


                        {/* BLOCK */}

                        <div>

                            <label>
                                Block:
                            </label>

                            <br />

                            <input
                                type="text"
                                name="block"
                                value={
                                    formData.block
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="A"
                                required
                            />

                        </div>


                        <br />


                        {/* FLOOR */}

                        <div>

                            <label>
                                Floor:
                            </label>

                            <br />

                            <input
                                type="number"
                                name="floor"
                                value={
                                    formData.floor
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                required
                            />

                        </div>


                        <br />


                        {/* CAPACITY */}

                        <div>

                            <label>
                                Capacity:
                            </label>

                            <br />

                            <input
                                type="number"
                                name="capacity"
                                value={
                                    formData.capacity
                                }
                                onChange={
                                    handleChange
                                }
                                min="1"
                                required
                            />

                        </div>


                        <br />


                        {/* OCCUPIED */}

                        <div>

                            <label>
                                Occupied:
                            </label>

                            <br />

                            <input
                                type="number"
                                name="occupied"
                                value={
                                    formData.occupied
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                required
                            />

                        </div>


                        <br />


                        {/* TYPE */}

                        <div>

                            <label>
                                Room Type:
                            </label>

                            <br />

                            <select
                                name="type"
                                value={
                                    formData.type
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select Type
                                </option>

                                <option value="AC">
                                    AC
                                </option>

                                <option value="NON_AC">
                                    NON_AC
                                </option>

                            </select>

                        </div>


                        <br />


                        {/* STATUS */}

                        <div>

                            <label>
                                Status:
                            </label>

                            <br />

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

                                <option value="AVAILABLE">
                                    AVAILABLE
                                </option>

                                <option value="FULL">
                                    FULL
                                </option>

                                <option value="MAINTENANCE">
                                    MAINTENANCE
                                </option>

                            </select>

                        </div>


                        <br />


                        {/* SAVE BUTTON */}

                        <button
                            type="submit"
                        >

                            {editingId === null
                                ? "Save Room"
                                : "Update Room"}

                        </button>


                        {/* CANCEL BUTTON */}

                        <button
                            type="button"
                            onClick={() => {

                                setShowForm(false);

                                resetForm();

                            }}
                        >

                            Cancel

                        </button>

                    </form>

                </div>

            )}


            <hr />


            {/* =========================
                ROOM LIST
            ========================= */}

            <h3>
                Room List
            </h3>


            {loading ? (

                <p>
                    Loading rooms...
                </p>

            ) : rooms.length === 0 ? (

                <p>
                    No rooms found.
                </p>

            ) : (

                <table
                    border="1"
                    cellPadding="10"
                    cellSpacing="0"
                >

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Room Number
                            </th>

                            <th>
                                Block
                            </th>

                            <th>
                                Floor
                            </th>

                            <th>
                                Capacity
                            </th>

                            <th>
                                Occupied
                            </th>

                            <th>
                                Type
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

                        {rooms.map(
                            (room) => (

                            <tr
                                key={room.id}
                            >

                                <td>
                                    {room.id}
                                </td>

                                <td>
                                    {room.roomNumber}
                                </td>

                                <td>
                                    {room.block}
                                </td>

                                <td>
                                    {room.floor}
                                </td>

                                <td>
                                    {room.capacity}
                                </td>

                                <td>
                                    {room.occupied}
                                </td>

                                <td>
                                    {room.type}
                                </td>

                                <td>
                                    {room.status}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            openEditForm(
                                                room
                                            )
                                        }
                                    >
                                        Edit
                                    </button>


                                    <button
                                        onClick={() =>
                                            deleteRoom(
                                                room.id
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

            )}

        </div>

    );

}

export default Rooms;

