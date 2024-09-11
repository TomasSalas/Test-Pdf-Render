import { useEffect, useState } from 'react'
import { Backdrop, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import PermanentDrawerLeft from '../../Components/Drawer'
import { useTheme } from '@mui/material/styles'
import { toast, Toaster } from 'sonner'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { RegistrarPerfil } from '../../Functions/RegistrarPerfil'
import { ListarPerfiles } from '../../Functions/ListarPerfiles'
import { FormatDate } from '../../Helpers/FormatDate'

export const GestionPerfiles = () => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = useState(false)
  const [perfiles, setPerfiles] = useState(false)
  const { handleSubmit, register, reset, watch, setValue, formState: { errors } } = useForm()

  const navigate = useNavigate()

  let Role = ''
  let Nombre = ''

  const storedData = localStorage.getItem('userData')

  if (storedData) {
    const parsedData = JSON.parse(storedData)
    Nombre = parsedData.state.name
    Role = parsedData.state.rol
  }

  const crearPerfil = async (e) => {
    setOpen(true)
    try {
      const { error, message } = await RegistrarPerfil(e)
      if (!error) {
        reset()
        listarPerfiles()
        toast.success(message, { duration: 1000 })
      } else {
        toast.error(message, { duration: 1000 })
      }
    } finally {
      setOpen(false)
    }
  }

  const listarPerfiles = async () => {
    const { error, message, result } = await ListarPerfiles()
    if (!error) {
      setPerfiles(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const codigo = watch('CODIGO') || ''
  const nombre = watch('NOMBRE') || ''

  useEffect(() => {
    setValue('CODIGO', codigo.toUpperCase())
    setValue('NOMBRE', nombre.toUpperCase())
  }, [codigo, nombre])

  useEffect(() => {
    if (Role === '2') {
      if (!isTokenValid()) {
        navigate('/')
      } else {
        listarPerfiles()
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
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Gestión Perfiles</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, padding: 2 }}>
          <Typography variant='h6' sx={{ fontSize: '14px' }}> Formulario Ingreso Perfiles</Typography>
          <form onSubmit={handleSubmit(crearPerfil)}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <TextField size='small' fullWidth error={!!errors.CODIGO} helperText={errors.CODIGO ? 'El código es requerido' : ' '} label='Código Perfil' {...register('CODIGO', { required: true })} />
              <TextField size='small' fullWidth error={!!errors.NOMBRE} helperText={errors.NOMBRE ? 'El nombre es requerido' : ' '} label='Nombre Perfil' {...register('NOMBRE', { required: true })} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <Button type='submit' variant='outlined' color='success'> Crear Perfil </Button>
            </Box>
          </form>
        </Box>
        {perfiles.length > 0 && (
          <Box component={Paper} sx={{ marginTop: 2 }}>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>CÓDIGO PERFIL</TableCell>
                    <TableCell>NOMBRE PERFIL</TableCell>
                    <TableCell>FECHA CREACIÓN</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {perfiles.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{item.codPerfil}</TableCell>
                        <TableCell>{item.descPerfil}</TableCell>
                        <TableCell>{FormatDate(item.fechaCreacionPerfil)}</TableCell>
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
