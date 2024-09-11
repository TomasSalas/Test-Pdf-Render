import { UrlUsuario } from '../Helpers/Rutas'

export const RegistrarPreguntaRendir = async (respuesta, idDigita) => {
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const params = respuesta.map((respuesta) => ({
    idInstrumentoRegistroEvaluacionTeorica: respuesta.idInstrumentoDetalleInstrumento,
    idProcesoDigitadoRegistroEvaluacionTeorica: idDigita,
    nroPreguntaRegistroEvaluacionTeorica: respuesta.nroPreguntaDetalleInstrumento,
    descPreguntaRegistroEvaluacionTeorica: respuesta.descPreguntaDetalleInstrumento,
    descRespuestaRegistroEvaluacionTeorica: respuesta.descRespuestaDetalleInstrumento,
    alternativaSeleccionadaRegistroEvaluacionTeorica: respuesta.alternativaSeleccionada,
    fechaRegistroEvaluacionTeorica: respuesta.tiempoRespuesta
  }))

  const response = await fetch(UrlUsuario + 'RegistrarEvaluacionTeorica', {
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
