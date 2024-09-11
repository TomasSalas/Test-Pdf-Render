import { useEffect, useState } from 'react'
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { toast, Toaster } from 'sonner'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { ListarActividad } from '../../Functions/ListarActividad'
import { ListarCriterio } from '../../Functions/ListarCriterio'
import PermanentDrawerLeft from '../../Components/Drawer'
import { ListarInstrumento } from '../../Functions/ListarInstrumento'
import { RegistrarPregunta } from '../../Functions/RegistrarPregunta'

export const GestionDetalleInstrumento = () => {
  const { handleSubmit, control, register, watch, setValue, reset, formState: { errors } } = useForm()
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [actividad, setActividad] = useState([])
  const [criterio, setCriterio] = useState([])
  const [instrumentos, setInstrumentos] = useState([])
  const [preguntas, setPreguntas] = useState([])

  const navigate = useNavigate()

  let Role = ''
  let Nombre = ''

  const storedData = localStorage.getItem('userData')

  if (storedData) {
    const parsedData = JSON.parse(storedData)
    Nombre = parsedData.state.name
    Role = parsedData.state.rol
  }

  const crearDetalleInstrumento = async (e) => {
    setOpen(false)
    setPreguntas(prevPreguntas => {
      const lastNumber = Array.isArray(prevPreguntas) && prevPreguntas.length > 0
        ? prevPreguntas[prevPreguntas.length - 1].NROPREGUNTA || 0
        : 0

      const nuevaPregunta = {
        ...e,
        NROPREGUNTA: lastNumber + 1
      }
      return [...prevPreguntas, nuevaPregunta]
    })

    setValue('ALTERNATIVA', '')
    setValue('BRECHA', '')
    setValue('RECOMENDACION', '')
    setValue('PREGUNTA', '')
    setValue('RESPUESTA', '')
    setValue('REFERENCIA', '')
    setValue('ACTIVIDAD', null)
    setValue('CRITERIO', null)
  }

  const listarActividad = async () => {
    const { error, message, result } = await ListarActividad()
    if (!error) {
      setActividad(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const listarCriterio = async (id) => {
    const { error, message, result } = await ListarCriterio()
    if (!error) {
      const dataFilter = result.filter((item) => item.idActividadCriterio === id)
      setCriterio(dataFilter)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const listarInstrumentos = async (id) => {
    const { error, message, result } = await ListarInstrumento()
    if (!error) {
      setInstrumentos(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }
  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleAccept = async () => {
    setOpenDialog(false)
    setOpen(true)
    try {
      const { error, message } = await RegistrarPregunta(preguntas)
      if (!error) {
        toast.success(message, { duration: 1000 })
      } else {
        toast.error(message, { duration: 1000 })
      }
    } finally {
      setOpen(false)
      reset()
      setPreguntas([])
    }
  }

  const alternativaValue = watch('ALTERNATIVA', '') || ''
  const instrumento = watch('INSTRUMENTO', '') || ''

  useEffect(() => {
    const upperCaseValue = alternativaValue.toUpperCase()
    const restrictedValue = upperCaseValue.replace(/[^ABCDE]/g, '')

    if (restrictedValue !== alternativaValue) {
      setValue('ALTERNATIVA', restrictedValue)
    }
  }, [alternativaValue, setValue, instrumento])

  useEffect(() => {
    if (Role === '2') {
      if (!isTokenValid()) {
        navigate('/')
      } else {
        listarActividad()
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
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Gestión Detalle Instrumento</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, padding: 2 }}>
          <Typography variant='h6' sx={{ fontSize: '14px' }}> Formulario Ingreso Gestión Detalle Instrumento</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography sx={{ fontSize: '14px', marginTop: 1, fontWeight: 'bold' }}> Pregunta n° {preguntas.length + 1}</Typography>

          </Box>
          <form onSubmit={handleSubmit(crearDetalleInstrumento)}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <Controller
                name='INSTRUMENTO'
                control={control}
                defaultValue={null}
                rules={{ required: 'El instrumento es requerido' }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={instrumentos || []}
                    getOptionLabel={(option) => option.codInstrumento + ' | ' + option.descInstrumento}
                    isOptionEqualToValue={(option, value) => option.idInstrumento === value.idInstrumento}
                    onChange={(event, value) => {
                      field.onChange(value)
                    }}
                    sx={{ width: '100%' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size='small'
                        label='Instrumento'
                        error={!!errors.INSTRUMENTO}
                        helperText={errors.INSTRUMENTO ? errors.INSTRUMENTO.message : ' '}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField minRows={5} maxRows={5} size='small' multiline fullWidth error={!!errors.PREGUNTA} helperText={errors.PREGUNTA ? 'La pregunta es requerida' : ' '} label='Pregunta' {...register('PREGUNTA', { required: true })} />
              <TextField minRows={5} maxRows={5} size='small' multiline fullWidth error={!!errors.RESPUESTA} helperText={errors.RESPUESTA ? 'La pregunta es requerida' : ' '} label='Respuesta' {...register('RESPUESTA', { required: instrumento.codInstrumento === 'PCT' })} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField minRows={5} maxRows={5} size='small' multiline fullWidth error={!!errors.BRECHA} helperText={errors.BRECHA ? 'La brecha es requerida' : ' '} label='Brecha' {...register('BRECHA', { required: instrumento.codInstrumento === 'PCT' })} />
              <TextField minRows={5} maxRows={5} size='small' multiline fullWidth error={!!errors.RECOMENDACION} helperText={errors.RECOMENDACION ? 'La recomendación es requerida' : ' '} label='Recomendación' {...register('RECOMENDACION', { required: instrumento.codInstrumento === 'PCT' })} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField size='small' fullWidth inputProps={{ maxLength: 1 }} error={!!errors.ALTERNATIVA} helperText={errors.ALTERNATIVA ? 'La alternativa es requerida' : ' '} label='Alternativa Correcta' {...register('ALTERNATIVA', { required: instrumento.codInstrumento === 'PCT' })} />
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
                      listarCriterio(value.idActividad)
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
              <Controller
                name='CRITERIO'
                control={control}
                defaultValue={null}
                rules={{ required: 'La actividad es requerida' }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={criterio || []}
                    getOptionLabel={(option) => option.codCriterio + ' | ' + option.descCriterio}
                    isOptionEqualToValue={(option, value) => option.idCriterio === value.idCriterio}
                    onChange={(event, value) => {
                      field.onChange(value)
                    }}
                    sx={{ width: '100%' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size='small'
                        label='Criterio'
                        error={!!errors.CRITERIO}
                        helperText={errors.CRITERIO ? errors.CRITERIO.message : ' '}
                      />
                    )}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField size='small' minRows={5} maxRows={5} multiline fullWidth error={!!errors.REFERENCIA} helperText={errors.REFERENCIA ? 'La brecha es requerida' : ' '} label='Referencia bibliográfica' {...register('REFERENCIA')} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <Button type='submit' variant='outlined' color='success'> Crear Pregunta </Button>
            </Box>
          </form>
        </Box>

        {preguntas.length > 0 && (
          <Box component={Paper} sx={{ marginTop: 2, padding: 2 }}>
            <TableContainer component={Paper}>
              <Table stickyHeader size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>NÚMERO PREGUNTA</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>PREGUNTA</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>RESPUESTA</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>ALTERNATIVA CORRECTA</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>BRECHA</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>RECOMENDACIÓN</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>REFERENCIA</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {preguntas.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell> {item.NROPREGUNTA}</TableCell>
                        <TableCell sx={{ whiteSpace: 'pre-line' }}> {item.PREGUNTA}</TableCell>
                        <TableCell> {item.RESPUESTA ? item.RESPUESTA : '-'}</TableCell>
                        <TableCell> {item.ALTERNATIVA ? item.ALTERNATIVA : '-'}</TableCell>
                        <TableCell> {item.BRECHA ? item.BRECHA : '-'}</TableCell>
                        <TableCell> {item.RECOMENDACION ? item.RECOMENDACION : '-'}</TableCell>
                        <TableCell> {item.REFERENCIA ? item.REFERENCIA : '-'}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Button sx={{ marginTop: 2 }} variant='outlined' color='warning' onClick={() => setOpenDialog(true)}> Crear Instrumento </Button>

          </Box>
        )}

        {/* <Box component={Paper} sx={{ backgroundColor: 'white', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, padding: 2 }}>
        </Box> */}
      </Box>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='error' />
      </Backdrop>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='responsive-dialog-title'>
          Carga de instrumentos a sistema
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Usted esta creado un instrumeto con <span style={{ fontWeight: 'bold' }}>{preguntas.length}</span> {preguntas.length > 1 ? 'preguntas' : 'pregunta'}.
          </DialogContentText>
          <DialogContentText sx={{ fontWeight: 'bold' }}>
            ¿Desea Continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='success' onClick={handleAccept} autoFocus>
            Aceptar
          </Button>
          <Button variant='outlined' color='warning' onClick={handleClose} autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
