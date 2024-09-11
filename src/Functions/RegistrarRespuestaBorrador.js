import { UrlUsuario } from '../Helpers/Rutas'
import moment from 'moment'

export const RegistrarRespuestaBorrador = async (respuesta, alternativa, tiempo, idDigita) => {
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const params = [{
    idInstrumento: respuesta.idInstrumentoDetalleInstrumento,
    idProcesoDigitado: idDigita,
    nroPregunta: respuesta.nroPreguntaDetalleInstrumento,
    descPregunta: respuesta.descPreguntaDetalleInstrumento,
    descRespuesta: respuesta.descRespuestaDetalleInstrumento,
    alternativaSeleccionada: alternativa,
    fechaRegistro: moment().format('YYYY-MM-DD') + 'T' + tiempo
  }]

  const response = await fetch(UrlUsuario + 'RegistrarBorradorEvaluacionesTeoricas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    },

    body: JSON.stringify(params)
  })

  const { isExitoso, errorMessages, resultado, mensajeExitoso } = await response.json()

  if (isExitoso) {
    return {
      error: false,
      message: mensajeExitoso,
      data: resultado
    }
  } else {
    return {
      error: true,
      message: errorMessages,
      data: resultado
    }
  }
}
