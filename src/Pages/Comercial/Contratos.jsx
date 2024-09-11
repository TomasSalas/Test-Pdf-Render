import { Autocomplete, Backdrop, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import PermanentDrawerLeft from '../../Components/Drawer'
import { useEffect, useState } from 'react'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'
import { toast, Toaster } from 'sonner'
import { ListarContratos } from '../../Functions/ListarContratos'
import { Controller, useForm } from 'react-hook-form'
import moment from 'moment'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { ListarClientes } from '../../Functions/ListarClientes'
import { RegistrarContratos } from '../../Functions/RegistrarContratos'

export function Contrato() {
  moment.updateLocale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_'),
    week: {
      dow: 1
    }
  })

  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const navigate = useNavigate()
  const [contrato, setContratos] = useState([])
  const [cliente, setClientes] = useState([])
  const [open, setOpen] = useState(false)

  const { handleSubmit, control, register, reset, watch, setValue, formState: { errors } } = useForm()

  let Role = ''
  let Nombre = ''

  const storedData = localStorage.getItem('userData')

  if (storedData) {
    const parsedData = JSON.parse(storedData)
    Nombre = parsedData.state.name
    Role = parsedData.state.rol
  }

  const listarContrato = async () => {
    const { error, result, message } = await ListarContratos()
    if (!error) {
      setContratos(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const listarCliente = async () => {
    const { error, result, message } = await ListarClientes()
    if (!error) {
      setClientes(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const crearContrato = async (e) => {
    setOpen(true)
    try {
      const { error, message } = await RegistrarContratos(e)
      if (!error) {
        reset()
        listarContrato()
        toast.success(message)
      } else {
        toast.error(message)
      }
    } finally {
      setOpen(false)
    }
  }

  const desc = watch('DESC') || ''

  useEffect(() => {
    setValue('DESC', desc.toUpperCase())
  }, [desc])

  useEffect(() => {
    if (Role === '5') {
      if (!isTokenValid()) {
        navigate('/')
      } else {
        listarContrato()
        listarCliente()
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
      <Box sx={{
        paddingTop: 10,
        paddingLeft: isMdUp ? 28 : 2,
        paddingRight: 2,
        paddingBottom: 2
      }}
      >
        <Box className='boxTitulo' component={Paper} sx={{ padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Gestión Contratos</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, display: 'flex', flexDirection: 'column' }}>
          <Box component={Paper} sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
            <form onSubmit={handleSubmit(crearContrato)}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
                <Controller
                  name='CLIENTE'
                  control={control || []}
                  defaultValue={null}
                  rules={{ required: 'La actividad es requerida' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={cliente}
                      getOptionLabel={(option) => option.nombreCliente}
                      isOptionEqualToValue={(option, value) => option.idCliente === value.idCliente}
                      onChange={(event, value) => {
                        field.onChange(value)
                      }}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          label='Cliente'
                          error={!!errors.CLIENTE}
                          helperText={errors.CLIENTE ? errors.CLIENTE.message : ' '}
                        />
                      )}
                    />
                  )}
                />
                <TextField size='small' fullWidth error={!!errors.DESC} helperText={errors.DESC ? 'La descripción es requerida' : ' '} label='Descripción contrato' {...register('DESC', { required: true })} />

              </Box>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
                <TextField size='small' fullWidth type='number' error={!!errors.CANTIDAD_CANDIDATO} helperText={errors.CANTIDAD_CANDIDATO ? 'La Cantidad es requerida' : ' '} label='Cantidad de Candidatos' {...register('CANTIDAD_CANDIDATO', { required: true })} />

                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='es'>
                  <Controller
                    name='FECHA_INICIO'
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label='Fecha Inicio'
                        format='DD/MM/YYYY'
                        sx={{ width: '100%' }}
                        error={!!errors.fecha_pct}
                        helperText={errors.FECHA_INICIO ? errors.FECHA_INICIO.message : ' '}
                        slotProps={{
                          textField: {
                            error: !!errors.FECHA_INICIO,
                            helperText: errors.FECHA_INICIO ? errors.FECHA_INICIO.message : ' ',
                            size: 'small'
                          }
                        }}
                      />
                    )}
                  />
                  <Controller
                    name='FECHA_TERMINO'
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label='Fecha Termino'
                        format='DD/MM/YYYY'
                        sx={{ width: '100%' }}
                        error={!!errors.fecha_pct}
                        helperText={errors.FECHA_TERMINO ? errors.FECHA_TERMINO.message : ' '}
                        slotProps={{
                          textField: {
                            error: !!errors.FECHA_TERMINO,
                            helperText: errors.FECHA_TERMINO ? errors.FECHA_TERMINO.message : ' ',
                            size: 'small'
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
                <Button type='submit' variant='outlined' color='success'> Crear Contrato </Button>
              </Box>
            </form>
          </Box>
        </Box>
        <Box component={Paper} sx={{ marginTop: 2 }}>
          <TableContainer component={Paper} sx={{ maxHeight: '500px' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: '#f5f1f1' }}> CLIENTE</TableCell>
                  <TableCell sx={{ backgroundColor: '#f5f1f1' }}> CONTRATO </TableCell>
                  <TableCell sx={{ backgroundColor: '#f5f1f1' }}> CANTIDAD CANDIDATOS </TableCell>
                  <TableCell sx={{ backgroundColor: '#f5f1f1' }}> FECHA INICIO</TableCell>
                  <TableCell sx={{ backgroundColor: '#f5f1f1' }}> FECHA TERMINO</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contrato.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell> {item.nombreCliente}</TableCell>
                      <TableCell> {item.descContrato}</TableCell>
                      <TableCell> {item.cantCandidatos}</TableCell>
                      <TableCell> {item.fechaInicioContrato}</TableCell>
                      <TableCell> {item.fechaCreacionContrato}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='error' />
      </Backdrop>
    </>
  )
}
