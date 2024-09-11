import moment from 'moment'
import { UrlBaseComercial } from '../Helpers/Rutas'

export const RegistrarMutual = async (payload) => {
  const { NOMBRE, DIRECCION } = payload

  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const params = {
    nombreMutualidad: NOMBRE,
    direccionMutualidad: DIRECCION,
    fechaCreacionMutualidad: moment().format('YYYY-MM-DD')
  }

  const response = await fetch(UrlBaseComercial + 'RegistrarMutualidad', {
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
