import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Link } from "react-router";

export default function NotFound() {
    return (
        <Container maxWidth="md">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
                textAlign="center"
            >
                <Typography
                    color="primary"
                    whiteSpace="nowrap"
                    fontSize={20}
                    fontWeight={700}
                    lineHeight={1}
                    gutterBottom
                >
                    USTC Market
                </Typography>
                <Typography variant="h2" component="h1">
                    404
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    Oops! The page you're looking for doesn't exist.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/"
                >
                    Go back to Home
                </Button>
            </Box>
        </Container>
    );
}
