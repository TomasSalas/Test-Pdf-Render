import { FormatRut } from './FormatRut'

export const onChangeInput = (e, setValue) => {
  const value = e.target.value.replace(/[^0-9kK]/g, '')
  if (value.length <= 9) {
    setValue('RUN', FormatRut(value.toUpperCase()), { shouldValidate: true })
    setValue('run', FormatRut(value.toUpperCase()), { shouldValidate: true })
  }
}
