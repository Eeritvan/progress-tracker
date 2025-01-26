import { ControlledMenu, MenuItem } from '@szhsin/react-menu'
import useCardListSlice from '@/store/cardListStore'

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

  return (
    <ControlledMenu
      anchorPoint={anchorPoint}
      state={isOpen ? 'open' : 'closed'}
      direction='right'
      onClose={() => setOpen(false)}
    >
      <MenuItem onClick={() => deleteCard(id)}>Delete</MenuItem>
    </ControlledMenu>
  )
}

export default ControlMenu
