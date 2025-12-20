import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await api.get('/user/check-login');
                if (response.status === 200) {
                    console.log("Session found for:", response.data.username);
                    setUser(response.data); 
                }
            } catch (error) {
                console.log("No active session found.");
            } finally {
                setLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const response = await api.post('/user/login', { email, password });
            if (response.status === 200) {
                setUser(response.data);
                return response.data;
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

   const logout = async () => {
        try {
            // Call the backend to clear the HttpOnly cookie
            await api.post('/user/logout');
        } catch (error) {
            console.error("Logout backend call failed", error);
        } finally {
            // Clear local state and redirect regardless of backend success
            setUser(null);
            window.location.href = '/login';
        }
    };

    const value = {
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;