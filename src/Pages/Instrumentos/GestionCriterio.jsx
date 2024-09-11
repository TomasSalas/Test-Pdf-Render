import { useEffect, useState } from 'react'
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import PermanentDrawerLeft from '../../Components/Drawer'
import { useTheme } from '@mui/material/styles'
import { toast, Toaster } from 'sonner'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { ListarActividad } from '../../Functions/ListarActividad'
import { RegistrarCriterio } from '../../Functions/RegistrarCriterio'
import { ListarCriterio } from '../../Functions/ListarCriterio'
import { FormatDate } from '../../Helpers/FormatDate'

export const GestionCriterio = () => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = useState(false)
  const [criterio, setCriterio] = useState([])
  const [actividad, setActividad] = useState([])
  const { handleSubmit, register, watch, setValue, reset, control, formState: { errors } } = useForm()

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

  const crearPregunta = async (e) => {
    setOpen(false)
    try {
      const { error, message } = await RegistrarCriterio(e)
      if (!error) {
        reset()
        toast.success(message, { duration: 1000 })
        listarCriterio()
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

  const listarCriterio = async () => {
    const { error, message, result } = await ListarCriterio()
    if (!error) {
      setCriterio(result)
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
        listarCriterio()
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
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Gestión Criterio</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, padding: 2 }}>
          <Typography variant='h6' sx={{ fontSize: '14px' }}> Formulario Ingreso Criterio</Typography>
          <form onSubmit={handleSubmit(crearPregunta)}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <TextField size='small' fullWidth error={!!errors.CODIGO} helperText={errors.CODIGO ? 'El código es requerido' : ' '} label='Código criterio' {...register('CODIGO', { required: true })} />
              <Controller
                name='ACTIVIDAD'
                control={control}
                defaultValue={null}
                rules={{ required: 'La actividad es requerida' }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={actividad || []}
                    getOptionLabel={(option) => option.codActividad + ' | ' + option.descActividad}
                    isOptionEqualToValue={(option, value) => option.idActividad === value.idActividad}
                    onChange={(event, value) => {
                      field.onChange(value)
                    }}
                    sx={{ width: '100%' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size='small'
                        label='Actividad'
                        error={!!errors.ACTIVIDAD}
                        helperText={errors.ACTIVIDAD ? errors.ACTIVIDAD.message : ' '}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <TextField minRows={8} maxRows={8} size='small' multiline fullWidth error={!!errors.DESC} helperText={errors.DESC ? 'La descripción es requerida' : ' '} label='Descripción criterio' {...register('DESC', { required: true })} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <Button type='submit' variant='outlined' color='success'> Crear criterio </Button>
            </Box>
          </form>
        </Box>

        {criterio.length > 0 && (
          <Box component={Paper} sx={{ marginTop: 2 }}>
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>CÓDIGO CRITERIO</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>DESCRIPCIÓN ACTIVIDAD</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>DESCRIPCIÓN CRITERIO</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>FECHA CREACIÓN CRITERIO</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {criterio
                    .sort((a, b) => a.codCriterio.localeCompare(b.codCriterio))
                    .map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell> {item.codCriterio}</TableCell>
                          <TableCell> {item.descActividad}</TableCell>
                          <TableCell> {item.descCriterio}</TableCell>
                          <TableCell> {FormatDate(item.fechaCreacionCriterio)}</TableCell>
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
