import Typography from "@mui/material/Typography";
import React from "react";

const LastUpdated = ({ date }) => (
    <Typography
        component="span"
        variant="body3"
        color="text.secondary"
        sx={{ alignSelf: "center" }}
    >
        Last updated {lastUpdatedText(date)}
    </Typography>
);

const lastUpdatedText = (date) => {
    const diff = Date.now() - Date.parse(date);
    const minutes = Math.floor(diff / 1000 / 60);
    if (minutes < 1) return "Just now";
    if (minutes < 60)
        return `${minutes === 1 ? "a minute" : minutes + " minutes"} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours === 1 ? "an hour" : hours + " hours"} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days === 1 ? "a day" : days + " days"} ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks === 1 ? "a week" : weeks + " weeks"} ago`;
    const months = Math.floor(days / 30);
    if (months < 12)
        return `${months === 1 ? "a month" : months + " months"} ago`;
    const years = Math.floor(days / 365);
    return `${years === 1 ? "a year" : years + " years"} ago`;
};

export default LastUpdated;
