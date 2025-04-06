import { SxProps, Theme } from "@mui/material/styles";

export const mainContainerStyles: SxProps<Theme> = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	minHeight: "100vh",
	padding: "2rem 1rem",
};

export const titleStyles: SxProps<Theme> = {
	mt: 0,
	mb: 3,
	color: "white",
	textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
};
