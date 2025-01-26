import { Book, Code, TentTree, School } from 'lucide-react'
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
  'School': School
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
              />
              <label htmlFor={icon}>
                <IconComponent size={24} />
              </label>
            </div>
          )
        })}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </>
  )
}

export default IconSelector
