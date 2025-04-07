import { SxProps, Theme } from '@mui/material/styles';

export const weatherCardStyles: SxProps<Theme> = {
  mt: 3,
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 2,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(5px)',
  borderRadius: 2,
  boxShadow: 3,
  width: '100%',
};

export const weatherIconStyles: SxProps<Theme> = {
  width: { xs: 60, sm: 100 },
  height: { xs: 60, sm: 100 },
  objectFit: 'contain',
  marginLeft: { sm: 2 },
  marginTop: { xs: 1, sm: 0 },
};
