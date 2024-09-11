import { UrlBaseComercial } from '../Helpers/Rutas'

export const RegistrarSucursal = async (payload) => {
  const { NOMBRE } = payload

  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const params = {
    descSucursal: NOMBRE
  }

  const response = await fetch(UrlBaseComercial + 'RegistrarSucursal', {
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
