import { GlobalStyles } from "@mui/material";
import backgroundImage from '../assets/rain-1987412_1280.png';

const globalStyleObject = {
  body: {
    margin: 0,
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    backgroundColor: '#cccccc', // Fallback color
  },
  html: {
    height: '100%',
  },
};

function AppGlobalStyles() {
  return <GlobalStyles styles={globalStyleObject} />;
}

export default AppGlobalStyles;