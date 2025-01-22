interface ColorSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
}

const ColorSelector = ({ register, error }: ColorSelectorProps) => {
  return (
    <div>
      <div>
        <input
          type='radio'
          id='blue'
          value='blue'
          {...register('color')}
        />
        <label htmlFor='blue'>blue</label>

        <input
          type='radio'
          id='red'
          value='red'
          {...register('color')}
        />
        <label htmlFor='red'>red</label>

        <input
          type='radio'
          id='green'
          value='green'
          {...register('color')}
        />
        <label htmlFor='green'>green</label>
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
}

export default ColorSelector
