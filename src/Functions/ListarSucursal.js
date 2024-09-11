import { UrlBaseComercial } from '../Helpers/Rutas'

export const ListarSucursal = async () => {
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const response = await fetch(UrlBaseComercial + 'ListaSucursal', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    }
  })

  const { isExitoso, resultado, errorMessages } = await response.json()

  if (isExitoso) {
    return {
      error: false,
      message: 'OK',
      result: resultado
    }
  } else {
    return {
      error: true,
      message: errorMessages,
      result: resultado
    }
  }
}
