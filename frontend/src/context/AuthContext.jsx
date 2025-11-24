import React, { createContext, useContext, useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
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
    const updateUser=(newUser)=>{
        setUser(newUser);
    }
    const value = {
        user,
        isLogin,
        login,
        logout,
        updateUser
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => {
    return useContext(AuthContext);
}