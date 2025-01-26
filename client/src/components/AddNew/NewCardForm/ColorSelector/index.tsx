import { COLORS } from '@/utils/constants'

interface ColorSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any
  error?: string
}

const ColorSelector = ({ register, error }: ColorSelectorProps) => {
  return (
    <>
      <div className='flex'>
        {COLORS.map(color => (
          <div key={color}>
            <input
              type='radio'
              id={color}
              value={color}
              className='appearance-none aspect-square rounded-lg m-1 h-7
                relative checked:before:absolute checked:before:w-3
                checked:before:h-3 checked:before:bg-black
                checked:before:rounded checked:before:top-1/2
                checked:before:left-1/2 checked:before:-translate-x-1/2
                checked:before:-translate-y-1/2'
              style={{ background: color }}
              {...register('color')}
            />
          </div>
        ))}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </>
  )
}

export default ColorSelector
