import React from "react";
import { LinearProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
const log = require("loglevel");
const { apiRoutes } = require("./api");

const AuthContext = React.createContext();

function AuthProvider(props) {
    const [user, setUser] = React.useState(undefined);

    const login = async (username, password) => {
        let response;
        let user = null;
        try {
            response = await fetch(apiRoutes.login, {
                method: "POST",
                headers: {
                    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
                },
            });

            if (response.ok) {
                response = await fetch(apiRoutes.profile);
                user = await response.json();
            }
        } catch (error) {
            log.error(error);
        }

        setUser(user);
        return user;
    };

    const logout = async () => {
        const response = await fetch(apiRoutes.logout, {
            method: "POST",
        });

        if (response.ok) {
            setUser(null);
        }
    };

    React.useEffect(() => {
        if (user === undefined) {
            fetch(apiRoutes.profile)
                .then((response) => (response.ok ? response.json() : null))
                .then((user) => {
                    setUser(user);
                })
                .catch((error) => {
                    log.error(error);
                    setUser(null);
                });
        }
    });

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
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
