import { useEffect, useRef, useState } from 'react'
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import { UploadFile } from '@mui/icons-material'
import { FormatDate } from '../../Helpers/FormatDate'
import { handleFileUpload } from '../../Helpers/SubirExcel'
import PermanentDrawerLeft from '../../Components/Drawer'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { onChangeInput } from '../../Helpers/PatterRut'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { Comuna, Genero, Jefatura, Regiones } from '../../Helpers/Informacion'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import { useTheme } from '@mui/material/styles'
import { RegistrarUsuarios } from '../../Functions/RegistrarUsuarios'
import { toast, Toaster } from 'sonner'
import { RegistrarUsuariosMasivo } from '../../Functions/RegistrarUsuariosMasivo'
import { ListarClientes } from '../../Functions/ListarClientes'
import { FormatRut } from '../../Helpers/FormatRut'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'

export const GestionUsuario = () => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [data, setData] = useState([])
  const [idCliente, setidCliente] = useState([])
  const [boxFormulario, setBoxFormulario] = useState(false)
  const [boxMasivo, setBoxMasivo] = useState(false)
  const { handleSubmit, control, register, setValue, watch, reset, formState: { errors } } = useForm()
  const [open, setOpen] = useState(false)
  const [clientes, setClientes] = useState([])
  const [isAutocompleteDisabled, setIsAutocompleteDisabled] = useState(false)
  const navigate = useNavigate()
  const [comunas, setComunas] = useState([])
  const selectedRegion = watch('REGION')
  const fileInputRef = useRef(null)

  const handleClearInput = () => {
    fileInputRef.current.value = null
  }
  let Role = ''
  let Nombre = ''

  const storedData = window.localStorage.getItem('userData')

  if (storedData) {
    const parsedData = JSON.parse(storedData)
    Nombre = parsedData.state.name
    Role = parsedData.state.rol
  }

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

  const handleButtonClick = () => {
    setIsAutocompleteDisabled(!isAutocompleteDisabled)
  }

  const registerCandidato = async (e) => {
    setOpen(true)
    try {
      const eArray = [e]
      const { error, message } = await RegistrarUsuarios(eArray, idCliente.idCliente)
      if (!error) {
        reset()
        toast.success(message, { duration: 1500 })
        setData([])
      } else {
        toast.error(message, { duration: 1500 })
        setData([])
      }
    } finally {
      setOpen(false)
    }
  }

  const cargarMasivo = async () => {
    setOpen(true)
    try {
      const { error, message } = await RegistrarUsuariosMasivo(data, idCliente.idCliente)
      if (!error) {
        toast.success(message, { duration: 1000 })
        setData([])
      } else {
        toast.error(message, { duration: 1000 })
        setData([])
      }
    } finally {
      setOpen(false)
    }
  }

  const listar = async () => {
    const { error, result, message } = await ListarClientes()
    if (!error) {
      setClientes(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  useEffect(() => {
    if (selectedRegion) {
      const region = Comuna.find(r => r.id === selectedRegion.id)
      setComunas(region ? region.comunas : [])
    }
  }, [selectedRegion, setValue])

  useEffect(() => {
    listar()
  }, [])

  useEffect(() => {
    if (Role === '3') {
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
    <>
      <Toaster richColors />
      <PermanentDrawerLeft Nombre={Nombre} Role={Role} />
      <Box
        sx={{
          paddingTop: 12,
          paddingLeft: isMdUp ? 28 : 2,
          paddingRight: 2,
          paddingBottom: 2
        }}
      >
        <Box className='boxTitulo' component={Paper} sx={{ padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Gestión Usuarios</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, padding: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 2 }}>
            <Autocomplete
              disabled={isAutocompleteDisabled}
              isOptionEqualToValue={(option, value) => option.idCliente === value.idCliente}
              onChange={(event, newValue) => {
                setidCliente(newValue)
              }}
              sx={{ width: '100%' }}
              options={clientes || []}
              noOptionsText='No existen resultados ...'
              getOptionLabel={(option) => option.nombreCliente}
              renderInput={(params) => <TextField {...params} size='small' label='Clientes' />}
            />
            <Button variant='outlined' onClick={handleButtonClick}>{isAutocompleteDisabled ? 'Deseleccionar' : 'Seleccionar'}</Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: 2, gap: 2 }}>
            <Box>
              <input
                type='file'
                accept='.xlsx, .xls'
                id='upload-button'
                style={{ display: 'none' }}
                disabled={!isAutocompleteDisabled}
                onChange={(e) => { handleFileUpload(e, setData) }}
                ref={fileInputRef}
              />
              <label htmlFor='upload-button'>
                <Button
                  variant='outlined'
                  component='span'
                  color='error'
                  startIcon={<UploadFile />}
                  disabled={!isAutocompleteDisabled}
                  onClick={() => { setBoxMasivo(true); setBoxFormulario(false); handleClearInput() }}
                >
                  Subir Nomina
                </Button>
              </label>
            </Box>
            {data.length > 0 && (
              <Button variant='outlined' color='success' onClick={() => cargarMasivo()}>Cargar </Button>
            )}

            <Button
              variant='outlined'
              color='success'
              startIcon={<PersonAddAltIcon />}
              onClick={() => { setBoxFormulario(!boxFormulario); setBoxMasivo(!boxMasivo); setData([]) }}
              disabled={!isAutocompleteDisabled}
            >
              Ingreso Individual
            </Button>

          </Box>
          {boxMasivo && (
            data.length > 0 && (
              <TableContainer component={Paper} sx={{ marginTop: 2, whiteSpace: 'nowrap', maxHeight: '600px' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ backgroundColor: '#f9f9f9' }}>#</TableCell>
                      <TableCell sx={{ backgroundColor: '#f9f9f9' }}>NOMBRE</TableCell>
                      <TableCell sx={{ backgroundColor: '#f9f9f9' }}>APELLIDO</TableCell>
                      <TableCell sx={{ backgroundColor: '#f9f9f9' }}>RUN</TableCell>
                      <TableCell sx={{ backgroundColor: '#f9f9f9' }}>EMAIL</TableCell>
                      <TableCell sx={{ backgroundColor: '#f9f9f9' }}>TELEFONO</TableCell>
                      <TableCell sx={{ backgroundColor: '#f9f9f9' }}>GENERO</TableCell>
                      <TableCell sx={{ backgroundColor: '#f9f9f9' }}>FECHA NACIMIENTO</TableCell>
                      <TableCell sx={{ backgroundColor: '#f9f9f9' }}>REGIÓN</TableCell>
                      <TableCell sx={{ backgroundColor: '#f9f9f9' }}>CIUDAD</TableCell>
                      <TableCell sx={{ backgroundColor: '#f9f9f9' }}>JEFATURA</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.NOMBRES ? item.NOMBRES : '-'}</TableCell>
                          <TableCell>{item.APELLIDOS ? item.APELLIDOS : '-'}</TableCell>
                          <TableCell>{item.RUN ? FormatRut(item.RUN) : '-'}</TableCell>
                          <TableCell>{item.EMAIL ? item.EMAIL : '-'}</TableCell>
                          <TableCell>{item.TELEFONO ? item.TELEFONO : '-'}</TableCell>
                          <TableCell>{item.GENERO ? item.GENERO.toUpperCase() : '-'}</TableCell>
                          <TableCell>{item.FECHA_NACIMIENTO ? FormatDate(item.FECHA_NACIMIENTO) : '-'}</TableCell>
                          <TableCell>{item.REGION ? item.REGION.toUpperCase() : '-'}</TableCell>
                          <TableCell>{item.CIUDAD ? item.CIUDAD.toUpperCase() : '-'}</TableCell>
                          <TableCell>{item.JEFATURA ? item.JEFATURA.toUpperCase() : '-'}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          )}

        </Box>
        {boxFormulario && (
          <Box component={Paper} sx={{ marginTop: 2, padding: 2 }}>
            <Typography variant='h6'> Formulario Ingreso Clientes</Typography>
            <form onSubmit={handleSubmit(registerCandidato)}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
                <TextField variant='outlined' size='small' fullWidth error={!!errors.NOMBRES} helperText={errors.nombNOMBRESre ? 'El o los nombres es requerido' : ' '} label='Nombres' {...register('NOMBRES', { required: true })} />
                <TextField size='small' fullWidth error={!!errors.APELLIDOS} helperText={errors.APELLIDOS ? 'El o los apellidos es requerido' : ' '} label='Apellidos' {...register('APELLIDOS', { required: true })} />
                <Controller
                  name='RUN'
                  control={control}
                  defaultValue=''
                  rules={{
                    required: 'El RUN es requerido',
                    pattern: {
                      value: /^[0-9.kK-]*$/,
                      message: 'Solo se permiten números, puntos y la letra K'
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size='small'
                      label='Run'
                      fullWidth
                      inputProps={{ maxLength: 12 }}
                      error={!!errors.RUN}
                      helperText={errors.RUN ? errors.RUN.message : ' '}
                      onChange={(e) => {
                        field.onChange(e)
                        onChangeInput(e, setValue)
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 1 }}>
                <TextField size='small' fullWidth error={!!errors.EMAIL} helperText={errors.EMAIL ? 'El email es requerido' : ' '} label='Email' {...register('EMAIL', { required: true })} />
                <TextField size='small' error={!!errors.TELEFONO} helperText={errors.TELEFONO ? 'El telefono es requerido' : ' '} type='number' fullWidth label='Telefono' {...register('TELEFONO', { required: true })} />
                <Controller
                  name='GENERO'
                  control={control}
                  defaultValue={null}
                  rules={{ required: 'El género es requerido' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={Genero}
                      getOptionLabel={(option) => option.nombre}
                      isOptionEqualToValue={(option, value) => option.idGenero === value.idGenero}
                      onChange={(event, value) => field.onChange(value)}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          label='Género'
                          error={!!errors.GENERO}
                          helperText={errors.GENERO ? errors.GENERO.message : ' '}
                        />
                      )}
                    />
                  )}
                />
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale='es'>
                  <Controller
                    name='FECHA_NACIMIENTO'
                    control={control}
                    defaultValue={null}
                    rules={{ required: 'La fecha de nacimiento es requerida' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label='Fecha Nacimiento'
                        format='DD/MM/YYYY'
                        sx={{ width: '100%' }}
                        error={!!errors.FECHA_NACIMIENTO}
                        helperText={errors.FECHA_NACIMIENTO ? errors.FECHA_NACIMIENTO.message : ' '}
                        slotProps={{
                          textField: {
                            error: !!errors.FECHA_NACIMIENTO,
                            helperText: errors.FECHA_NACIMIENTO ? errors.FECHA_NACIMIENTO.message : ' ',
                            size: 'small'
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 1 }}>
                <Controller
                  name='REGION'
                  control={control}
                  defaultValue={null}
                  rules={{ required: 'La región es requerida' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={Regiones}
                      getOptionLabel={(option) => option.nombre}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(event, value) => {
                        field.onChange(value)
                      }}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          label='Región'
                          error={!!errors.REGION}
                          helperText={errors.REGION ? errors.REGION.message : ' '}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name='CIUDAD'
                  control={control}
                  defaultValue={null}
                  rules={{ required: 'La ciudad es requerida' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={comunas}
                      getOptionLabel={(option) => option}
                      isOptionEqualToValue={(option, value) => option === value}
                      onChange={(event, value) => field.onChange(value)}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          label='Ciudad'
                          error={!!errors.CIUDAD}
                          helperText={errors.CIUDAD ? errors.CIUDAD.message : ' '}
                        />
                      )}
                    />
                  )}
                />
                <TextField size='small' fullWidth error={!!errors.AREA} helperText={errors.AREA ? 'La área es requerida' : ' '} label='Área' {...register('AREA')} />
                <Controller
                  name='JEFATURA'
                  control={control}
                  defaultValue={null}
                  rules={{ required: 'La región es requerida' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={Jefatura}
                      getOptionLabel={(option) => option.nombre}
                      isOptionEqualToValue={(option, value) => option.idJefatura === value.idJefatura}
                      onChange={(event, value) => {
                        field.onChange(value)
                      }}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          label='Jefatura'
                          error={!!errors.JEFATURA}
                          helperText={errors.JEFATURA ? errors.JEFATURA.message : ' '}
                        />
                      )}
                    />
                  )}
                />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Button type='submit' color='success' variant='outlined'>Guardar Candidato</Button>
              </Box>
            </form>
          </Box>
        )}

      </Box>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 3 }}>
          <CircularProgress color='error' />
        </Box>

      </Backdrop>
    </>
  )
}
