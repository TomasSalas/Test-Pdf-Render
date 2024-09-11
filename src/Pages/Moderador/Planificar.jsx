import { useEffect, useState } from 'react'
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import PermanentDrawerLeft from '../../Components/Drawer'
import moment from 'moment'
import { useTheme } from '@mui/material/styles'
import { toast, Toaster } from 'sonner'
import { ListarClientes } from '../../Functions/ListarClientes'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { ListarContratos } from '../../Functions/ListarContratos'
import { ListarTipoProceso } from '../../Functions/ListarTipoProceso'
import { ListarUsuarios } from '../../Functions/ListarUsuarios'
import { FormatRut } from '../../Helpers/FormatRut'
import { ListarInstrumento } from '../../Functions/ListarInstrumento'
import { RegistrarPlanificacion } from '../../Functions/RegistrarPlanificacion'

export const Planificar = () => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [codContrato, setCodContrato] = useState(false)

  const [clientes, setClientes] = useState([])
  const [contratos, setContratos] = useState([])
  const [procesos, setProcesos] = useState([])
  const [procesos2, setProcesos2] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [instrumentos, setInstrumentos] = useState([])
  const [instrumentos2, setInstrumentos2] = useState([])
  const [selected, setSelected] = useState([])
  const [informacion, setInformacion] = useState([])

  const navigate = useNavigate()
  const { control, handleSubmit, formState: { errors }, reset } = useForm()
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

  const Procesos = async (codContrato) => {
    setCodContrato(codContrato)
    const { error, result, message } = await ListarTipoProceso(codContrato)
    if (!error) {
      setProcesos(result)
    } else {
      setProcesos([])
      toast.error(message, { duration: 1000 })
    }
  }

  const Procesos2 = async (cod) => {
    const { error, result, message } = await ListarTipoProceso(codContrato)
    if (!error) {
      const filter = result.filter(item => item.codTipoProceso !== cod)
      setProcesos2(filter)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const Usuarios = async (id) => {
    const { error, result, message } = await ListarUsuarios(id)
    if (!error) {
      setUsuarios(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const Instrumentos = async (cod) => {
    const { error, result, message } = await ListarInstrumento()
    if (!error) {
      const filter = result.filter(item => item.codInstrumento === cod)
      setInstrumentos(filter)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const Instrumentos2 = async (cod) => {
    const { error, result, message } = await ListarInstrumento()
    if (!error) {
      const filter = result.filter(item => item.codInstrumento === cod)
      setInstrumentos2(filter)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const handleSelect = (id) => {
    setSelected(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(item => item !== id)
        : [...prevSelected, id]
    )
  }

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = usuarios.map(item => item.idUsuario)
      setSelected(newSelected)
    } else {
      setSelected([])
    }
  }

  const planificarUsuarios = (e) => {
    setOpenDialog(true)
    setInformacion(e)
  }

  const handleAccept = async () => {
    setOpenDialog(false)
    setOpen(true)

    try {
      const { error, message } = await RegistrarPlanificacion(informacion, selected)
      if (!error) {
        toast.success(message)
        reset()
        setUsuarios([])
        setSelected([])
      } else {
        toast.error(message)
      }
    } finally {
      setOpen(false)
    }
  }

  const handleClose = async () => {
    setOpenDialog(false)
  }

  const isAllSelected = selected.length === usuarios.length

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
      <Box
        sx={{
          paddingTop: 12,
          paddingLeft: isMdUp ? 28 : 2,
          paddingRight: 2,
          paddingBottom: 2
        }}
      >
        <Box className='boxTitulo' component={Paper} sx={{ padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Planificar</Typography>
          <Typography variant='h5' sx={{ fontSize: '12px' }}>Se cargaran los tipos de procesos según el contrato del cliente.</Typography>
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
                      if (value !== null) {
                        Contratos(value.idCliente)
                        Usuarios(value.idCliente)
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
                      if (value !== null) {
                        Procesos(value.idContrato)
                      }
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
            {procesos.length === 2
              ? (
                <>
                  <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 2 }}>
                    <Controller
                      name='PROCESOS_1'
                      control={control}
                      defaultValue={null}
                      rules={{ required: 'El tipo proceso es requerido' }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={procesos || []}
                          getOptionLabel={(option) => option.codTipoProceso}
                          isOptionEqualToValue={(option, value) => option.idTipoProceso === value.idTipoProceso}
                          onChange={(event, value) => {
                            field.onChange(value)
                            setInstrumentos([])
                            setProcesos2([])
                            if (value !== null) {
                              Instrumentos(value.codTipoProceso)
                              Procesos2(value.codTipoProceso)
                            }
                          }}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Tipo Procesos 1'
                              error={!!errors.PROCESOS_1}
                              helperText={errors.PROCESOS_1 ? errors.PROCESOS_1.message : ' '}
                            />
                          )}
                        />
                      )}
                    />
                    <Controller
                      name='INSTRUMENTO_1'
                      control={control}
                      defaultValue={null}
                      rules={{ required: 'El tipo proceso es requerido' }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={instrumentos || []}
                          getOptionLabel={(option) => option.descInstrumento}
                          isOptionEqualToValue={(option, value) => option.idInstrumento === value.idInstrumento}
                          onChange={(event, value) => {
                            field.onChange(value)
                          }}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Instrumento 1'
                              error={!!errors.INSTRUMENTO_1}
                              helperText={errors.INSTRUMENTO_1 ? errors.INSTRUMENTO_1.message : ' '}
                            />
                          )}
                        />
                      )}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 2 }}>
                    <Controller
                      name='PROCESOS_2'
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={procesos2 || []}
                          getOptionLabel={(option) => option.codTipoProceso}
                          isOptionEqualToValue={(option, value) => option.idTipoProceso === value.idTipoProceso}
                          onChange={(event, value) => {
                            field.onChange(value)
                            setInstrumentos2([])
                            if (value !== null) {
                              Instrumentos2(value.codTipoProceso)
                            }
                          }}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Tipo Procesos 2'
                              error={!!errors.PROCESOS_2}
                              helperText={errors.PROCESOS_2 ? errors.PROCESOS_2.message : ' '}
                            />
                          )}
                        />
                      )}
                    />
                    <Controller
                      name='INSTRUMENTO_2'
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={instrumentos2 || []}
                          getOptionLabel={(option) => option.descInstrumento}
                          isOptionEqualToValue={(option, value) => option.idInstrumento === value.idInstrumento}
                          onChange={(event, value) => {
                            field.onChange(value)
                          }}
                          sx={{ width: '100%' }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Instrumento 2'
                              error={!!errors.INSTRUMENTO_2}
                              helperText={errors.INSTRUMENTO_2 ? errors.INSTRUMENTO_2.message : ' '}
                            />
                          )}
                        />
                      )}
                    />
                  </Box>
                </>)
              : (
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', gap: 2 }}>
                  <Controller
                    name='PROCESOS_1'
                    control={control}
                    defaultValue={null}
                    rules={{ required: 'El tipo proceso es requerido' }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={procesos || []}
                        getOptionLabel={(option) => option.codTipoProceso}
                        isOptionEqualToValue={(option, value) => option.idTipoProceso === value.idTipoProceso}
                        onChange={(event, value) => {
                          field.onChange(value)
                          setInstrumentos([])
                          setProcesos2([])
                          if (value !== null) {
                            Instrumentos(value.codTipoProceso)
                            Procesos2(value.codTipoProceso)
                          }
                        }}
                        sx={{ width: '100%' }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Tipo Procesos 1'
                            error={!!errors.PROCESOS_1}
                            helperText={errors.PROCESOS_1 ? errors.PROCESOS_1.message : ' '}
                          />
                        )}
                      />
                    )}
                  />
                  <Controller
                    name='INSTRUMENTO_1'
                    control={control}
                    defaultValue={null}
                    rules={{ required: 'El tipo proceso es requerido' }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={instrumentos || []}
                        getOptionLabel={(option) => option.descInstrumento}
                        isOptionEqualToValue={(option, value) => option.idInstrumento === value.idInstrumento}
                        onChange={(event, value) => {
                          field.onChange(value)
                        }}
                        sx={{ width: '100%' }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Instrumento 1'
                            error={!!errors.INSTRUMENTO_1}
                            helperText={errors.INSTRUMENTO_1 ? errors.INSTRUMENTO_1.message : ' '}
                          />
                        )}
                      />
                    )}
                  />
                </Box>)}

            <Box sx={{ marginTop: 2, display: 'flex' }}>
              <Button color='success' type='submit' variant='outlined'> PLANIFICAR </Button>
            </Box>
          </form>
          {usuarios.length > 0 && (
            <Box component={Paper} sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', maxHeight: 400 }}>
              <TableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          indeterminate={selected.length > 0 && !isAllSelected}
                          checked={isAllSelected}
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell> NOMBRE </TableCell>
                      <TableCell> RUT </TableCell>
                      <TableCell> EMAIL </TableCell>
                      <TableCell> JEFATURA </TableCell>
                      <TableCell> REGIÓN </TableCell>
                      <TableCell> EMPRESA </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usuarios.map((item, index) => {
                      const isSelected = selected.includes(item.idUsuario)
                      return (
                        <TableRow key={index} selected={isSelected}>
                          <TableCell padding='checkbox'>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleSelect(item.idUsuario)}
                            />
                          </TableCell>
                          <TableCell>{item.nombreUsuario}</TableCell>
                          <TableCell>{FormatRut(item.runUsuario)}</TableCell>
                          <TableCell>{item.emailUsuario}</TableCell>
                          <TableCell>{item.cargoJefatura}</TableCell>
                          <TableCell>{item.regionUsuario}</TableCell>
                          <TableCell>{item.nombreCliente}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Box>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 3 }}>
          <CircularProgress color='error' />
        </Box>
      </Backdrop>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='responsive-dialog-title'>
          Planificación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Usted esta creado una planificación con <span style={{ fontWeight: 'bold' }}>{selected.length}</span> {selected.length > 1 ? 'usuarios' : 'usuario'}.
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
