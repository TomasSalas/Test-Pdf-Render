import moment from 'moment'
import { UrlUsuario } from '../Helpers/Rutas'

export const EditarInformacion = async (payload, id) => {
  const { nombreUsuario, apellidoUsuario, telefonoUsuario, regionUsuario, ciudadUsuario, areaUsuario, emailUsuario, generoUsuario, fechaNacimientoUsuario } = payload

  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const params = {
    nombreUsuario,
    apellidoUsuario,
    generoUsuario,
    emailUsuario,
    telefonoUsuario,
    fechaNacimientoUsuario: moment(fechaNacimientoUsuario).format('YYYY-MM-DD'),
    regionUsuario,
    ciudadUsuario,
    areaUsuario
  }

  const response = await fetch(UrlUsuario + 'ActualizarUsuario?idUsuario=' + id, {
    method: 'PUT',
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
