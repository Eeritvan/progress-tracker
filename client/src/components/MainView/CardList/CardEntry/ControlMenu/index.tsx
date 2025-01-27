import { ControlledMenu, MenuItem } from '@szhsin/react-menu'
import useCardListSlice from '@/store/cardListStore'
import { Trash2 } from 'lucide-react'

interface ControlMenuProps {
  id: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  anchorPoint: { x: number; y: number }
}

const ControlMenu = (
  { id, isOpen, setOpen, anchorPoint }: ControlMenuProps
) => {
  const deleteCard = useCardListSlice((state) => state.deleteCard)

  const handleDelete = () => {
    const answer = confirm('Are you sure?')
    if (answer) deleteCard(id)
  }

  return (
    <ControlledMenu
      anchorPoint={anchorPoint}
      state={isOpen ? 'open' : 'closed'}
      direction='right'
      onClose={() => setOpen(false)}
    >
      <MenuItem
        onClick={() => handleDelete()}
        className='flex rounded-lg justify-center items-center h-8 w-20
          bg-iconbg border-2'
      >
        <Trash2 className='w-4 h-4' /> Delete
      </MenuItem>
    </ControlledMenu>
  )
}

export default ControlMenu
