import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { useTheme } from "@mui/material/styles";
import Zoom from "@mui/material/Zoom";
import * as React from "react";

export default function FloatingAddButton() {
    const theme = useTheme();
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    return (
        <Zoom
            in
            timeout={transitionDuration}
            style={{
                transitionDelay: `${transitionDuration.exit}ms`,
            }}
            unmountOnExit
        >
            <Fab
                sx={{
                    position: "absolute",
                    bottom: 32,
                    right: 32,
                }}
                aria-label="Add"
                color="primary"
                href="/profile/products/new"
            >
                <AddIcon />
            </Fab>
        </Zoom>
    );
}
