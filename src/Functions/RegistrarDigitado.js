import moment from 'moment'
import { UrlUsuario } from '../Helpers/Rutas'

export const RegistrarDigitados = async (pct, ep, idCliente, idPlan) => {
  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  const params = {
    idClienteProcesoDigitado: idCliente,
    flgAceptaTerminosPctProcesoDigitado: pct,
    flgAceptaTerminosEpProcesoDigitado: ep,
    porcPctProcesoDigitado: 0,
    porcEpProcesoDigitado: 0,
    porcFinalProcesoDigitado: 0,
    descResultadoFinalProcesoDigitado: '',
    fechaDigitacionProcesoDigitado: moment().format('YYYY-MM-DD'),
    flgAnuladoProcesoDigitado: false,
    idProcesoPlanificadoProcesoDigitado: idPlan
  }

  const response = await fetch(UrlUsuario + 'RegistrarProcesoDigitado', {
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
