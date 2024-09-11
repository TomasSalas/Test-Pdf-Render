import moment from 'moment'
import { UrlBaseComercial } from '../Helpers/Rutas'

export const RegistrarClientes = async (payload, idMutual) => {
  const { NOMBRE, NOMBRE_FANTASIA, RUT, EMAIL, TELEFONO, REGION, CIUDAD, DIRECCION, SUCURSAL } = payload

  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const params = {
    nombreCliente: NOMBRE,
    nombreFantasiaCliente: NOMBRE_FANTASIA,
    rutCliente: RUT.replace('-', '').replace(/\./g, ''),
    telefonoCliente: TELEFONO,
    emailCliente: EMAIL,
    direccionCliente: DIRECCION,
    ciudadCliente: CIUDAD,
    regionCliente: REGION.nombre,
    fechaIngresoCliente: moment().format('YYYY-MM-DD'),
    idSucursalCliente: SUCURSAL.idSucursal,
    idMutualidadCliente: idMutual
  }

  const response = await fetch(UrlBaseComercial + 'RegistrarClientes', {
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
