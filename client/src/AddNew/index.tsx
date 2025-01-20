import { Plus } from 'lucide-react'
import NewCardform from './NewCardForm'
import { useState } from 'react'

const AddNew = () => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <button
        className='flex justify-center items-center bg-green-500 aspect-square
        h-14 rounded-xl'
        onClick={() => setVisible(!visible)}
      >
        <Plus />
      </button>
      {visible && <NewCardform />}
    </>
  )
}

export default AddNew
