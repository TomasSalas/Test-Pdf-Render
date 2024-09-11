import { UrlModerador } from '../Helpers/Rutas'

export const ListarPlanificados = async (idCliente, idContrato) => {
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const response = await fetch(UrlModerador + 'ListaProcesoPlanificado?idCliente=' + idCliente + '&idContrato=' + idContrato, {
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
