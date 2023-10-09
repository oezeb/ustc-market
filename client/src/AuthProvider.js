import React from "react";
import { LinearProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
const log = require("loglevel");
const { apiRoutes } = require("./api");

const AuthContext = React.createContext();

function AuthProvider(props) {
    const [user, setUser] = React.useState(undefined);

    const updateUser = async () => {
        let user = null;
        try {
            const res = await fetch(apiRoutes.profile);
            if (res.ok) user = await res.json();
        } catch (error) {
            log.error(error);
        }

        setUser(user);
        return user;
    };

    const login = async (username, password) => {
        let user = null;
        try {
            const res = await fetch(apiRoutes.login, {
                method: "POST",
                headers: {
                    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
                },
            });

            if (res.ok) user = await updateUser();
        } catch (error) {
            log.error(error);
        }

        return user;
    };

    const logout = async () => {
        const res = await fetch(apiRoutes.logout, {
            method: "POST",
        });

        if (res.ok) setUser(null);
    };

    React.useEffect(() => {
        if (user === undefined) updateUser();
    });

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return React.useContext(AuthContext);
}

export function RequireAuth(props) {
    const { user } = useAuth();
    if (user === undefined) return <LinearProgress />;
    if (user === null) return <Navigate to="/login" />;
    return props.children;
}

export default AuthProvider;
