import moment from 'moment'
import { UrlBaseInstrumentos } from '../Helpers/Rutas'

export const RegistrarUcl = async (payload) => {
  const { NOMBRE, CODIGO } = payload

  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const params = {
    descUcl: NOMBRE,
    codUcl: CODIGO,
    fechaCreacionUcl: moment().format('YYYY-MM-DD')
  }

  const response = await fetch(UrlBaseInstrumentos + 'RegistrarUcl', {
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
