import 'boxicons'
import { useEffect, useState } from 'react'
import { Paper, Typography, Box, Button, TextField, useMediaQuery, Backdrop, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import PermanentDrawerLeft from '../../Components/Drawer'
import { useTheme } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { RegistrarMutual } from '../../Functions/RegistrarMutual'
import { toast, Toaster } from 'sonner'
import { ListarMutualidad } from '../../Functions/ListarMutualidad'
import { FormatDate } from '../../Helpers/FormatDate'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'

export function GestionMutuarias() {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const { handleSubmit, register, formState: { errors }, reset } = useForm()
  const [open, setOpen] = useState(false)
  const [mutualidad, setMutualidad] = useState([])
  const navigate = useNavigate()

  let Role = ''
  let Nombre = ''

  const storedData = localStorage.getItem('userData')

  if (storedData) {
    const parsedData = JSON.parse(storedData)
    Nombre = parsedData.state.name
    Role = parsedData.state.rol
  }

  const registerMutuaria = async (e) => {
    setOpen(true)
    try {
      const { error, message } = await RegistrarMutual(e)
      if (!error) {
        reset()
        listarMutuarias()
        toast.success(message, { duration: 1000 })
      } else {
        toast.error(message, { duration: 1000 })
      }
    } finally {
      setOpen(false)
    }
  }
  const listarMutuarias = async () => {
    const { error, result, message } = await ListarMutualidad()
    if (!error) {
      setMutualidad(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  useEffect(() => {
    listarMutuarias()
  }, [])

  useEffect(() => {
    if (Role === '5') {
      if (!isTokenValid()) {
        navigate('/')
      }
    } else {
      localStorage.removeItem('userData')
      localStorage.removeItem('token')
      navigate('/')
    }
  }, [navigate])

  return (
    <Box sx={{ marginBottom: 10 }}>
      <Toaster richColors />
      <PermanentDrawerLeft Nombre={Nombre} Role={Role} />
      <Box
        sx={{
          paddingTop: 12,
          paddingBottom: 12,
          paddingLeft: isMdUp ? 28 : 2,
          paddingRight: 2,
          height: '100vh'
        }}
      >
        <Box className='boxTitulo' component={Paper} sx={{ padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Gestión Mutual</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, padding: 2 }}>
          <Typography variant='h6' sx={{ fontSize: '14px' }}> Formulario Ingreso Mutual</Typography>
          <form onSubmit={handleSubmit(registerMutuaria)}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, marginTop: 2 }}>
              <TextField size='small' fullWidth error={!!errors.NOMBRE} helperText={errors.NOMBRE ? 'El o los nombres es requerido' : ' '} label='Nombre' {...register('NOMBRE', { required: true })} />
              <TextField size='small' fullWidth error={!!errors.DIRECCION} helperText={errors.DIRECCION ? 'El o los apellidos es requerido' : ' '} label='Dirección' {...register('DIRECCION', { required: true })} />
            </Box>
            <Box sx={{ marginTop: 1 }}>
              <Button type='submit' color='success' variant='outlined'>Guardar Mutuaria</Button>
            </Box>
          </form>
        </Box>
        {mutualidad.length > 0 && (
          <Box sx={{ marginTop: 2 }} component={Paper}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell> NOMBRE </TableCell>
                    <TableCell> DIRECCIÓN </TableCell>
                    <TableCell> FECHA CREACIÓN </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mutualidad.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{item.nombreMutualidad}</TableCell>
                        <TableCell>{item.direccionMutualidad ? item.direccionMutualidad : '-'}</TableCell>
                        <TableCell>{item.fechaCreacionMutualidad ? FormatDate(item.fechaCreacionMutualidad) : '-'}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='error' />
      </Backdrop>
    </Box>
  )
}
