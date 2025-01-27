import {
  Book,
  Code,
  TentTree,
  School,
  AlarmClock,
  Brush,
  CalendarDays,
  Gamepad2,
  NotebookPen,
  Coffee,
  Wallet
} from 'lucide-react'
import { ICONS } from '@/utils/constants'

interface IconSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any
  error?: string
}

const iconComponents = {
  'Book': Book,
  'Code': Code,
  'TentTree': TentTree,
  'School': School,
  'AlarmClock': AlarmClock,
  'Brush': Brush,
  'CalendarDays': CalendarDays,
  'Gamepad2': Gamepad2,
  'NotebookPen': NotebookPen,
  'Coffee': Coffee,
  'Wallet': Wallet
}

const IconSelector = ({ register, error }: IconSelectorProps) => {
  return (
    <>
      <div className='flex'>
        {ICONS.map(icon => {
          const IconComponent = iconComponents[icon]
          return (
            <div key={icon}>
              <input
                type='radio'
                id={icon}
                value={icon}
                {...register('icon')}
                className='appearance-none bg-iconbg aspect-square rounded-lg
                  m-1 h-7 checked:bg-neutral-50'
              />
              <label
                htmlFor={icon}
                className='absolute -translate-x-7 translate-y-1.5'
              >
                <IconComponent size={20} />
              </label>
            </div>
          )
        })}
      </div>
      {error && <span className='text-red-500 text-sm'>{error}</span>}
    </>
  )
}

export default IconSelector
