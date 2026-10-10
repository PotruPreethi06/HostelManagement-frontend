import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
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

            </Routes>

        </BrowserRouter>
    );
}

export default App;