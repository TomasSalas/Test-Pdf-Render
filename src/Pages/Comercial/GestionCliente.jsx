import { useEffect, useState } from 'react'
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import PermanentDrawerLeft from '../../Components/Drawer'
import { Controller, useForm } from 'react-hook-form'
import { Comuna, Regiones } from '../../Helpers/Informacion'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import { useTheme } from '@mui/material/styles'
import { toast, Toaster } from 'sonner'
import { onChangeInputRut } from '../../Helpers/PatterRutEmpresa'
import { RegistrarClientes } from '../../Functions/RegistrarClientes'
import { ListarMutualidad } from '../../Functions/ListarMutualidad'
import { ListarSucursal } from '../../Functions/ListarSucursal'
import { ListarClientes } from '../../Functions/ListarClientes'
import { FormatRut } from '../../Helpers/FormatRut'
import { FormatDate } from '../../Helpers/FormatDate'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'

export const GestionCliente = () => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [idMutuarias, setidMutuarias] = useState([])
  const [isAutocompleteDisabled, setIsAutocompleteDisabled] = useState(false)
  const [boxFormulario, setBoxFormulario] = useState(false)
  const { handleSubmit, control, register, setValue, watch, reset, formState: { errors } } = useForm()
  const [open, setOpen] = useState(false)
  const [clientes, setClientes] = useState([])
  const [mutualidad, setMutualidad] = useState([])
  const [sucursal, setSucursal] = useState([])
  const navigate = useNavigate()
  const [comunas, setComunas] = useState([])
  const selectedRegion = watch('REGION')

  let Role = ''
  let Nombre = ''

  const storedData = localStorage.getItem('userData')

  if (storedData) {
    const parsedData = JSON.parse(storedData)
    Nombre = parsedData.state.name
    Role = parsedData.state.rol
  }

  useEffect(() => {
    if (selectedRegion) {
      const region = Comuna.find(r => r.id === selectedRegion.id)
      setComunas(region ? region.comunas : [])
    }
  }, [selectedRegion, setValue])

  const handleButtonClick = () => {
    setIsAutocompleteDisabled(!isAutocompleteDisabled)
  }

  const registerCandidato = async (e) => {
    setOpen(true)
    try {
      const { error, message } = await RegistrarClientes(e, idMutuarias.idMutualidad)
      if (!error) {
        reset()
        listarClientes()
        toast.success(message, { duration: 1500 })
      } else {
        toast.error(message, { duration: 1500 })
      }
    } finally {
      setOpen(false)
    }
  }

  const listar = async () => {
    const { error, result, message } = await ListarMutualidad()
    if (!error) {
      setMutualidad(result)
    } else {
      toast.error(message, { duration: 1000 })
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

  const listarClientes = async () => {
    const { error, result, message } = await ListarClientes()
    if (!error) {
      setClientes(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  useEffect(() => {
    if (Role === '5') {
      if (!isTokenValid()) {
        navigate('/')
      }
    } else {
      localStorage.removeItem('userData')
      localStorage.removeItem('token')
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    listar()
    listarSucursal()
    listarClientes()
  }, [])

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
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Gestión Clientes</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, padding: 2, display: 'flex', flexDirection: 'column' }}>

          <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 2 }}>
            <Autocomplete
              disabled={isAutocompleteDisabled}
              isOptionEqualToValue={(option, value) => option.idMutualidad === value.idMutualidad}
              onChange={(event, newValue) => {
                setidMutuarias(newValue)
              }}
              sx={{ width: '100%' }}
              options={mutualidad}
              noOptionsText='No existen resultados ...'
              getOptionLabel={(option) => option.nombreMutualidad}
              renderInput={(params) => <TextField {...params} size='small' label='Mutuarias' />}
            />
            <Button variant='outlined' onClick={handleButtonClick}>{isAutocompleteDisabled ? 'Deselecionar' : 'Seleccionar'}</Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginTop: 2, gap: 2 }}>
            <Button
              variant='outlined'
              color='success'
              startIcon={<PersonAddAltIcon />}
              onClick={() => setBoxFormulario(!boxFormulario)}
              disabled={!isAutocompleteDisabled}
            >
              Ingreso Individual
            </Button>

          </Box>
        </Box>
        {boxFormulario && (
          <Box component={Paper} sx={{ marginTop: 2, padding: 2 }}>
            <Typography variant='h6' sx={{ fontSize: '14px' }}> Formulario Ingreso Clientes</Typography>
            <form onSubmit={handleSubmit(registerCandidato)}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
                <TextField size='small' fullWidth error={!!errors.NOMBRE} helperText={errors.NOMBRE ? 'El nombre es requerido' : ' '} label='Nombre' {...register('NOMBRE', { required: true })} />
                <TextField size='small' fullWidth error={!!errors.NOMBRE_FANTASIA} helperText={errors.NOMBRE_FANTASIA ? 'El nombre de fantasia es requerido' : ' '} label='Nombre Fantansia' {...register('NOMBRE_FANTASIA', { required: true })} />
                <Controller
                  name='RUT'
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
                      label='Rut'
                      fullWidth
                      inputProps={{ maxLength: 12 }}
                      error={!!errors.RUT}
                      helperText={errors.RUT ? errors.RUT.message : ' '}
                      onChange={(e) => {
                        field.onChange(e)
                        onChangeInputRut(e, setValue)
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 1 }}>
                <TextField size='small' fullWidth error={!!errors.EMAIL} helperText={errors.EMAIL ? 'El email es requerido' : ' '} label='Email' {...register('EMAIL', { required: true })} />
                <TextField size='small' error={!!errors.TELEFONO} helperText={errors.TELEFONO ? 'El telefono es requerido' : ' '} type='number' fullWidth label='Telefono' {...register('TELEFONO', { required: true })} />
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
                      options={Regiones || []}
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
                      options={comunas || []}
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

                <TextField size='small' fullWidth error={!!errors.DIRECCION} helperText={errors.DIRECCION ? 'La dirección es requerida' : ' '} label='Dirección' {...register('DIRECCION', { required: true })} />
                <Controller
                  name='SUCURSAL'
                  control={control}
                  defaultValue={null}
                  rules={{ required: 'La sucursal es requerida' }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={sucursal || []}
                      getOptionLabel={(option) => option.descSucursal}
                      isOptionEqualToValue={(option, value) => option.idSucursal === value.idSucursal}
                      onChange={(event, value) => {
                        field.onChange(value)
                      }}
                      sx={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          label='Sucursal'
                          error={!!errors.SUCURSAL}
                          helperText={errors.SUCURSAL ? errors.SUCURSAL.message : ' '}
                        />
                      )}
                    />
                  )}
                />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Button type='submit' color='success' variant='outlined'>Guardar Cliente</Button>
              </Box>
            </form>
          </Box>
        )}
        {clientes.length > 0 && (
          <Box component={Paper} sx={{ marginTop: 2 }}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ whiteSpace: 'nowrap' }}>
                    <TableCell> NOMBRE</TableCell>
                    <TableCell> NOMBRE FANTASIA</TableCell>
                    <TableCell> RUT</TableCell>
                    <TableCell> EMAIL</TableCell>
                    <TableCell> TELEFONO</TableCell>
                    <TableCell> FECHA INGRESO</TableCell>
                    <TableCell> DIRECCION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientes.map((item, index) => {
                    return (
                      <TableRow key={index} sx={{ whiteSpace: 'nowrap' }}>
                        <TableCell>{item.nombreCliente}</TableCell>
                        <TableCell>{item.nombreFantasiaCliente}</TableCell>
                        <TableCell>{FormatRut(item.rutCliente)}</TableCell>
                        <TableCell>{item.emailCliente}</TableCell>
                        <TableCell>{FormatDate(item.fechaIngresoCliente)}</TableCell>
                        <TableCell>{item.telefonoCliente}</TableCell>
                        <TableCell>{item.direccionCliente}</TableCell>
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
