
import API_URL from "../api";
import { useState } from "react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            // Validate API URL
            if (!API_URL) {
                throw new Error(
                    "API URL is missing. Check your frontend API configuration."
                );
            }

            const response = await fetch(
                `${API_URL.replace(/\/+$/, "")}/admins/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            );

            // Read the response only once
            const responseText = await response.text();

            let data = {};

            if (responseText.trim()) {
                try {
                    data = JSON.parse(responseText);
                } catch {
                    data = {
                        message: responseText
                    };
                }
            }

            // Handle HTTP errors
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error(
                        data.message || "Invalid email or password."
                    );
                }

                if (response.status === 403) {
                    throw new Error(
                        data.message ||
                        "Access forbidden (403). Check backend security, JWT filters, and CORS configuration."
                    );
                }

                if (response.status === 404) {
                    throw new Error(
                        "Login endpoint not found (404). Check the backend controller URL."
                    );
                }

                throw new Error(
                    data.message ||
                    `Login failed. HTTP status: ${response.status}`
                );
            }

            // Verify response contains a token
            if (!data.token) {
                throw new Error(
                    "The server responded successfully but did not return a login token."
                );
            }

            // Store login information
            localStorage.setItem("token", data.token);

            if (data.name != null) {
                localStorage.setItem("name", data.name);
            }

            if (data.email != null) {
                localStorage.setItem("email", data.email);
            }

            if (data.role != null) {
                localStorage.setItem("role", data.role);
            }

            setMessage("Login successful!");

            console.log("Login successful. User:", {
                name: data.name,
                email: data.email,
                role: data.role
            });

        } catch (error) {
            console.error("Login Error:", error);

            if (error instanceof TypeError) {
                setMessage(
                    "Unable to connect to the server. Check your internet connection, backend status, and CORS settings."
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
                        <label htmlFor="email">
                            Email
                        </label>

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
                        <label htmlFor="password">
                            Password
                        </label>

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

                    <button
                        type="submit"
                        disabled={loading}
                    >
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
