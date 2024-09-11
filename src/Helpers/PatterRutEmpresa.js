import { FormatRut } from './FormatRut'

export const onChangeInputRut = (e, setValue) => {
  const value = e.target.value.replace(/[^0-9kK]/g, '')
  if (value.length <= 9) {
    setValue('RUT', FormatRut(value.toUpperCase()), { shouldValidate: true })
  }
}
