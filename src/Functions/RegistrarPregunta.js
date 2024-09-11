import { UrlBaseInstrumentos } from '../Helpers/Rutas'

export const RegistrarPregunta = async (payload) => {
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const modifiedPayload = payload.map(item => {
    return {
      idInstrumentoDetalleInstrumento: item.INSTRUMENTO.idInstrumento,
      nroPreguntaDetalleInstrumento: item.NROPREGUNTA,
      descPreguntaDetalleInstrumento: item.PREGUNTA,
      descRespuestaDetalleInstrumento: item.RESPUESTA,
      descBrechaDetalleInstrumento: item.BRECHA,
      descRecomendacionDetalleInstrumento: item.RECOMENDACION,
      alternativaCorrectaDetalleInstrumento: item.ALTERNATIVA,
      idActividadDetalleInstrumento: item.ACTIVIDAD.idActividad,
      descActividad: item.ACTIVIDAD.descActividad,
      idCriterioDetalleInstrumento: item.CRITERIO.idCriterio,
      descCriterio: item.CRITERIO.descCriterio,
      descReferenciaBibliografica: item.REFERENCIA
    }
  })

  const response = await fetch(UrlBaseInstrumentos + 'RegistrarDetalleInstrumento', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    },
    body: JSON.stringify(modifiedPayload)
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
