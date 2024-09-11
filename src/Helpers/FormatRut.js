export const FormatRut = (rut) => {
  rut = rut.toString()

  if (typeof rut !== 'string') {
    return rut
  }

  const runAux = rut.replace(/\./g, '').replace(/-/g, '')
  if (runAux.length <= 2) {
    return rut
  }

  let cuerpo = runAux.slice(0, -1)
  const dv = runAux.slice(-1).toUpperCase()

  if (isNaN(cuerpo)) {
    return rut
  }

  cuerpo = new Intl.NumberFormat('es-CL').format(cuerpo)
  return cuerpo + '-' + dv
}
