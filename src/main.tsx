import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography
} from "@mui/material";
import AppGlobalStyles from './styles/AppGlobalStyles';
import { mainContainerStyles, titleStyles } from './styles/mainAppStyles';
import WeatherForm from "./components/WeatherForm/WeatherForm";

const theme = createTheme({});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppGlobalStyles />
      <Container maxWidth="sm" sx={mainContainerStyles}>
        <Typography variant="h4" align="center" sx={titleStyles}>
          Weather App
        </Typography>
        <WeatherForm />
      </Container>
    </ThemeProvider>
  </StrictMode>,
);