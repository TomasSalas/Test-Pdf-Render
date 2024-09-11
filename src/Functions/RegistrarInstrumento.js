import moment from 'moment'
import { UrlBaseInstrumentos } from '../Helpers/Rutas'

export const RegistrarInstrumento = async (payload) => {
  const { NOMBRE, CODIGO, UCL } = payload

  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const params = {
    codInstrumento: CODIGO,
    descInstrumento: NOMBRE,
    idUclInstrumento: UCL.idUcl,
    fechaCreacionInstrumento: moment().format('YYYY-MM-DD')
  }

  const response = await fetch(UrlBaseInstrumentos + 'RegistrarInstrumento', {
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
