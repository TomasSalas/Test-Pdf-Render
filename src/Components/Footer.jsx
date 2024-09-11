import { AppBar, Typography } from '@mui/material'

export function FooterPrueba() {
  return (
    <AppBar
      position='fixed'
      sx={{
        padding: 2,
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: 60,
        top: 'auto',
        bottom: 0,
        width: '100%',
        boxShadow: 'none'
      }}
    >
      <Typography variant='body1' align='center' sx={{ color: 'black' }}>
        &copy; {new Date().getFullYear()} MG CERTIFICA. Todos los derechos reservados.
      </Typography>
    </AppBar>
  )
}
