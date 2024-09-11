import { useEffect, useState } from 'react'
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import PermanentDrawerLeft from '../../Components/Drawer'
import { useTheme } from '@mui/material/styles'
import { toast, Toaster } from 'sonner'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { ListarUcls } from '../../Functions/ListarUcls'
import { RegistrarInstrumento } from '../../Functions/RegistrarInstrumento'
import { ListarInstrumento } from '../../Functions/ListarInstrumento'

export const GestionInstrumentos = () => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = useState(false)
  const { handleSubmit, register, watch, setValue, reset, control, formState: { errors } } = useForm()
  const [ucls, setUcls] = useState([])
  const [instrumentos, setInstrumentos] = useState([])

  const navigate = useNavigate()

  let Role = ''
  let Nombre = ''

  const storedData = localStorage.getItem('userData')

  if (storedData) {
    const parsedData = JSON.parse(storedData)
    Nombre = parsedData.state.name
    Role = parsedData.state.rol
  }

  const listarUcls = async () => {
    const { error, message, result } = await ListarUcls()
    if (!error) {
      setUcls(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const listarInstrumentos = async () => {
    const { error, message, result } = await ListarInstrumento()
    if (!error) {
      setInstrumentos(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const crearInstrumento = async (e) => {
    setOpen(true)
    try {
      const { error, message } = await RegistrarInstrumento(e)
      if (!error) {
        reset()
        toast.success(message, { duration: 1000 })
        listarInstrumentos()
      } else {
        toast.error(message, { duration: 1000 })
      }
    } finally {
      setOpen(false)
    }
  }

  const codigo = watch('CODIGO') || ''
  const nombre = watch('NOMBRE') || ''

  useEffect(() => {
    setValue('CODIGO', codigo.toUpperCase())
    setValue('NOMBRE', nombre.toUpperCase())
  }, [codigo, nombre])

  useEffect(() => {
    setOpen(false)
    if (Role === '2') {
      if (!isTokenValid()) {
        navigate('/')
      } else {
        listarUcls()
        listarInstrumentos()
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
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Gestión Instrumentos</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, padding: 2 }}>
          <Typography variant='h6' sx={{ fontSize: '14px' }}> Formulario Ingreso Perfiles</Typography>
          <form onSubmit={handleSubmit(crearInstrumento)}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <TextField size='small' fullWidth error={!!errors.CODIGO} helperText={errors.CODIGO ? 'El código es requerido' : ' '} label='Código Instrumento' {...register('CODIGO', { required: true })} />
              <TextField size='small' fullWidth error={!!errors.NOMBRE} helperText={errors.NOMBRE ? 'El nombre es requerido' : ' '} label='Nombre Instrumento' {...register('NOMBRE', { required: true })} />
              <Controller
                name='UCL'
                control={control}
                defaultValue={null}
                rules={{ required: 'La ucl es requerida' }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={ucls || []}
                    getOptionLabel={(option) => option.codUcl + ' | ' + option.descUcl}
                    isOptionEqualToValue={(option, value) => option.idUcl === value.idUcl}
                    onChange={(event, value) => {
                      field.onChange(value)
                    }}
                    sx={{ width: '100%' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size='small'
                        label='Ucl'
                        error={!!errors.UCL}
                        helperText={errors.UCL ? errors.UCL.message : ' '}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <Button type='submit' variant='outlined' color='success'> Crear Instrumento </Button>
            </Box>
          </form>
        </Box>

        {instrumentos.length > 0 && (
          <Box component={Paper} sx={{ marginTop: 2 }}>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>ID INSTRUMENTO</TableCell>
                    <TableCell>COD INSTRUMENTO</TableCell>
                    <TableCell>NOMBRE INSTRUMENTO</TableCell>
                    <TableCell>NOMBRE UCL</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {instrumentos.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{item.idInstrumento}</TableCell>
                        <TableCell>{item.codInstrumento}</TableCell>
                        <TableCell>{item.descInstrumento}</TableCell>
                        <TableCell>{item.descUcl}</TableCell>
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
