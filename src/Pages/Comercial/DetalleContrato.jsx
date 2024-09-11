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
import { TipoCobro } from '../../Helpers/Informacion'
import { RegistrarDetalleContratos } from '../../Functions/RegistrarDetalleContratos'
import { ListarDetalleContratos } from '../../Functions/ListarDetalleContratos'
import { ListarTipoProceso } from '../../Functions/ListarTipoProceso'

export function DetalleContrato() {
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
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [tipoProceso, setTipoProceso] = useState([])
  const [idContrato, setIdContrato] = useState([])

  const { handleSubmit, control, watch, setValue, register, formState: { errors } } = useForm()

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

  const listarDetalle = async (id) => {
    setData([])
    const { error, result, message } = await ListarDetalleContratos(id)
    if (!error) {
      setData(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const listarTipo = async () => {
    const { error, result, message } = await ListarTipoProceso()
    if (!error) {
      setTipoProceso(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const crearContrato = async (e) => {
    setOpen(true)
    try {
      const { error, message } = await RegistrarDetalleContratos(e)
      if (!error) {
        listarDetalle(idContrato)
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

  const monto = watch('MONTO') || ''

  useEffect(() => {
    const montoSinSimbolo = monto.replace(/[^0-9.]/g, '')
    const format = montoSinSimbolo
    setValue('MONTO', format)
  }, [monto, setValue])

  useEffect(() => {
    if (Role === '5') {
      if (!isTokenValid()) {
        navigate('/')
      } else {
        listarContrato()
        listarTipo()
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
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Gestión Detalle Contratos</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, display: 'flex', flexDirection: 'column' }}>
          <Box component={Paper} sx={{ padding: 2, display: 'flex', flexDirection: 'column' }}>
            <form onSubmit={handleSubmit(crearContrato)}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
                <Controller
                  name='CONTRATO'
                  control={control}
                  defaultValue={null}
                  rules={{ required: 'El contrato es requerido' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={contrato || []}
                      getOptionLabel={(option) => option.nombreCliente + ' - ' + option.descContrato}
                      isOptionEqualToValue={(option, value) => option.idContrato === value.idContrato}
                      onChange={(event, value) => {
                        field.onChange(value)
                        setValue('TIPO_PROCESO', null)
                        if (value !== null) {
                          setIdContrato(value.idContrato)
                          listarDetalle(value.idContrato)
                        }
                      }}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          label='Contrato'
                          error={!!errors.CONTRATO}
                          helperText={errors.CONTRATO ? errors.CONTRATO.message : ' '}
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name='TIPO_PROCESO'
                  control={control}
                  defaultValue={null}
                  rules={{ required: 'El tipo proceso es requerido' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={tipoProceso || []}
                      getOptionLabel={(option) => option.codTipoProceso}
                      isOptionEqualToValue={(option, value) => option.idTipoProceso === value.idTipoProceso}
                      onChange={(event, value) => {
                        field.onChange(value)
                      }}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          label='Tipo Proceso'
                          error={!!errors.TIPO_PROCESO}
                          helperText={errors.TIPO_PROCESO ? errors.TIPO_PROCESO.message : ' '}
                        />
                      )}
                    />
                  )}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
                <Controller
                  name='TIPO_COBRO'
                  control={control}
                  defaultValue={null}
                  rules={{ required: 'La actividad es requerida' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={TipoCobro || []}
                      getOptionLabel={(option) => option.nombre}
                      isOptionEqualToValue={(option, value) => option.idCobro === value.idCobro}
                      onChange={(event, value) => {
                        field.onChange(value)
                      }}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          label='Tipo Cobro'
                          error={!!errors.TIPO_COBRO}
                          helperText={errors.TIPO_COBRO ? errors.TIPO_COBRO.message : ' '}
                        />
                      )}
                    />
                  )}
                />
                <TextField type='text' size='small' fullWidth error={!!errors.MONTO} helperText={errors.MONTO ? 'El monto es requerido' : ' '} label='Monto' {...register('MONTO', { required: true })} />

              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
                <Button type='submit' variant='outlined' color='success'> Crear Detalle Contrato </Button>
              </Box>
            </form>
          </Box>
        </Box>
        {data.length > 0 && (
          <Box component={Paper} sx={{ marginTop: 2 }}>
            <TableContainer component={Paper} sx={{ maxHeight: '500px' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#f5f1f1' }}> CONTRATO </TableCell>
                    <TableCell sx={{ backgroundColor: '#f5f1f1' }}> TIPO PROCESO</TableCell>
                    <TableCell sx={{ backgroundColor: '#f5f1f1' }}> TIPO DE COBRO</TableCell>
                    <TableCell sx={{ backgroundColor: '#f5f1f1' }}> MONTO</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell> {item.nombreContrato}</TableCell>
                        <TableCell> {item.nombreTipoProceso}</TableCell>
                        <TableCell> {item.tipoCobroDetalleContrato}</TableCell>
                        <TableCell> {item.cantidadDetalleContrato}</TableCell>
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
