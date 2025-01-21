import { useState } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'

const Settings = () => {
  const [visible, setVisible] = useState(false)

  return (
    <>
      <button
        className='flex justify-center items-center bg-green-500 aspect-square
        h-14 rounded-xl'
        onClick={() => setVisible(!visible)}
      >
        <SettingsIcon />
      </button>
      {visible && (
        <div className='fixed inset-0 bg-gray-500 h-3/4 w-3/4 top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2'
        >
          gg
        </div>
      )}
    </>
  )
}

export default Settings
