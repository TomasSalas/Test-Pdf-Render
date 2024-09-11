import moment from 'moment'
import { UrlModerador } from '../Helpers/Rutas'

export const RegistrarUsuariosMasivo = async (payload, IdCliente) => {
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const modifiedPayload = payload.map(item => {
    return {
      nombreUsuario: item.NOMBRES,
      apellidoUsuario: item.APELLIDOS,
      generoUsuario: item.GENERO.toUpperCase(),
      runUsuario: item.RUN.toString().replace('-', '').replace(/\./g, ''),
      emailUsuario: item.EMAIL,
      telefonoUsuario: item.TELEFONO ? item.TELEFONO.toString() : '',
      fechaNacimientoUsuario: item.FECHA_NACIMIENTO,
      regionUsuario: item.REGION.toUpperCase(),
      ciudadUsuario: item.CIUDAD.toUpperCase(),
      areaUsuario: item.AREA ? item.AREA : null,
      fechaIngresoUsuario: moment().format('YYYY-MM-DD'),
      flgCargoJefaturaUsuario: item.JEFATURA.toUpperCase() === 'SI',
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

  const resultData = Array.isArray(result) ? result[0] : result

  const { isExitoso, errorMessages, resultado, mensajeExitoso } = resultData

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
