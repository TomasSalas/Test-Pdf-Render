import moment from 'moment'
import { UrlBaseComercial } from '../Helpers/Rutas'

export const RegistrarContratos = async (payload) => {
  const { DESC, CLIENTE, FECHA_INICIO, FECHA_TERMINO, CANTIDAD_CANDIDATO } = payload

  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const params = {
    idClienteContrato: CLIENTE.idCliente,
    descContrato: DESC,
    fechaCreacionContrato: moment().format('YYYY-MM-DD'),
    fechaInicioContrato: moment(FECHA_INICIO).format('YYYY-MM-DD'),
    fechaFinContrato: moment(FECHA_TERMINO).format('YYYY-MM-DD'),
    cantCandidatos: CANTIDAD_CANDIDATO
  }

  const response = await fetch(UrlBaseComercial + 'RegistrarContrato', {
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
