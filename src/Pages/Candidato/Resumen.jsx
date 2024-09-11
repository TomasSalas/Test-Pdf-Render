import { Backdrop, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { InfoCandidato } from '../../Functions/InfoCandidato'
import { toast, Toaster } from 'sonner'
import { RegistrarDigitados } from '../../Functions/RegistrarDigitado'
import { useNavigate } from 'react-router-dom'
import { FooterPrueba } from '../../Components/Footer'
import { Header } from '../../Components/Header'
import { Box1 } from '../../Components/Candidato/Box1'
import { Box2 } from '../../Components/Candidato/Box2'
import { Box3 } from '../../Components/Candidato/Box3'
import { Box4 } from '../../Components/Candidato/Box4'

export const Resumen = () => {
  const [box1, setBox1] = useState(true)
  const [box2, setBox2] = useState(false)
  const [box3, setBox3] = useState(false)
  const [box4, setBox4] = useState(false)
  const [isCheckbox1Checked, setIsCheckbox1Checked] = useState(false)
  const [isCheckbox2Checked, setIsCheckbox2Checked] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])
  const [dateNew, setDateNew] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [idUsuario, setIdUsuario] = useState(true)
  const navigate = useNavigate()

  // let Nombre = ''
  // let Apellido = ''

  // const storedData = window.localStorage.getItem('userData')

  // if (storedData) {
  //   const parsedData = JSON.parse(storedData)
  //   Nombre = parsedData.state.name
  //   Apellido = parsedData.state.lastName
  // }

  const handleCheckbox1Change = (event) => {
    setIsCheckbox1Checked(event.target.checked)
  }

  const handleCheckbox2Change = (event) => {
    setIsCheckbox2Checked(event.target.checked)
  }

  const handleSiguiente = () => {
    if (data[0].infoValidacion?.condiciones_EP || data[0].infoValidacion?.condiciones_ECT) {
      setBox1(false)
      setBox2(false)
      setBox3(false)
      setBox4(true)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      setBox1(false)
      setBox3(true)

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const handleSiguienteTerminos = () => {
    setBox2(false)
    setBox4(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleBackInfo = () => {
    setBox2(false)
    setBox1(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleBack = () => {
    setBox3(false)
    setBox1(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleInfoCandidato = async () => {
    if (!isCheckbox1Checked && !isCheckbox2Checked) {
      setOpenDialog(true)
    } else {
      setOpen(true)
      try {
        const idCliente = data[0].infoCliente?.idCliente
        const idPlan = data[0].infoUsuario?.idProcesoPlanificado

        const { error, message } = await RegistrarDigitados(isCheckbox1Checked, isCheckbox2Checked, idCliente, idPlan)

        if (!error) {
          informacion()
          setBox3(false)
          setBox2(true)
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        } else {
          toast.error(message)
        }
      } finally {
        setOpen(false)
      }
    }
  }

  const handleBackCandidato = () => {
    if (data[0].infoValidacion?.condiciones_EP || data[0].infoValidacion?.condiciones_ECT) {
      setBox4(false)
      setBox1(true)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      setBox3(true)
      setBox4(false)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const informacion = async () => {
    const { error, result, message } = await InfoCandidato()

    if (!error) {
      setData(result)
      setIdUsuario(result[0].infoUsuario.idUsuario)
      const fechaIngreso = new Date(result[0].infoUsuario.fechaIngresoUsuario)
      const fechaCon72Horas = new Date(fechaIngreso.getTime() + (72 * 60 * 60 * 1000))
      const fechaCon72HorasFormateada = fechaCon72Horas.toISOString().split('T')[0]
      setDateNew(fechaCon72HorasFormateada)
      setIsLoading(false)
    } else {
      toast.error(message)
    }
  }

  const rendirPrueba = async (e) => {
    navigate('/rendir', { state: { tipoPrueba: e, idDigitacion: data[0].infoProcesoDigitado?.idProcesoDigitado } })
  }

  useEffect(() => {
    window.localStorage.removeItem('timeRemaining')
    window.localStorage.removeItem('data')
    window.localStorage.removeItem('respuestas')
    window.localStorage.removeItem('lastAnsweredIndex')
    window.localStorage.removeItem('preguntasContestadas')
    setOpen(false)
    setBox1(true)
    informacion()
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  return (
    <>
      <Toaster richColors />
      <Header navigate={navigate} />
      <Container maxWidth='xl' sx={{ paddingTop: 10, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {
          box1 && (
            <motion.div key='box1' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box1 informacion={informacion} data={data} handleSiguiente={handleSiguiente} isLoading={isLoading} idUsuario={idUsuario} />
            </motion.div>
          )
        }
        {
          data.length > 0 && box2 && (
            <motion.div key='box2' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box2 data={data} handleBackInfo={handleBackInfo} handleSiguienteTerminos={handleSiguienteTerminos} dateNew={dateNew} isCheckbox1Checked={isCheckbox1Checked} isCheckbox2Checked={isCheckbox2Checked} />
            </motion.div>
          )
        }
        {
          data.length > 0 && box3 && (
            <motion.div key='box3' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box3 data={data} isCheckbox1Checked={isCheckbox1Checked} handleCheckbox1Change={handleCheckbox1Change} isCheckbox2Checked={isCheckbox2Checked} handleCheckbox2Change={handleCheckbox2Change} handleBack={handleBack} handleInfoCandidato={handleInfoCandidato} />
            </motion.div>
          )
        }
        {
          data.length > 0 && box4 && (
            <motion.div key='box4' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Box4 data={data} rendirPrueba={rendirPrueba} handleBackCandidato={handleBackCandidato} />
            </motion.div>
          )
        }

        <Dialog open={openDialog} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
          <DialogTitle id='alert-dialog-title'> Terminos y condiciones </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Debe aceptar al menos uno de los términos y condiciones para continuar.
            </DialogContentText>
          </DialogContent>
          <DialogActions> <Button color='error' onClick={handleClose}>Aceptar</Button> </DialogActions>
        </Dialog>

        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
          <CircularProgress color='error' />
        </Backdrop>

      </Container>
      <FooterPrueba />
    </>
  )
}
