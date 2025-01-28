import { ControlledMenu, MenuItem } from '@szhsin/react-menu'
import useCardListSlice from '@/store/cardListStore'
import { Trash2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { deleteCardMutation } from '@/graphql/mutations'

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

  const deleteMutate = useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteCardMutation.send({ id })
      if (result.errors) throw result.errors[0].message
      return result.data?.deleteCard
    },
    onError: (e) => { throw e },
    onSuccess: () => deleteCard(id)
  })

  const handleDelete = () => {
    const answer = confirm('Are you sure?')
    if (answer) deleteMutate.mutateAsync(id)
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
