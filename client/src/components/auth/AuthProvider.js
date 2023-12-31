import { LinearProgress } from "@mui/material";
import React from "react";
import { Navigate } from "react-router-dom";

import { apiRoutes } from "api";
import { useSnackbar } from "components/SnackbarProvider";

const AuthContext = React.createContext();

function AuthProvider(props) {
    const [user, setUser] = React.useState(undefined);
    const { showSnackbar } = useSnackbar();

    const updateUser = async () => {
        let user = null;
        try {
            const res = await fetch(apiRoutes.profile);
            if (res.ok) user = await res.json();
        } catch (error) {
            console.error(error);
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
            else if (res.status === 403)
                showSnackbar("Email not verified", "error", 5000);
            else showSnackbar("Invalid username or password", "error", 5000);
        } catch (error) {
            console.error(error);
            showSnackbar("Something went wrong", "error", 5000);
        }

        return user;
    };

    const logout = async () => {
        const res = await fetch(apiRoutes.logout, {
            method: "POST",
        });

        if (res.ok) setUser(null);
        else showSnackbar("Unable to logout", "error", 5000);
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
