import { SxProps, Theme } from "@mui/material/styles";

export const weatherFormContainerStyles: SxProps<Theme> = {
	width: { xs: "95%", sm: 500 },
	margin: "20px auto 40px auto",
	display: "flex",
	flexDirection: "column",
	gap: 2,
	backgroundColor: "rgba(255, 255, 255, 0.88)",
	padding: { xs: 2, sm: 3 },
	borderRadius: 2,
	boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
};

export const weatherCardStyles: SxProps<Theme> = {
	backgroundColor: "transparent",
	boxShadow: "none",
};

export const weatherIconStyles: SxProps<Theme> = {
	width: 80,
	height: 80,
	margin: "0 auto 16px auto",
};
