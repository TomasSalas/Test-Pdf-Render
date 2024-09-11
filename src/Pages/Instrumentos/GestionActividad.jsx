import { useEffect, useState } from 'react'
import { Backdrop, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import PermanentDrawerLeft from '../../Components/Drawer'
import { useTheme } from '@mui/material/styles'
import { toast, Toaster } from 'sonner'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { RegistrarActividad } from '../../Functions/RegistrarActividad'
import { ListarActividad } from '../../Functions/ListarActividad'
import { FormatDate } from '../../Helpers/FormatDate'

export const GestionActividad = () => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = useState(false)
  const [actividad, setActividad] = useState([])
  const { handleSubmit, register, watch, setValue, reset, formState: { errors } } = useForm()

  const navigate = useNavigate()

  let Role = ''
  let Nombre = ''

  const storedData = localStorage.getItem('userData')

  if (storedData) {
    const parsedData = JSON.parse(storedData)
    Nombre = parsedData.state.name
    Role = parsedData.state.rol
  }

  const codigo = watch('CODIGO') || ''

  const crearActividad = async (e) => {
    setOpen(true)
    try {
      const { error, message } = await RegistrarActividad(e)
      if (!error) {
        reset()
        toast.success(message, { duration: 1000 })
        listarActividad()
      } else {
        toast.error(message, { duration: 1000 })
      }
    } finally {
      setOpen(false)
    }
  }

  const listarActividad = async () => {
    const { error, message, result } = await ListarActividad()
    if (!error) {
      setActividad(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  useEffect(() => {
    setValue('CODIGO', codigo.toUpperCase())
  }, [codigo])

  useEffect(() => {
    if (Role === '2') {
      if (!isTokenValid()) {
        navigate('/')
      } else {
        listarActividad()
      }
    } else {
      localStorage.removeItem('userData')
      localStorage.removeItem('token')
      navigate('/')
    }
  }, [navigate])

  return (
    <>
      <Toaster richColors />
      <PermanentDrawerLeft Nombre={Nombre} Role={Role} />
      <Box
        sx={{
          paddingTop: 10,
          paddingLeft: isMdUp ? 28 : 2,
          paddingRight: 2,
          paddingBottom: 2
        }}
      >
        <Box className='boxTitulo' component={Paper} sx={{ padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Gestión Actividad</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, padding: 2 }}>
          <Typography variant='h6' sx={{ fontSize: '14px' }}> Formulario Ingreso Actividad</Typography>
          <form onSubmit={handleSubmit(crearActividad)}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <TextField size='small' fullWidth error={!!errors.CODIGO} helperText={errors.CODIGO ? 'El código es requerido' : ' '} label='Código Actividad' {...register('CODIGO', { required: true })} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <TextField minRows={8} maxRows={8} size='small' multiline fullWidth error={!!errors.DESC} helperText={errors.DESC ? 'La descripción es requerida' : ' '} label='Descripción Actividad' {...register('DESC', { required: true })} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <Button type='submit' variant='outlined' color='success'> Crear Actividad </Button>
            </Box>
          </form>
        </Box>
        {actividad.length > 0 && (
          <Box component={Paper} sx={{ marginTop: 2 }}>
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>CÓDIGO ACTIVIDAD</TableCell>
                    <TableCell>DESCRIPCIÓN ACTIVIDAD</TableCell>
                    <TableCell>FECHA ACTIVIDAD</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {actividad.sort((a, b) => b.codActividad.localeCompare(a.codActividad)).map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell> {item.codActividad}</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}> {item.descActividad}</TableCell>
                        <TableCell> {FormatDate(item.fechaCreacionActividad)}</TableCell>
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
    </>
  )
}
