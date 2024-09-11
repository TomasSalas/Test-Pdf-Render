import { useEffect, useState } from 'react'
import { Backdrop, Box, Button, CircularProgress, TextField, useMediaQuery, useTheme } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { IniciarSesion } from '../Functions/IniciarSesion'
import { useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import { onChangeInput } from '../Helpers/PatterRut'
import { isTokenValid } from '../Functions/VerificarToken'
import ImgLogin from '../assets/Exams.gif'
import Logo from '../assets/logot.png'

export const Login = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const { handleSubmit, control, setValue, formState: { errors } } = useForm()
  const [open, setOpen] = useState(false)

  let Role = ''

  const storedData = window.localStorage.getItem('userData')

  if (storedData) {
    const parsedData = JSON.parse(storedData)
    Role = parsedData.state.rol
  }

  useEffect(() => {
    if (isTokenValid()) {
      if (Role === '3') {
        navigate('/usuarios')
      } else if (Role === '2') {
        navigate('/perfiles')
      } else if (Role === '4') {
        navigate('/resumen')
      } else if (Role === '5') {
        navigate('/mutuarias')
      }
    }
  }, [navigate])

  const onSubmit = async (data) => {
    setOpen(true)
    try {
      const { success, message, result } = await IniciarSesion(data, navigate)
      if (success) {
        if (result === '3') {
          navigate('/usuarios')
        } else if (result === '2') {
          navigate('/perfiles')
        } else if (result === '4') {
          navigate('/resumen')
        } else if (result === '5') {
          navigate('/mutuarias')
        }
      } else {
        toast.error(message, { duration: 1000 })
      }
    } finally {
      setOpen(false)
    }
  }

  return (
    <>
      <Toaster richColors />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {!isMdDown && (
          <Box sx={{ backgroundColor: 'white', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
            <img src={ImgLogin} />
          </Box>
        )}
        <Box sx={{ backgroundColor: 'rgb(252, 252, 252)', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <img src={Logo} />
          <Box sx={{ width: '70%', display: 'flex', flexDirection: 'column', marginTop: 5 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name='run'
                control={control}
                defaultValue=''
                rules={{
                  required: 'El Run es requerido',
                  pattern: {
                    value: /^[0-9.kK-]*$/,
                    message: 'Solo se permiten números, puntos y la letra K'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Run'
                    fullWidth
                    inputProps={{ maxLength: 12 }}
                    error={!!errors.run}
                    helperText={errors.run ? errors.run.message : ' '}
                    onChange={(e) => {
                      field.onChange(e)
                      onChangeInput(e, setValue)
                    }}
                  />
                )}
              />
              <Controller
                name='contrasena'
                control={control}
                defaultValue=''
                rules={{ required: 'La contraseña es requerida' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Contraseña'
                    type='password'
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    error={!!errors.contrasena}
                    helperText={errors.contrasena ? errors.contrasena.message : ' '}
                  />
                )}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                disableTouchRipple
                sx={{
                  backgroundColor: 'rgb(220,50,44)',
                  '&:hover': { backgroundColor: 'rgb(220,0,44)' }
                }}
              >
                Iniciar Sesión
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color='error' />
      </Backdrop>
    </>
  )
}
