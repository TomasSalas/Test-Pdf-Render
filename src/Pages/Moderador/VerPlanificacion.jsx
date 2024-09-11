import { useEffect, useState } from 'react'
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import PermanentDrawerLeft from '../../Components/Drawer'
import moment from 'moment'
import { useTheme } from '@mui/material/styles'
import { toast, Toaster } from 'sonner'
import { ListarClientes } from '../../Functions/ListarClientes'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { ListarContratos } from '../../Functions/ListarContratos'
import { ListarPlanificados } from '../../Functions/ListarPlanificados'

export const VerPlanificacion = () => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = useState(false)

  const [clientes, setClientes] = useState([])
  const [contratos, setContratos] = useState([])
  const [data, setData] = useState([])

  const navigate = useNavigate()
  const { control, handleSubmit, setValue, formState: { errors } } = useForm()
  let Role = ''
  let Nombre = ''

  const storedData = localStorage.getItem('userData')

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

  const Cliente = async () => {
    const { error, result, message } = await ListarClientes()
    if (!error) {
      setClientes(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const Contratos = async (id) => {
    const { error, result, message } = await ListarContratos()
    if (!error) {
      const filter = result.filter(item => item.idClienteContrato === id)
      setContratos(filter)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const planificarUsuarios = async (e) => {
    setOpen(true)
    try {
      const { error, message, result } = await ListarPlanificados(e.CLIENTE.idCliente, e.CONTRATO.idContrato)
      if (!error) {
        setData(result)
      } else {
        toast.error(message)
        setData([])
      }
    } finally {
      setOpen(false)
    }
  }

  useEffect(() => {
    setOpen(false)
    if (Role === '3') {
      if (!isTokenValid()) {
        navigate('/')
      } else {
        Cliente()
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
      <Box sx={{ paddingTop: 12, paddingLeft: isMdUp ? 28 : 2, paddingRight: 2, paddingBottom: 2 }}>
        <Box className='boxTitulo' component={Paper} sx={{ padding: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Ver Planificaciones</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, padding: 2, display: 'flex', flexDirection: 'column' }}>
          <form onSubmit={handleSubmit(planificarUsuarios)}>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 2 }}>
              <Controller
                name='CLIENTE'
                control={control || []}
                defaultValue={null}
                rules={{ required: 'El cliente es requerido' }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={clientes || []}
                    getOptionLabel={(option) => option.nombreCliente}
                    isOptionEqualToValue={(option, value) => option.idCliente === value.idCliente}
                    onChange={(event, value) => {
                      field.onChange(value)
                      setContratos([])
                      setValue('CONTRATO', null)
                      if (value !== null) {
                        Contratos(value.idCliente)
                      }
                    }}
                    sx={{ width: '100%' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Clientes'
                        error={!!errors.CLIENTE}
                        helperText={errors.CLIENTE ? errors.CLIENTE.message : ' '}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name='CONTRATO'
                control={control}
                defaultValue={null}
                rules={{ required: 'El contrato es requerido' }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={contratos || []}
                    getOptionLabel={(option) => option.descContrato}
                    isOptionEqualToValue={(option, value) => option.idContrato === value.idContrato}
                    onChange={(event, value) => {
                      field.onChange(value)
                    }}
                    sx={{ width: '100%' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Contrato'
                        error={!!errors.CLIENTE}
                        helperText={errors.CLIENTE ? errors.CLIENTE.message : ' '}
                      />
                    )}
                  />
                )}
              />
            </Box>

            <Box sx={{ marginTop: 2, display: 'flex' }}>
              <Button color='success' type='submit' variant='outlined'> Buscar </Button>
            </Box>
          </form>
        </Box>

        {data.length > 0 && (
          <Box component={Paper} sx={{ marginTop: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell> ID PLANIFICACIÓN </TableCell>
                    <TableCell> NOMBRE USUARIO </TableCell>
                    <TableCell> CLIENTE </TableCell>
                    <TableCell> CONTRATO </TableCell>
                    <TableCell> INSTRUMENTO 1 </TableCell>
                    <TableCell> INSTRUMENTO 2 </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{item.idProcesoPlanificado}</TableCell>
                        <TableCell>{item.nombreUsuario}</TableCell>
                        <TableCell>{item.nombreCliente}</TableCell>
                        <TableCell>{item.descContrato}</TableCell>
                        <TableCell>{item.descinstrumento1}</TableCell>
                        <TableCell>{item.descinstrumento2 ? item.descinstrumento2 : '-'}</TableCell>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 3 }}>
          <CircularProgress color='error' />
        </Box>
      </Backdrop>
    </>
  )
}
