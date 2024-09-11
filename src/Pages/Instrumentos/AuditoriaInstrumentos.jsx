import { useEffect, useState } from 'react'
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { toast, Toaster } from 'sonner'
import { isTokenValid } from '../../Functions/VerificarToken'
import { useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import PermanentDrawerLeft from '../../Components/Drawer'
import { ListarInstrumento } from '../../Functions/ListarInstrumento'
import { ListarInstrumentosDetalle } from '../../Functions/ListarInstrumentoDetalle'

export const AuditoriaInstrumentos = () => {
  const { handleSubmit, control, formState: { errors } } = useForm()
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [open, setOpen] = useState(false)
  const [instrumentos, setInstrumentos] = useState([])
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

  const buscarInstrumento = async (e) => {
    setOpen(true)
    try {
      const { error, result, message } = await ListarInstrumentosDetalle(e.INSTRUMENTO.idInstrumento)
      if (!error) {
        setData(result)
      } else {
        toast.error(message)
      }
    } finally {
      setOpen(false)
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

  useEffect(() => {
    if (Role === '2') {
      if (!isTokenValid()) {
        navigate('/')
      } else {
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
          <Typography variant='h5' sx={{ fontWeight: 'bold', fontSize: '18px' }}>Auditoria Instrumento</Typography>
        </Box>

        <Box component={Paper} sx={{ marginTop: 2, padding: 2 }}>
          <form onSubmit={handleSubmit(buscarInstrumento)}>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' }, gap: 2, marginTop: 2 }}>
              <Button type='submit' variant='outlined' color='success'> Buscar </Button>
            </Box>
          </form>
        </Box>

        {data.length > 0 && (
          <Box component={Paper} sx={{ marginTop: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ whiteSpace: 'nowrap' }}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>ACTIVIDAD</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>CRITERIO</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>N° DE PREGUNTA</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>PREGUNTA</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>RESPUESTA</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>RESPUESTA CORRECTA</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>BRECHA</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>RECOMENDACION DE CAPACITACION</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>REFERENCIA BIBLIOGRAFICA</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>NOMBRE USUARIO</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell> {item.descActividad}</TableCell>
                        <TableCell> {item.descCriterio}</TableCell>
                        <TableCell> {item.nroPreguntaDetalleInstrumento}</TableCell>
                        <TableCell sx={{ whiteSpace: 'pre-line' }}> {item.descPreguntaDetalleInstrumento} </TableCell>
                        <TableCell sx={{ whiteSpace: 'pre-line' }}> {item.descRespuestaDetalleInstrumento} </TableCell>
                        <TableCell> {item.alternativaCorrectaDetalleInstrumento}</TableCell>
                        <TableCell> {item.descBrechaDetalleInstrumento}</TableCell>
                        <TableCell> {item.descRecomendacionDetalleInstrumento}</TableCell>
                        <TableCell> {item.descReferenciaBibliografica}</TableCell>
                        <TableCell> {item.nombreUsuario}</TableCell>
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
