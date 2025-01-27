interface FormFieldProps {
  type: string
  error?: string
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any
  placeholder: string
  setValueAs?: (value: string) => number | undefined
}

const FormField = ({
  type,
  error,
  register,
  name,
  placeholder,
  setValueAs
}: FormFieldProps) => {
  return (
    <>
      <input
        {...register(name, { setValueAs })}
        type={type}
        placeholder={placeholder}
        className={`w-[400px] h-12 rounded-xl p-4 border-2 ${
          error ? 'border-red-500' : 'border-neutral-200'
        }`}
      />
      {error && <p>{error}</p>}
    </>
  )
}

export default FormField
