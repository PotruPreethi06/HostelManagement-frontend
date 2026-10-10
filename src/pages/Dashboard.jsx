
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    const [activePage, setActivePage] = useState("Dashboard");


    // =========================
    // MENU CLICK
    // =========================

    const handleMenuClick = (item) => {

        if (item === "Students") {
            navigate("/students");
            return;
        }

        if (item === "Rooms") {
            navigate("/rooms");
            return;
        }

        if (item === "Fees") {
            navigate("/fees");
            return;
        }

        if (item === "Complaints") {
            navigate("/complaints");
            return;
        }

        if (item === "Attendance") {
            navigate("/attendance");
            return;
        }

        if (item === "Hostel Updates") {
            navigate("/hostel-updates");
            return;
        }

        if (item === "Dashboard") {
            navigate("/dashboard");
            setActivePage("Dashboard");
            return;
        }

        setActivePage(item);
    };


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");
    };


    // =========================
    // DASHBOARD
    // =========================

    return (

        <div style={styles.container}>

            {/* =========================
                SIDEBAR
            ========================= */}

            <div style={styles.sidebar}>

                <div style={styles.logoSection}>

                    <div style={styles.logo}>
                        H
                    </div>

                    <div>

                        <h2 style={styles.logoTitle}>
                            Smart Hostel
                        </h2>

                        <h2 style={styles.logoTitle}>
                            Management System
                        </h2>

                    </div>

                </div>


                {/* WARDEN */}

                <div style={styles.userSection}>

                    <div style={styles.userIcon}>
                        H
                    </div>

                    <div>

                        <div style={styles.userName}>
                            Hostel Warden
                        </div>

                        <div style={styles.userRole}>
                            WARDEN
                        </div>

                    </div>

                </div>


                {/* MENU */}

                <div style={styles.menu}>

                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            handleMenuClick("Dashboard")
                        }
                    >
                        Dashboard
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            handleMenuClick("Students")
                        }
                    >
                        Students
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            handleMenuClick("Rooms")
                        }
                    >
                        Rooms
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            handleMenuClick("Fees")
                        }
                    >
                        Fees
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            handleMenuClick("Complaints")
                        }
                    >
                        Complaints
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            handleMenuClick("Attendance")
                        }
                    >
                        Attendance
                    </button>


                    <button
                        style={styles.menuButton}
                        onClick={() =>
                            handleMenuClick("Hostel Updates")
                        }
                    >
                        Hostel Updates
                    </button>


                    <button
                        style={styles.logoutButton}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <div style={styles.mainContent}>

                {/* HEADER */}

                <div style={styles.header}>

                    <div>

                        <h1 style={styles.pageTitle}>
                            Dashboard
                        </h1>

                        <p style={styles.subtitle}>
                            Smart Hostel Management System
                        </p>

                    </div>


                    <div style={styles.headerUser}>

                        <div style={styles.headerUserName}>
                            Hostel Warden
                        </div>

                        <div style={styles.headerRole}>
                            WARDEN
                        </div>

                    </div>

                </div>


                {/* WELCOME */}

                <div style={styles.welcomeSection}>

                    <h2>
                        Welcome, Hostel Warden!
                    </h2>

                    <p>
                        Manage your hostel activities
                        from one place.
                    </p>

                </div>


                {/* =========================
                    MODULE CARDS
                ========================= */}

                <div style={styles.cardGrid}>


                    {/* STUDENTS */}

                    <div style={styles.card}>

                        <h2>
                            Students
                        </h2>

                        <p>
                            Manage Student Registration
                        </p>

                        <button
                            style={styles.viewButton}
                            onClick={() =>
                                handleMenuClick(
                                    "Students"
                                )
                            }
                        >
                            View Students
                        </button>

                    </div>


                    {/* ROOMS */}

                    <div style={styles.card}>

                        <h2>
                            Rooms
                        </h2>

                        <p>
                            Manage Room Allocation
                        </p>

                        <button
                            style={styles.viewButton}
                            onClick={() =>
                                handleMenuClick(
                                    "Rooms"
                                )
                            }
                        >
                            View Rooms
                        </button>

                    </div>


                    {/* FEES */}

                    <div style={styles.card}>

                        <h2>
                            Fees
                        </h2>

                        <p>
                            Manage Fee Payments
                        </p>

                        <button
                            style={styles.viewButton}
                            onClick={() =>
                                handleMenuClick(
                                    "Fees"
                                )
                            }
                        >
                            View Fees
                        </button>

                    </div>


                    {/* COMPLAINTS */}

                    <div style={styles.card}>

                        <h2>
                            Complaints
                        </h2>

                        <p>
                            Manage Hostel Complaints
                        </p>

                        <button
                            style={styles.viewButton}
                            onClick={() =>
                                handleMenuClick(
                                    "Complaints"
                                )
                            }
                        >
                            View Complaints
                        </button>

                    </div>


                    {/* ATTENDANCE */}

                    <div style={styles.card}>

                        <h2>
                            Attendance
                        </h2>

                        <p>
                            Manage Student Attendance
                        </p>

                        <button
                            style={styles.viewButton}
                            onClick={() =>
                                handleMenuClick(
                                    "Attendance"
                                )
                            }
                        >
                            View Attendance
                        </button>

                    </div>


                    {/* HOSTEL UPDATES */}

                    <div style={styles.card}>

                        <h2>
                            Hostel Updates
                        </h2>

                        <p>
                            Manage Hostel Announcements
                        </p>

                        <button
                            style={styles.viewButton}
                            onClick={() =>
                                handleMenuClick(
                                    "Hostel Updates"
                                )
                            }
                        >
                            View Updates
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}


// =========================
// STYLES
// =========================

const styles = {

    container: {

        display: "flex",

        minHeight: "100vh",

        fontFamily:
            "Arial, sans-serif",

        backgroundColor:
            "#f5f7fb"

    },


    // SIDEBAR

    sidebar: {

        width: "240px",

        backgroundColor:
            "#1f2937",

        color: "white",

        padding: "20px",

        boxSizing: "border-box"

    },


    logoSection: {

        display: "flex",

        alignItems: "center",

        gap: "10px",

        marginBottom: "30px"

    },


    logo: {

        width: "45px",

        height: "45px",

        borderRadius: "8px",

        backgroundColor:
            "#2563eb",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        fontSize: "24px",

        fontWeight: "bold"

    },


    logoTitle: {

        margin: "0",

        fontSize: "16px"

    },


    // USER

    userSection: {

        display: "flex",

        alignItems: "center",

        gap: "10px",

        marginBottom: "30px"

    },


    userIcon: {

        width: "40px",

        height: "40px",

        borderRadius: "50%",

        backgroundColor:
            "#374151",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        fontWeight: "bold"

    },


    userName: {

        fontWeight: "bold"

    },


    userRole: {

        fontSize: "12px",

        color: "#9ca3af",

        marginTop: "3px"

    },


    // MENU

    menu: {

        display: "flex",

        flexDirection: "column",

        gap: "8px"

    },


    menuButton: {

        border: "none",

        backgroundColor:
            "transparent",

        color: "white",

        padding: "12px",

        textAlign: "left",

        cursor: "pointer",

        borderRadius: "6px",

        fontSize: "15px"

    },


    logoutButton: {

        border: "none",

        backgroundColor:
            "#dc2626",

        color: "white",

        padding: "12px",

        textAlign: "left",

        cursor: "pointer",

        borderRadius: "6px",

        fontSize: "15px",

        marginTop: "20px"

    },


    // MAIN

    mainContent: {

        flex: 1,

        padding: "30px",

        boxSizing: "border-box"

    },


    // HEADER

    header: {

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        backgroundColor:
            "white",

        padding: "20px",

        borderRadius: "10px",

        marginBottom: "25px"

    },


    pageTitle: {

        margin: "0",

        fontSize: "28px"

    },


    subtitle: {

        marginTop: "5px",

        color: "#6b7280"

    },


    headerUser: {

        textAlign: "right"

    },


    headerUserName: {

        fontWeight: "bold"

    },


    headerRole: {

        fontSize: "12px",

        color: "#6b7280",

        marginTop: "3px"

    },


    // WELCOME

    welcomeSection: {

        backgroundColor:
            "white",

        padding: "25px",

        borderRadius: "10px",

        marginBottom: "25px"

    },


    // CARDS

    cardGrid: {

        display: "grid",

        gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",

        gap: "20px"

    },


    card: {

        backgroundColor:
            "white",

        padding: "25px",

        borderRadius: "10px",

        boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)"

    },


    viewButton: {

        border: "none",

        backgroundColor:
            "#2563eb",

        color: "white",

        padding: "10px 16px",

        borderRadius: "6px",

        cursor: "pointer",

        marginTop: "10px"

    }

};

export default Dashboard;

