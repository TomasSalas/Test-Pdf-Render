import moment from 'moment'
import { UrlUsuario } from '../Helpers/Rutas'

export const RegistrarOpinion = async (payload, idProceso) => {
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const params = {
    descripcion: payload,
    fechaRegistro: moment().format('YYYY-MM-DD'),
    idProcesoDigitado: idProceso
  }

  const response = await fetch(UrlUsuario + 'registrarobservaciones', {
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
