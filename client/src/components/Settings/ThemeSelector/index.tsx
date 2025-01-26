import { THEMES } from '../../../utils/constants'
import { useLocalStorage } from '../../../hooks/useLocalStorage'
import { useQueryClient } from '@tanstack/react-query'

const ThemeSelector = () => {
  const queryClient = useQueryClient()
  const { setItem, getItem } = useLocalStorage('theme')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItem(e.target.value)
    queryClient.invalidateQueries({ queryKey: ['theme'] })
  }

  return (
    <select
      onChange={(e) => handleChange(e)}
      defaultValue={getItem()}
    >
      {THEMES.map(x => (
        <option
          key={x}
          value={x}
        >
          {x}
        </option>
      ))}
    </select>
  )
}

export default ThemeSelector
