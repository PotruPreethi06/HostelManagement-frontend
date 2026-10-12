
import API_URL from "../api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            if (!API_URL) {
                throw new Error(
                    "API URL is missing. Check your API configuration."
                );
            }

            const baseURL = API_URL.replace(/\/+$/, "");

            const response = await fetch(
                `${baseURL}/admins/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password,
                    }),
                }
            );

            // Read the response only once
            const responseText = await response.text();

            let data = {};

            if (responseText.trim()) {
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = { message: responseText };
                }
            }

            // Handle unsuccessful responses
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(
                        data.message || "Invalid email or password."
                    );
                }

                if (response.status === 403) {
                    throw new Error(
                        data.message ||
                        "Access forbidden (403). Check backend security and CORS."
                    );
                }

                if (response.status === 404) {
                    throw new Error(
                        "Login endpoint not found (404)."
                    );
                }

                throw new Error(
                    data.message ||
                    `Login failed. HTTP status: ${response.status}`
                );
            }

            // Verify the JWT token exists
            if (!data.token) {
                throw new Error(
                    "Login response did not contain a token."
                );
            }

            // Save login information
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.name || "");
            localStorage.setItem("email", data.email || email.trim());
            localStorage.setItem("role", data.role || "");

            console.log("Login successful:", {
                name: data.name,
                email: data.email,
                role: data.role,
            });

            // Navigate to the dashboard after login
            navigate("/dashboard", { replace: true });

        } catch (error) {
            console.error("Login error:", error);

            if (error instanceof TypeError) {
                setMessage(
                    "Unable to connect to the server. Check your internet connection and backend CORS settings."
                );
            } else {
                setMessage(error.message || "Login failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Smart Hostel Management System</h1>

                <h2>Admin / Warden Login</h2>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {message && (
                    <p
                        className="login-message"
                        role="status"
                        aria-live="polite"
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Login;
