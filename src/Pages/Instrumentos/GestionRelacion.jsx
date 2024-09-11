import { useEffect, useState } from 'react'
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import PermanentDrawerLeft from '../../Components/Drawer'

import { useTheme } from '@mui/material/styles'
import { toast, Toaster } from 'sonner'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { ListarUcls } from '../../Functions/ListarUcls'
import { ListarPerfiles } from '../../Functions/ListarPerfiles'
import { ListarRelacion } from '../../Functions/ListarRelacion'
import { FormatDate } from '../../Helpers/FormatDate'
import { RegistrarUclPerfil } from '../../Functions/RegistrarUclPerfil'

export const GestionRelacion = () => {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = useState(false)
  const { handleSubmit, control, formState: { errors } } = useForm()
  const [ucls, setUcls] = useState([])
  const [perfiles, setPerfiles] = useState([])
  const [data, setData] = useState([])

  const navigate = useNavigate()

  let Role = ''
  let Nombre = ''

  const storedData = localStorage.getItem('userData')

  if (storedData) {
    const parsedData = JSON.parse(storedData)
    Nombre = parsedData.state.name
    Role = parsedData.state.rol
  }

  const crearRelacion = async (e) => {
    setOpen(true)
    try {
      const { error, message } = await RegistrarUclPerfil(e)
      if (!error) {
        listarRelacion()
        toast.success(message, { duration: 1000 })
      } else {
        toast.error(message, { duration: 1000 })
      }
    } finally {
      setOpen(false)
    }
  }

  const listarPerfiles = async () => {
    const { error, message, result } = await ListarPerfiles()
    if (!error) {
      setPerfiles(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const listarUcls = async () => {
    const { error, message, result } = await ListarUcls()
    if (!error) {
      setUcls(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  const listarRelacion = async () => {
    const { error, message, result } = await ListarRelacion()
    if (!error) {
      setData(result)
    } else {
      toast.error(message, { duration: 1000 })
    }
  }

  useEffect(() => {
    setOpen(false)
    if (Role === '2') {
      if (!isTokenValid()) {
        navigate('/')
      } else {
        listarPerfiles()
        listarUcls()
        listarRelacion()
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
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Gestión relación Ucl - Perfil</Typography>
        </Box>
        <Box component={Paper} sx={{ marginTop: 2, padding: 2 }}>
          <Typography variant='h6' sx={{ fontSize: '14px' }}> Formulario relación perfil ucl</Typography>
          <form onSubmit={handleSubmit(crearRelacion)}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <Controller
                name='PERFIL'
                control={control}
                defaultValue={null}
                rules={{ required: 'El perfil es requerido' }}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={perfiles || []}
                    getOptionLabel={(option) => option.codPerfil + ' | ' + option.descPerfil}
                    isOptionEqualToValue={(option, value) => option.idPerfil === value.idPerfil}
                    onChange={(event, value) => {
                      field.onChange(value)
                    }}
                    sx={{ width: '100%' }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size='small'
                        label='Perfil'
                        error={!!errors.PERFIL}
                        helperText={errors.PERFIL ? errors.PERFIL.message : ' '}
                      />
                    )}
                  />
                )}
              />
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
              <Button type='submit' variant='outlined' color='success'> Crear Relación </Button>
            </Box>
          </form>
        </Box>
        {data.length > 0 && (
          <Box component={Paper} sx={{ marginTop: 2 }}>
            <TableContainer>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>PERFIL</TableCell>
                    <TableCell>UCL</TableCell>
                    <TableCell>FECHA CREACIÓN RELACIÓN</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{item.descPerfil}</TableCell>
                        <TableCell>{item.descUcl}</TableCell>
                        <TableCell>{FormatDate(item.fechaCreacionUclPerfil)}</TableCell>
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
