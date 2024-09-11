import { AppBar, Box, Button, Typography } from '@mui/material'
import Logo from '../assets/logot.png'

export function Header({ formatTime, timeRemaining, navigate }) {
  const cerrarSesion = () => {
    localStorage.clear()
    navigate('/', { replace: true })
  }

  return (
    <AppBar sx={{ padding: 2, display: 'flex', justifyContent: 'center', backgroundColor: 'white', height: 60, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src={Logo} width={120} />
        {
          timeRemaining && formatTime
            ? (
              <Typography sx={{ color: 'black', fontWeight: 'bold' }}>Tiempo: {formatTime(timeRemaining)}</Typography>)
            : (
              <Button variant='outlined' color='error' onClick={() => cerrarSesion()}>
                Cerrar Sesión
              </Button>)
        }
      </Box>
    </AppBar>
  )
}
