import { Plus } from 'lucide-react'
import NewCardform from './NewCardForm'
import { useState } from 'react'

const AddNew = () => {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <button
        className='flex justify-center items-center bg-buttonbg aspect-square
        h-14 rounded-xl'
        onClick={() => setVisible(!visible)}
      >
        <Plus />
      </button>

      {visible && <NewCardform />}
    </div>
  )
}

export default AddNew
