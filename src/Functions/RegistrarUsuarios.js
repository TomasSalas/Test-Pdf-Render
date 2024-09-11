import moment from 'moment'
import { UrlModerador } from '../Helpers/Rutas'

export const RegistrarUsuarios = async (payload, IdCliente) => {
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const modifiedPayload = payload.map(item => {
    return {
      nombreUsuario: item.NOMBRES,
      apellidoUsuario: item.APELLIDOS,
      generoUsuario: item.GENERO.nombre,
      runUsuario: item.RUN.replace('-', '').replace(/\./g, ''),
      emailUsuario: item.EMAIL,
      telefonoUsuario: item.TELEFONO,
      fechaNacimientoUsuario: item.FECHA_NACIMIENTO.format('YYYY-MM-DD'),
      regionUsuario: item.REGION.nombre,
      ciudadUsuario: item.CIUDAD,
      areaUsuario: item.AREA ? item.AREA : null,
      fechaIngresoUsuario: moment().format('YYYY-MM-DD'),
      flgCargoJefaturaUsuario: item.JEFATURA.idJefatura.toString().toUpperCase() === 'X',
      idClienteUsuario: IdCliente
    }
  })

  const response = await fetch(UrlModerador + 'registrarusuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    },

    body: JSON.stringify(modifiedPayload)
  })

  const result = await response.json()
  if (result[0] === undefined) {
    const { isExitoso, errorMessages, resultado, mensajeExitoso } = result

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
  } else {
    const { isExitoso, errorMessages, resultado, mensajeExitoso } = result[0]

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
}
