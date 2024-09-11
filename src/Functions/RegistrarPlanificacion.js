import { UrlModerador } from '../Helpers/Rutas'

export const RegistrarPlanificacion = async (payload, idUsuarios) => {
  const { CLIENTE, CONTRATO, INSTRUMENTO_1, INSTRUMENTO_2 } = payload

  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`

  let ultimaRespuesta

  for (const idUsuario of idUsuarios) {
    const params = {
      idUsuarioProcesoPlanificado: idUsuario,
      idClienteProcesoPlanificado: CLIENTE.idCliente,
      idContratoProcesoPlanificado: CONTRATO.idContrato,
      idInstrumento1ProcesoPlanificado: INSTRUMENTO_1.idInstrumento,
      idInstrumento2ProcesoPlanificado: INSTRUMENTO_2 ? INSTRUMENTO_2.idInstrumento : null
    }

    const response = await fetch(UrlModerador + 'RegistrarProcesoPlanificado', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth
      },
      body: JSON.stringify(params)
    })

    const { isExitoso, errorMessages, resultado, mensajeExitoso } = await response.json()
    ultimaRespuesta = { isExitoso, errorMessages, resultado, mensajeExitoso }
  }

  if (ultimaRespuesta.isExitoso) {
    return {
      error: false,
      message: ultimaRespuesta.mensajeExitoso,
      data: ultimaRespuesta.resultado
    }
  } else {
    return {
      error: true,
      message: ultimaRespuesta.errorMessages,
      data: ultimaRespuesta.resultado
    }
  }
}
