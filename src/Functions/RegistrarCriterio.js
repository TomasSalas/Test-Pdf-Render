import moment from 'moment'
import { UrlBaseInstrumentos } from '../Helpers/Rutas'

export const RegistrarCriterio = async (payload) => {
  const { DESC, CODIGO, ACTIVIDAD } = payload

  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const params = {
    codCriterio: CODIGO,
    descCriterio: DESC,
    idActividadCriterio: ACTIVIDAD.idActividad,
    fechaCreacionCriterio: moment().format('YYYY-MM-DD')
  }

  const response = await fetch(UrlBaseInstrumentos + 'RegistrarCriterio', {
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
