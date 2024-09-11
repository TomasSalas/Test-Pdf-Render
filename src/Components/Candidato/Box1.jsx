/* eslint-disable indent */
import { Backdrop, Box, Button, CircularProgress, Container, Paper, Skeleton, TextField, Typography } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { FormatRut } from '../../Helpers/FormatRut'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import moment from 'moment'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { EditarInformacion } from '../../Functions/EditarInformacion'
import { toast } from 'sonner'

export const Box1 = ({ informacion, data, handleSiguiente, idUsuario }) => {
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

  const { control, handleSubmit } = useForm()
  const [isEditable, setIsEditable] = useState(false)
  const [open, setOpen] = useState(false)
  const handleEditToggle = () => {
    setIsEditable((prev) => !prev)
  }

  const onSubmit = async (formData) => {
    setOpen(true)
    try {
      const { error, message } = await EditarInformacion(formData, idUsuario)
      if (!error) {
        toast.success(message)
        informacion()
      } else {
        toast.error(message)
      }
      setIsEditable(false)
    } finally {
      setOpen(false)
    }
  }

  const shouldShowContinueButton = () => {
    const instrumento1 = data[0].infoInstrumento?.codInstrumento1
    const instrumento2 = data[0].infoInstrumento?.codInstrumento2
    const pct = data[0].infoValidacion?.estadoECT
    const ep = data[0].infoValidacion?.estadoEP
    const aceptaCondicionesPCT = data[0].infoValidacion?.condiciones_ECT
    const aceptaCondicionesEP = data[0].infoValidacion?.condiciones_EP
    const idProcesoDigitado = data[0]?.infoProcesoDigitado?.idProcesoDigitado

    // console.log(instrumento1, instrumento2, pct, ep, aceptaCondicionesPCT, aceptaCondicionesEP)

    if ((instrumento1 === 'ECT' && instrumento2 === 'EP' && !aceptaCondicionesPCT && ep === 'EP REALIZADA COMPLETAMENTE') ||
      (instrumento1 === 'EP' && instrumento2 === 'ECT' && !aceptaCondicionesEP && pct === 'ECT REALIZADA COMPLETAMENTE')) {
      return false
    }

    if ((instrumento1 === 'ECT' && instrumento2 === 'EP' && !aceptaCondicionesPCT && ep === 'EP REALIZADA COMPLETAMENTE') ||
      (instrumento1 === 'ECT' && instrumento2 === 'EP' && !aceptaCondicionesEP && pct === 'ECT REALIZADA COMPLETAMENTE')) {
      return false
    }

    if ((aceptaCondicionesPCT === null || aceptaCondicionesEP === null) && instrumento2 !== null && idProcesoDigitado !== null) {
      // console.log('Todo Null')
      return false
    }

    if ((instrumento1 === 'ECT' && (pct === 'ECT NO REALIZADA' || pct === 'ECT REALIZADA PARCIALMENTE') && aceptaCondicionesPCT === false) ||
      (instrumento2 === 'ECT' && (pct === 'ECT NO REALIZADA' || pct === 'ECT REALIZADA PARCIALMENTE') && aceptaCondicionesPCT === false) ||
      (instrumento1 === 'EP' && (ep === 'EP NO REALIZADA' || ep === 'EP REALIZADA PARCIALMENTE') && aceptaCondicionesEP === false) ||
      (instrumento2 === 'EP' && (ep === 'EP NO REALIZADA' || ep === 'EP REALIZADA PARCIALMENTE') && aceptaCondicionesEP === false)) {
      // console.log('Todo Null 2')
      return true
    }

    if (instrumento2 === null && (
      (instrumento1 === 'ECT' && (pct === 'EP NO REALIZADA' || pct === 'ECT REALIZADA PARCIALMENTE') && aceptaCondicionesPCT) ||
      (instrumento1 === 'EP' && (ep === 'EP NO REALIZADA' || ep === 'EP REALIZADA PARCIALMENTE') && aceptaCondicionesEP !== null && aceptaCondicionesEP)
    )) {
      // console.log('Todo Null 3')
      return true
    }

    if (instrumento2 === null && (
      (instrumento1 === 'ECT' && pct === 'ECT REALIZADA COMPLETAMENTE') ||
      (instrumento1 === 'EP' && ep === 'EP REALIZADA COMPLETAMENTE')
    )) {
      // console.log('Todo Null 4')
      return false
    }

    if ((instrumento1 === 'ECT' || instrumento2 === 'ECT') && pct === 'ECT REALIZADA COMPLETAMENTE' &&
      (instrumento1 === 'EP' || instrumento2 === 'EP') && ep === 'EP REALIZADA COMPLETAMENTE') {
      // console.log('Todo Null 5')
      return false
    }

    if ((instrumento1 === 'ECT' && pct === 'ECT REALIZADA COMPLETAMENTE') ||
      (instrumento2 === 'ECT' && pct === 'ECT REALIZADA COMPLETAMENTE') ||
      (instrumento1 === 'EP' && ep === 'EP REALIZADA COMPLETAMENTE') ||
      (instrumento2 === 'EP' && ep === 'EP REALIZADA COMPLETAMENTE')) {
      // console.log('Todo Null 6')
      return true
    }

    if (aceptaCondicionesPCT === null && aceptaCondicionesEP === null) {
      // console.log('Todo Null 7')
      return true
    }

    if (aceptaCondicionesPCT === true && aceptaCondicionesEP === true &&
      (pct === 'ECT NO REALIZADA' || pct === 'ECT REALIZADA PARCIALMENTE' || ep === 'EP NO REALIZADA' || ep === 'EP REALIZADA PARCIALMENTE')) {
      // console.log('Todo Null 8')
      return true
    }

    return false
  }

  return (
    <>
      <Container maxWidth='xl'>
        {data.length > 0
          ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant='h4' sx={{ fontWeight: 'bold' }}>Bienvenido {data[0]?.infoUsuario?.nombreUsuario + ' ' + data[0]?.infoUsuario?.apellidoUsuario}.</Typography>
            </Box>
          )
          : (

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <Skeleton variant='rounded' sx={{ width: '100%' }} />
            </Box>
          )}

        {data.length > 0
          ? (
            <Box component={Paper} sx={{ padding: 2, marginTop: 2 }}>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography variant='h4' sx={{ fontWeight: 'bold', fontSize: 25, color: '#d00000' }}>
                  Confirmar información
                </Typography>
              </Box>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ marginTop: 3, width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-start', gap: 1 }}>
                  <Controller
                    name='nombreUsuario'
                    control={control}
                    defaultValue={data[0]?.infoUsuario?.nombreUsuario || ''}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size='small'
                        variant='outlined'
                        label='Nombre'
                        InputProps={{ sx: { fontSize: 18 }, disabled: !isEditable }}
                      />
                    )}
                  />
                  <Controller
                    name='apellidoUsuario'
                    control={control}
                    defaultValue={data[0]?.infoUsuario?.apellidoUsuario || ''}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size='small'
                        variant='outlined'
                        label='Apellido'
                        InputProps={{ sx: { fontSize: 18 }, disabled: !isEditable }}
                      />
                    )}
                  />
                  <Controller
                    name='runUsuario'
                    control={control}
                    defaultValue={data[0] ? FormatRut(data[0].infoUsuario?.runUsuario) || '-' : '-'}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size='small'
                        variant='outlined'
                        label='Run'
                        InputProps={{ sx: { fontSize: 18 }, disabled: true }}
                      />
                    )}
                  />
                  <Controller
                    name='ciudadUsuario'
                    control={control}
                    defaultValue={data[0]?.infoUsuario?.ciudadUsuario || '-'}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size='small'
                        variant='outlined'
                        label='Ciudad'
                        InputProps={{ sx: { fontSize: 18 }, disabled: !isEditable }}
                      />
                    )}
                  />
                  <Controller
                    name='regionUsuario'
                    control={control}
                    defaultValue={data[0]?.infoUsuario?.regionUsuario || '-'}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size='small'
                        variant='outlined'
                        label='Región'
                        InputProps={{ sx: { fontSize: 18 }, disabled: !isEditable }}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ marginTop: 2, width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-start', gap: 1 }}>
                  <Controller
                    name='emailUsuario'
                    control={control}
                    defaultValue={data[0]?.infoUsuario?.emailUsuario || '-'}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size='small'
                        variant='outlined'
                        label='Email'
                        InputProps={{ sx: { fontSize: 18 }, disabled: !isEditable }}
                      />
                    )}
                  />
                  <Controller
                    name='telefonoUsuario'
                    control={control}
                    defaultValue={data[0]?.infoUsuario?.telefonoUsuario || '-'}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size='small'
                        variant='outlined'
                        label='Teléfono'
                        InputProps={{ sx: { fontSize: 18 }, disabled: !isEditable }}
                      />
                    )}
                  />
                  <Controller
                    name='nombreCliente'
                    control={control}
                    defaultValue={data[0]?.infoCliente?.nombreCliente || '-'}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size='small'
                        variant='outlined'
                        label='Empresa'
                        InputProps={{ sx: { fontSize: 18 }, disabled: true }}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ marginTop: 2, width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-start', gap: 1 }}>
                  <Controller
                    name='areaUsuario'
                    control={control}
                    defaultValue={data[0]?.infoUsuario?.areaUsuario || '-'}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size='small'
                        variant='outlined'
                        label='Área'
                        InputProps={{ sx: { fontSize: 18 }, disabled: true }}
                      />
                    )}
                  />

                  <Controller
                    name='generoUsuario'
                    control={control}
                    defaultValue={data[0]?.infoUsuario?.generoUsuario
                      ? data[0].infoUsuario.generoUsuario.charAt(0).toUpperCase() + data[0].infoUsuario.generoUsuario.slice(1)
                      : '-'}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size='small'
                        variant='outlined'
                        label='Genero'
                        InputProps={{ sx: { fontSize: 18 }, disabled: !isEditable }}
                      />
                    )}
                  />
                  <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='es'>
                    <Controller
                      name='fechaNacimientoUsuario'
                      control={control}
                      defaultValue={moment.utc(data[0].infoUsuario.fechaNacimientoUsuario) || null}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label='Fecha Nacimiento'
                          format='DD/MM/YYYY'
                          sx={{ width: '100%' }}
                          slotProps={{
                            textField: {
                              variant: 'outlined',
                              fullWidth: true,
                              size: 'small',
                              InputProps: { sx: { fontSize: 18 }, disabled: !isEditable }
                            }
                          }}
                          value={field.value || undefined}
                          onChange={(date) => field.onChange(date)}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Box>

                <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  {isEditable && (<Button variant='contained' color='success' type='submit'>Guardar</Button>)}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  {!isEditable && (<Button variant='contained' color='error' type='button' onClick={handleEditToggle}>Editar</Button>)}
                </Box>
              </form>

            </Box>
          )
          : (
            <Box component={Paper} sx={{ padding: 2, marginTop: 5 }}>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Skeleton variant='text' sx={{ fontSize: 25, width: '100%' }} />
              </Box>

              <form>
                <Box sx={{ marginTop: 3, width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-start', gap: 1 }}>
                  <Skeleton variant='rectangular' sx={{ fontSize: 25, width: '100%' }} />
                  <Skeleton variant='rectangular' sx={{ fontSize: 25, width: '100%' }} />
                  <Skeleton variant='rectangular' sx={{ fontSize: 25, width: '100%' }} />
                  <Skeleton variant='rectangular' sx={{ fontSize: 25, width: '100%' }} />
                  <Skeleton variant='rectangular' sx={{ fontSize: 25, width: '100%' }} />
                </Box>

                <Box sx={{ marginTop: 2, width: '100%', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-start', gap: 1 }}>
                  <Skeleton variant='rectangular' sx={{ fontSize: 25, width: '100%' }} />
                  <Skeleton variant='rectangular' sx={{ fontSize: 25, width: '100%' }} />
                  <Skeleton variant='rectangular' sx={{ fontSize: 25, width: '100%' }} />
                </Box>

                <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Skeleton variant='rounded' width={80} height={30} />
                </Box>
              </form>
            </Box>
          )}

        {data.length > 0
          ? (
            <>
              <Box component={Paper} sx={{ padding: 2, marginTop: 5 }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                  <Typography variant='h4' sx={{ fontWeight: 'bold', fontSize: 25, color: '#d00000' }}>
                    Evaluaciones
                  </Typography>
                </Box>
                <Box sx={{ marginTop: 3, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 4 }}>
                  {data[0]?.instrumento1 !== null && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                      <Box sx={{ width: '100%' }}>
                        <TextField
                          fullWidth
                          variant='standard'
                          value={data[0] ? (data[0].infoInstrumento?.codInstrumento1 === 'ECT' ? 'Evaluación Conocimiento Teórico' : 'Encuesta de Percepción') : '-'}
                          InputLabelProps={{
                            shrink: true
                          }}
                          InputProps={{
                            readOnly: true,
                            disableUnderline: true,
                            sx: {
                              fontSize: 20,
                              fontWeight: 'bold'
                            }
                          }}
                        />
                        {
                          (data[0].infoInstrumento?.codInstrumento1 === 'ECT'
                            ? (
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ color: 'gray', fontSize: 12 }}> Preguntas {data[0].infoValidacion.cantidadPreguntasInstrumentoECT} - Tiempo 120 minutos</Typography>
                                <Typography sx={{ color: 'gray', fontSize: 12 }}> {data[0].infoValidacion.cantidadECTRespondidas} de {data[0].infoValidacion.cantidadPreguntasInstrumentoECT} Preguntas contestadas - {data[0].infoValidacion.porcentajeECTRespondida}% Completado </Typography>
                              </Box>
                            )
                            : (
                              <Box>
                                <Typography sx={{ color: 'gray', fontSize: 12 }}> Preguntas {data[0].infoValidacion.cantidadPreguntasInstrumentoEP} - Tiempo 60 minutos</Typography>
                                <Typography sx={{ color: 'gray', fontSize: 12 }}> {data[0].infoValidacion.cantidadEPRespondidas} de {data[0].infoValidacion.cantidadPreguntasInstrumentoEP} {data[0].infoValidacion.porcentajeEPRespondida}% Completado </Typography>
                              </Box>
                            )
                          )
                        }
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '30%' }}>
                        {
                          (data[0].infoInstrumento?.codInstrumento1 === 'ECT'
                            ? (
                              <>
                                {data[0].infoValidacion?.estadoECT === 'ECT NO REALIZADA'
                                  ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                      <Typography sx={{ color: 'gray', fontSize: 12, fontWeight: 'bold' }}>
                                        {data[0].infoValidacion?.estadoECT}
                                      </Typography>
                                      <CloseIcon color='error' />
                                    </Box>
                                  )
                                  : data[0].infoValidacion?.estadoECT === 'ECT REALIZADA PARCIALMENTE'
                                    ? (
                                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography sx={{ color: 'gray', fontSize: 12, fontWeight: 'bold' }}>
                                          {data[0].infoValidacion?.estadoECT}
                                        </Typography>
                                        <HourglassBottomIcon color='warning' />
                                      </Box>
                                    )
                                    : (
                                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography sx={{ color: 'gray', fontSize: 12, fontWeight: 'bold' }}>
                                          {data[0].infoValidacion?.estadoECT}
                                        </Typography>
                                        <CheckIcon color='success' />
                                      </Box>
                                    )}
                              </>)
                            : (
                              <>
                                {data[0].infoValidacion?.estadoEP === 'EP NO REALIZADA'
                                  ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                      <Typography sx={{ color: 'gray', fontSize: 12, fontWeight: 'bold' }}>
                                        {data[0].infoValidacion?.estadoEP}
                                      </Typography>
                                      <CloseIcon color='error' />
                                    </Box>)
                                  : data[0].infoValidacion?.estadoEP === 'EP REALIZADA PARCIALMENTE'
                                    ? (
                                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography sx={{ color: 'gray', fontSize: 12, fontWeight: 'bold' }}>
                                          {data[0].infoValidacion?.estadoEP}
                                        </Typography>
                                        <HourglassBottomIcon color='warning' />
                                      </Box>
                                    )
                                    : (
                                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography sx={{ color: 'gray', fontSize: 12, fontWeight: 'bold' }}>
                                          {data[0].infoValidacion?.estadoEP}
                                        </Typography>
                                        <CheckIcon color='success' />
                                      </Box>
                                    )}
                              </>)
                          )
                        }
                      </Box>
                    </Box>
                  )}

                  {data[0].infoInstrumento?.codInstrumento2 !== null && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                      <Box sx={{ width: '100%' }}>
                        <TextField
                          fullWidth
                          variant='standard'
                          value={data[0] ? (data[0]?.instrumento2 === 'ECT' ? 'Evaluación Conocimiento Teórico' : 'Encuesta de Percepción') : '-'}
                          InputLabelProps={{
                            shrink: true
                          }}
                          InputProps={{
                            readOnly: true,
                            disableUnderline: true,
                            sx: {
                              fontSize: 20,
                              fontWeight: 'bold'
                            }
                          }}
                        />
                        {
                          (data[0].infoInstrumento?.codInstrumento2 === 'ECT'
                            ? (
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ color: 'gray', fontSize: 12 }}> Preguntas {data[0].infoValidacion.cantidadPreguntasInstrumentoECT} - Tiempo 120 minutos</Typography>
                                <Typography sx={{ color: 'gray', fontSize: 12 }}> {data[0].infoValidacion.cantidadECTRespondidas} de {data[0].infoValidacion.cantidadPreguntasInstrumentoECT} {data[0].infoValidacion.porcentajeECTRespondida}% Completado </Typography>
                              </Box>
                            )
                            : (
                              <Box>
                                <Typography sx={{ color: 'gray', fontSize: 12 }}> Preguntas {data[0].infoValidacion.cantidadPreguntasInstrumentoEP} - Tiempo 60 minutos</Typography>
                                <Typography sx={{ color: 'gray', fontSize: 12 }}> {data[0].infoValidacion.cantidadEPRespondidas} de {data[0].infoValidacion.cantidadPreguntasInstrumentoEP} Preguntas contestadas - {data[0].infoValidacion.porcentajeEPRespondida}% Completado </Typography>
                              </Box>
                            )
                          )
                        }
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '30%' }}>
                        {
                          (data[0].infoInstrumento?.codInstrumento2 === 'ECT'
                            ? (
                              <>
                                {data[0].infoValidacion?.estadoECT === 'ECT NO REALIZADA'
                                  ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                      <Typography sx={{ color: 'gray', fontSize: 12, fontWeight: 'bold' }}>
                                        {data[0].infoValidacion?.estadoECT}
                                      </Typography>
                                      <CloseIcon color='error' />
                                    </Box>)
                                  : data[0].infoValidacion?.estadoECT === 'ECT REALIZADA PARCIALMENTE'
                                    ? (
                                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography sx={{ color: 'gray', fontSize: 12, fontWeight: 'bold' }}>
                                          {data[0].infoValidacion?.estadoECT}
                                        </Typography>
                                        <HourglassBottomIcon color='warning' />
                                      </Box>
                                    )
                                    : (
                                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography sx={{ color: 'gray', fontSize: 12, fontWeight: 'bold' }}>
                                          {data[0].infoValidacion?.estadoECT}
                                        </Typography>
                                        <CheckIcon color='success' />
                                      </Box>)}
                              </>)
                            : (
                              <>
                                {data[0].infoValidacion?.estadoEP === 'EP NO REALIZADA'
                                  ? (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                      <Typography sx={{ color: 'gray', fontSize: 12, fontWeight: 'bold' }}>
                                        {data[0].infoValidacion?.estadoEP}
                                      </Typography>
                                      <CloseIcon color='error' />
                                    </Box>)
                                  : data[0].infoValidacion?.estadoEP === 'EP REALIZADA PARCIALMENTE'
                                    ? (
                                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography sx={{ color: 'gray', fontSize: 12, fontWeight: 'bold' }}>
                                          {data[0].infoValidacion?.estadoEP}
                                        </Typography>
                                        <HourglassBottomIcon color='warning' />
                                      </Box>
                                    )
                                    : (
                                      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <Typography sx={{ color: 'gray', fontSize: 12, fontWeight: 'bold' }}>
                                          {data[0].infoValidacion?.estadoEP}
                                        </Typography>
                                        <CheckIcon color='success' />
                                      </Box>)}
                              </>)
                          )
                        }
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
              {
                shouldShowContinueButton() && (
                  <Box sx={{ top: 'auto', bottom: 0, marginTop: 2, display: 'flex', flexDirection: 'row', gap: 2, mb: { xs: 10 } }}>
                    <Button variant='contained' size='large' color='error' sx={{ fontWeight: 'bold' }} onClick={handleSiguiente} endIcon={<ArrowForwardIcon />}>
                      Continuar
                    </Button>
                  </Box>
                )
              }
            </>

          )
          : (
            <Box component={Paper} sx={{ padding: 2, marginTop: 5 }}>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
                <Skeleton variant='text' sx={{ fontSize: 25, width: '100%' }} />
              </Box>

              <Box sx={{ marginTop: 3, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 4 }}>
                <Skeleton variant='rectangular' sx={{ height: 100 }} />
                <Skeleton variant='rectangular' sx={{ height: 100 }} />
              </Box>
            </Box>
          )}

      </Container>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='error' />
      </Backdrop>
    </>
  )
}
