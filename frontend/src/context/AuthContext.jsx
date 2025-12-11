import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLogin, setIsLogin] = useState(() => {
        return false;
    });
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
        setIsLogin(true);
        navigate('/');
    }
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsLogin(false);
        navigate('/');
    }
    const updateUser = (newUser) => {
        setUser(newUser);
    }
    const value = {
        user,
        isLogin,
        login,
        logout,
        updateUser
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await apiClient.get('/user');
                setUser(response.data.user);
                setIsLogin(true);
            } catch (error) {
                console.log(error);
                logout();
            }
        };
        fetchUser();
    }, []);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => {
    return useContext(AuthContext);
}