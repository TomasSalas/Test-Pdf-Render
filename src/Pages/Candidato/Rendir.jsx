import { useLocation, useNavigate } from 'react-router-dom'
import { InfoInstrumentoRendir } from '../../Functions/InfoInstrumentoRendir'
import { useEffect, useRef, useState } from 'react'
import { Container, Typography, Button, Box, Checkbox, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Backdrop, CircularProgress, TableContainer, TableHead, Table, TableRow, TableCell, TableBody, TextField } from '@mui/material'
import { FooterPrueba } from '../../Components/Footer'
import { Header } from '../../Components/Header'
import { toast, Toaster } from 'sonner'
import { RegistrarPreguntaRendir } from '../../Functions/RegistrarPreguntaRendir'
import { ListarInfoInforme } from '../../Functions/ListarInfoInforme'
import { saveAs } from 'file-saver'
import { pdf } from '@react-pdf/renderer'
import { Pdf } from './Pdf'
import { RegistrarRespuestaBorrador } from '../../Functions/RegistrarRespuestaBorrador'
import { HistorialPrueba } from '../../Functions/HistorialPrueba'
import moment from 'moment'
import { useForm } from 'react-hook-form'
import { RegistrarOpinion } from '../../Functions/RegistrarOpinion'

export const Rendir = () => {
  const location = useLocation()
  const { tipoPrueba, idDigitacion } = location.state || {}
  const { handleSubmit, register, reset } = useForm()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [respuestas, setRespuestas] = useState([])
  const [pruebaCompleta, setPruebaCompleta] = useState([])
  const [infoInforme, setInfoInforme] = useState([])
  const [porcentaje, setPorcentaje] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [open, setOpen] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [boxPregunta, setBoxPregunta] = useState(true)
  const [boxInforme, setBoxInforme] = useState(false)
  const [boxRevision, setBoxRevision] = useState(false)
  const [savePregunta, setSavePregunta] = useState(true)

  const timerRef = useRef(null)

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const ListarInstrumento = async () => {
    let tiempoMenor
    const { result: instrumentResult } = await InfoInstrumentoRendir(tipoPrueba)
    const desordenado = instrumentResult.sort(() => Math.random() - 0.5)
    const idInstrumento = instrumentResult[0].idInstrumentoDetalleInstrumento
    const { error: historyError, result: historyResult } = await HistorialPrueba(idDigitacion)

    if (historyError) {
      const orderedData = desordenado.map((pregunta, index) => ({
        ...pregunta,
        nroPregunta: index + 1,
        alternativaSeleccionada: null
      }))
      setData(orderedData)
      window.localStorage.setItem('data', JSON.stringify(orderedData))
      return
    }

    const historialFiltrado = historyResult.filter(
      (respuesta) => respuesta.idInstrumento === idInstrumento
    )

    // Si hay respuestas en el historial, calculamos el menor tiempo.
    if (historialFiltrado.length > 0) {
      const tiemposEnSegundos = historialFiltrado.map(historial => {
        // eslint-disable-next-line no-unused-vars
        const [datePart, timePart] = historial.fechaRegistro.split('T')
        const [hour, minute, second] = timePart.split(':').map(Number)
        return (hour * 3600) + (minute * 60) + second
      })

      tiempoMenor = Math.min(...tiemposEnSegundos)
      setTimeRemaining(tiempoMenor)
    }

    // Filtrar las preguntas contestadas.
    const preguntasContestadas = desordenado.filter(pregunta => {
      const historialRespuesta = historyResult.find(
        (respuesta) => respuesta.nroPregunta === pregunta.nroPreguntaDetalleInstrumento && respuesta.idInstrumento === idInstrumento
      )
      return historialRespuesta && historialRespuesta.alternativaSeleccionada
    })

    // Filtrar las preguntas no contestadas.
    const preguntasNoContestadas = desordenado.filter(pregunta => {
      const historialRespuesta = historyResult.find(
        (respuesta) => respuesta.nroPregunta === pregunta.nroPreguntaDetalleInstrumento && respuesta.idInstrumento === idInstrumento
      )
      return !historialRespuesta || !historialRespuesta.alternativaSeleccionada
    })

    // Mapea las preguntas no contestadas.
    const updatedData = preguntasNoContestadas.map((pregunta, index) => ({
      ...pregunta,
      nroPregunta: index + 1,
      alternativaSeleccionada: null,
      tiempoRespuesta: null
    }))

    const contestadasData = preguntasContestadas.map((pregunta, index) => {
      const historialRespuesta = historyResult.find(
        (respuesta) => respuesta.nroPregunta === pregunta.nroPreguntaDetalleInstrumento && respuesta.idInstrumento === idInstrumento
      )
      return {
        ...pregunta,
        nroPregunta: index + 1,
        alternativaSeleccionada: historialRespuesta ? historialRespuesta.alternativaSeleccionada : null,
        tiempoRespuesta: historialRespuesta ? historialRespuesta.fechaRegistro : null
      }
    })

    window.localStorage.setItem('preguntasContestadas', JSON.stringify(contestadasData))

    setData(updatedData)
    setRespuestas(updatedData)
    window.localStorage.setItem('data', JSON.stringify(updatedData))
    window.localStorage.setItem('respuestas', JSON.stringify(updatedData))
  }

  const handleNext = async () => {
    setSavePregunta(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length)
  }

  const handleFinalizar = async () => {
    const respuestasAdicionales = JSON.parse(window.localStorage.getItem('preguntasContestadas') || '[]')
    const respuestas = JSON.parse(window.localStorage.getItem('respuestas') || '[]')

    const arrayUnion = [...respuestasAdicionales, ...respuestas]
    const preguntasSinContestar = arrayUnion.filter((respuesta) => !respuesta.alternativaSeleccionada || respuesta.alternativaSeleccionada === null)
    if (preguntasSinContestar.length > 0) {
      setOpen(true)
    } else {
      setBoxPregunta(false)
      setBoxRevision(true)
      setPruebaCompleta(arrayUnion)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleGuardarPrueba = async () => {
    setOpenAlert(true)
    try {
      const { error, message } = await RegistrarPreguntaRendir(pruebaCompleta, idDigitacion)
      if (!error) {
        toast.success(message, { duration: 1000 })
        if (tipoPrueba === 'ECT') {
          setBoxRevision(false)
          setBoxInforme(true)

          const { error, message, result } = await ListarInfoInforme(idDigitacion)
          if (!error) {
            setInfoInforme(result)
            setPorcentaje(result.informe[0]?.porcentFinal)
            setResultado(result.informe[0]?.resolucion)
          } else {
            toast.error(message)
          }
        } else {
          await new Promise((resolve) => setTimeout(() => {
            window.localStorage.removeItem('data')
            window.localStorage.removeItem('respuestas')
            window.localStorage.removeItem('lastAnsweredIndex')
            window.localStorage.removeItem('timeRemaining')
            resolve()
          }, 1000))

          navigate('/resumen', { replace: true })
        }
      }
    } finally {
      setOpenAlert(false)
    }
  }

  const irAtras = () => {
    setBoxPregunta(true)
    setBoxRevision(false)
  }

  const informePCT = async () => {
    const doc = <Pdf data={infoInforme.informe} brechas={infoInforme.brecha} />
    const blob = await pdf(doc).toBlob()
    saveAs(blob, 'InformeConocimientoTeorico.pdf')
    await new Promise((resolve) => setTimeout(() => {
      window.localStorage.removeItem('data')
      window.localStorage.removeItem('respuestas')
      window.localStorage.removeItem('lastAnsweredIndex')
      window.localStorage.removeItem('timeRemaining')
      resolve()
    }, 10000))

    navigate('/resumen', { replace: true })
  }

  const onOpinion = async (e) => {
    setOpenAlert(true)
    try {
      if (e.Opinion !== '') {
        const { error, message } = await RegistrarOpinion(e.Opinion, idDigitacion)
        if (!error) {
          toast.success(message)
          reset()
        } else {
          toast.error(message)
        }
      }
    } finally {
      setOpenAlert(false)
    }
  }

  const handleCheckboxChange = async (index, alternativa) => {
    let nuevaRepuesta
    const alternativaMayuscula = alternativa.charAt(0).toUpperCase()
    setRespuestas((prevRespuestas) => {
      const newRespuestas = data.map((pregunta, i) => {
        if (i === index) {
          return {
            ...pregunta,
            alternativaSeleccionada: alternativaMayuscula,
            tiempoRespuesta: moment().format('YYYY-MM-DD') + 'T' + formatTime(timeRemaining)
          }
        } else {
          return prevRespuestas[i] || pregunta
        }
      })

      window.localStorage.setItem('respuestas', JSON.stringify(newRespuestas))
      window.localStorage.setItem('lastAnsweredIndex', index)
      nuevaRepuesta = newRespuestas
      return newRespuestas
    })

    const { message, error } = await RegistrarRespuestaBorrador(nuevaRepuesta[index], alternativaMayuscula, formatTime(timeRemaining), idDigitacion)

    if (!error) {
      setSavePregunta(false)
      toast.success(message, { duration: 1000 })
    }
  }

  const pregunta = data[currentIndex]

  useEffect(() => {
    const storedData = JSON.parse(window.localStorage.getItem('data'))

    if (storedData) {
      setData(storedData)
    } else {
      ListarInstrumento()
    }

    const storedTimeRemaining = window.localStorage.getItem('timeRemaining')
    if (storedTimeRemaining === 'null' || !storedTimeRemaining) {
      setTimeRemaining(0)
      let initialTime = 0
      if (tipoPrueba === 'ECT') {
        initialTime = 120 * 60
      } else if (tipoPrueba === 'EP') {
        initialTime = 60 * 60
      }
      setTimeRemaining(initialTime)
    } else {
      setTimeRemaining(parseInt(storedTimeRemaining, 10))
    }

    const respuestasGuardadas = JSON.parse(window.localStorage.getItem('respuestas'))
    if (respuestasGuardadas) {
      setRespuestas(respuestasGuardadas)

      const lastAnsweredIndex = parseInt(window.localStorage.getItem('lastAnsweredIndex'), 10)
      if (!isNaN(lastAnsweredIndex)) {
        const nextIndex = lastAnsweredIndex + 1
        if (nextIndex < storedData.length) {
          setCurrentIndex(nextIndex)
        } else {
          setCurrentIndex(storedData.length - 1)
        }
      }
    } else {
      setRespuestas(new Array(data.length).fill({}))
    }
  }, [tipoPrueba])

  useEffect(() => {
    if (timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1
          window.localStorage.setItem('timeRemaining', newTime)
          return newTime
        })
      }, 1000)
    } else if (timeRemaining === 0 && timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timeRemaining])

  return (
    <>
      <Toaster richColors position='bottom-left' />
      <Header formatTime={formatTime} timeRemaining={timeRemaining} />
      <Container maxWidth={boxRevision ? 'xxl' : 'lg'} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
        {boxPregunta && (

          <Box component={Paper} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: 3, marginTop: 15 }}>
            <Typography variant='h4' sx={{ fontWeight: 'bold' }}>Pregunta {pregunta?.nroPregunta}</Typography>
            <Box>
              <Typography sx={{ whiteSpace: 'pre-line', marginTop: 2, lineHeight: 1.5 }}>{pregunta?.descPreguntaDetalleInstrumento}</Typography>
            </Box>
            <Box sx={{ marginTop: 2, marginBottom: 1 }}>
              {pregunta?.descRespuestaDetalleInstrumento.split('\n').map((alternativa, index) => {
                return (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginLeft: -1.5 }}>
                    <Checkbox
                      checked={
                        respuestas[currentIndex]?.alternativaSeleccionada === alternativa.charAt(0).toUpperCase() ||
                        (window.localStorage.getItem('respuestas') ? JSON.parse(window.localStorage.getItem('respuestas'))[currentIndex]?.alternativaSeleccionada === alternativa.charAt(0).toUpperCase() : false)
                      }
                      onChange={() => handleCheckboxChange(currentIndex, alternativa)}
                    />
                    <Typography>{alternativa}</Typography>
                  </Box>
                )
              })}
            </Box>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 2, gap: 10 }}>
              {/* <Button variant='outlined' color='error' onClick={handlePrevious} disabled={currentIndex === 0}>
                Atrás
              </Button> */}
              {currentIndex < data.length - 1 && (
                <Button variant='outlined' color='error' onClick={handleNext} disabled={savePregunta}>
                  Siguiente
                </Button>
              )}
              {currentIndex === data.length - 1 && (
                <Button variant='outlined' color='success' onClick={handleFinalizar}>
                  Finalizar
                </Button>
              )}
            </Box>
          </Box>
        )}

        {boxInforme && (
          <Box component={Paper} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: 5, gap: 2 }}>
            <Typography variant='h4' sx={{ fontWeight: 'bold' }}> Gracias por contestar la {tipoPrueba === 'ECT' ? 'evaluación' : 'encuesta'}</Typography>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}> Tu opinión nos ayuda a mejorar , puedes dejar un comentario o sugerencia</Typography>
            <Box sx={{ width: '100%' }}>
              <form onSubmit={handleSubmit(onOpinion)}>
                <TextField label='Escriba acá' fullWidth multiline rows={6} {...register('Opinion')} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                  <Button variant='outlined' color='success' type='submit'> Enviar  </Button>
                </Box>

              </form>
            </Box>

            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold' }}> Porcentaje de logro: {porcentaje}%</Typography>
              <Typography variant='h6' sx={{ fontWeight: 'bold' }}> Resultado: {resultado}</Typography>
            </Box>
            <Button variant='outlined' color='success' onClick={() => { informePCT() }}> Descargar Informe </Button>
          </Box>
        )}

        {boxRevision && (
          <Box>
            <Box component={Paper} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant='h4' sx={{ fontWeight: 'bold' }}> Confirmación de {tipoPrueba === 'ECT' ? 'Evaluación' : 'Encuesta'}</Typography>
            </Box>
            <Box component={Paper} sx={{ marginBottom: 2 }}>
              <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}> N°</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}> Pregunta</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}> Alternativa Seleccionada</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pruebaCompleta.length > 0 && pruebaCompleta.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell sx={{ whiteSpace: 'pre-line' }}>{item.descPreguntaDetalleInstrumento}</TableCell>
                          <TableCell sx={{ textAlign: 'center', fontSize: '18px' }}>{item.alternativaSeleccionada}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ padding: 2, marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='outlined' color='error' onClick={() => irAtras()}> Átras</Button>
                <Button variant='outlined' color='success' aria-hidden onClick={() => handleGuardarPrueba()}> Finalizar</Button>
              </Box>
            </Box>

          </Box>
        )}
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Atención</DialogTitle>
        <DialogContent>
          Existen preguntas sin contestar. Por favor, revise y complete todas las preguntas antes de finalizar.
        </DialogContent>
        <DialogActions>
          <Button color='error' variant='outlined' onClick={handleClose}>Aceptar</Button>
        </DialogActions>
      </Dialog>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openAlert}>
        <CircularProgress color='error' />
      </Backdrop>

      <FooterPrueba />
    </>
  )
}
