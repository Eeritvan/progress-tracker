import { Book, Code, TentTree, School } from 'lucide-react'

interface IconSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any
  error?: string
  icons: readonly ['Book', 'Code', 'Tent-tree', 'School']
}

const iconComponents = {
  'Book': Book,
  'Code': Code,
  'Tent-tree': TentTree,
  'School': School
}

const IconSelector = ({ register, error, icons }: IconSelectorProps) => {
  return (
    <>
      <div className='flex'>
        {icons.map(icon => {
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
