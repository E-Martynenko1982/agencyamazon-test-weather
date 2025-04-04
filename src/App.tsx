import { Container, Typography } from "@mui/material";
import WeatherForm from "./components/WeatherForm";

function App() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        Weather App
      </Typography>
      <WeatherForm />
    </Container>
  );
}

export default App;
