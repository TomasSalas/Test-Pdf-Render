import { useEffect, useState } from 'react'
import { Paper, Typography, Box, Button, TextField, useMediaQuery, Backdrop, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import PermanentDrawerLeft from '../../Components/Drawer'
import 'boxicons'
import { useTheme } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { toast, Toaster } from 'sonner'
import { RegistrarSucursal } from '../../Functions/RegistrarSucursal'
import { ListarSucursal } from '../../Functions/ListarSucursal'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'

export const GestionSucursal = () => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const { handleSubmit, register, reset, formState: { errors } } = useForm()
  const [open, setOpen] = useState(false)
  const [sucursal, setSucursal] = useState([])
  const navigate = useNavigate()

  let Role = ''
  let Nombre = ''

  const storedData = window.localStorage.getItem('userData')

  if (storedData) {
    const parsedData = JSON.parse(storedData)
    Nombre = parsedData.state.name
    Role = parsedData.state.rol
  }

  const registerMutuaria = async (e) => {
    setOpen(true)
    try {
      const { error, message } = await RegistrarSucursal(e)
      if (!error) {
        toast.success(message, { duration: 1000 })
        listarSucursal()
        reset()
      } else {
        toast.error(message, { duration: 1000 })
      }
    } finally {
      setOpen(false)
    }
  }

  const listarSucursal = async () => {
    const { error, result, message } = await ListarSucursal()
    if (!error) {
      setSucursal(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  useEffect(() => {
    listarSucursal()
  }, [])

  useEffect(() => {
    if (Role === '5') {
      if (!isTokenValid()) {
        navigate('/')
      }
    } else {
      window.localStorage.removeItem('userData')
      window.localStorage.removeItem('token')
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
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Gestión Sucursal</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, padding: 2 }}>
          <Typography variant='h6' sx={{ fontSize: '14px' }}> Formulario Ingreso Sucursal Cliente</Typography>
          <form onSubmit={handleSubmit(registerMutuaria)}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, marginTop: 2 }}>
              <TextField size='small' fullWidth error={!!errors.NOMBRE} helperText={errors.NOMBRE ? 'El o los nombres es requerido' : ' '} label='Nombre Sucursal' {...register('NOMBRE', { required: true })} />
            </Box>
            <Box sx={{ marginTop: 1 }}>
              <Button type='submit' color='success' variant='outlined'>Guardar Sucursal</Button>
            </Box>
          </form>
        </Box>
        {sucursal.length > 0 && (
          <Box sx={{ marginTop: 2 }} component={Paper}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell> # </TableCell>
                    <TableCell> NOMBRE SUCURSAL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sucursal.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.descSucursal}</TableCell>
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
