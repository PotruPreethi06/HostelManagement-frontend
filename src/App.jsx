
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Rooms from "./pages/Rooms";
import Fees from "./pages/Fees";
import Complaints from "./pages/Complaints";
import Attendance from "./pages/Attendance";
import HostelUpdates from "./pages/HostelUpdates";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* LOGIN */}
                <Route
                    path="/"
                    element={<Login />}
                />

                {/* REGISTRATION */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Optional login URL */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* DASHBOARD */}
                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* STUDENTS */}
                <Route
                    path="/students"
                    element={<Students />}
                />

                {/* ROOMS */}
                <Route
                    path="/rooms"
                    element={<Rooms />}
                />

                {/* FEES */}
                <Route
                    path="/fees"
                    element={<Fees />}
                />

                {/* COMPLAINTS */}
                <Route
                    path="/complaints"
                    element={<Complaints />}
                />

                {/* ATTENDANCE */}
                <Route
                    path="/attendance"
                    element={<Attendance />}
                />

                {/* HOSTEL UPDATES */}
                <Route
                    path="/hostel-updates"
                    element={<HostelUpdates />}
                />

                {/* UNKNOWN URL */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
