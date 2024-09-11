export const formatDateInforme = (date) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' }
  const formattedDate = date.toLocaleDateString('es-ES', options)

  const dateParts = formattedDate.split(' ').filter((part) => part !== 'de')
  const [day, month, year] = dateParts

  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1)

  return `${day} de ${capitalizedMonth} de ${year}`
}
