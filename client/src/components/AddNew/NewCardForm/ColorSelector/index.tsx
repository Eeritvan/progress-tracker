interface ColorSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any
  error?: string
  colors: readonly ['blue', 'red', 'green']
}

const ColorSelector = ({ register, error, colors }: ColorSelectorProps) => {
  return (
    <>
      <div className='flex'>
        {colors.map(color => (
          <div key={color}>
            <input
              type='radio'
              id={color}
              value={color}
              {...register('color')}
            />
            <label htmlFor={color}>{color}</label>
          </div>
        ))}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </>
  )
}

export default ColorSelector
