import { UrlBaseComercial } from '../Helpers/Rutas'

export const RegistrarDetalleContratos = async (payload) => {
  const { CONTRATO, MONTO, TIPO_COBRO, TIPO_PROCESO } = payload

  const token = window.localStorage.getItem('token')
  const auth = `Bearer ${token}`
  let montoFormat = ''

  if (TIPO_COBRO.idCobro === '1') {
    montoFormat = MONTO.replace('$', '').trim()
  } else if (TIPO_COBRO.idCobro === '2') {
    montoFormat = MONTO.replace('UF', '').trim()
  }
  const params = {
    idContrato: CONTRATO.idContrato,
    idTipoProcesoDetalleContrato: TIPO_PROCESO.idTipoProceso,
    idUsuarioDetalleContrato: 5,
    tipoCobroDetalleContrato: TIPO_COBRO.nombre,
    cantidadDetalleContrato: montoFormat
  }

  const response = await fetch(UrlBaseComercial + 'RegistrarDetalleContrato', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth
    },

    body: JSON.stringify(params)
  })

  const { isExitoso, mensajeExitoso, errorMessages, resultado } = await response.json()

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
