import { useState } from 'react'
import { Plus, SettingsIcon } from 'lucide-react'
import NewCardform from './NewCardForm'
import Settings from './Settings'

const TopBar = () => {
  const [visible, setVisible] = useState<'settings' | 'newcard' | null>(null)

  const handleVisibility = (setting: 'settings' | 'newcard') => {
    setVisible(visible === setting ? null : setting)
  }

  return (
    <div>
      <div className='flex w-[600px] justify-between'>
        <button
          className='flex justify-center items-center bg-buttonbg aspect-square
          h-14 rounded-xl'
          onClick={() => handleVisibility('settings')}
        >
          <SettingsIcon />
        </button>
        <button
          className='flex justify-center items-center bg-buttonbg aspect-square
          h-14 rounded-xl'
          onClick={() => handleVisibility('newcard')}
        >
          <Plus />
        </button>
      </div>

      {visible === 'newcard' && <NewCardform />}
      {visible === 'settings' && <Settings />}
    </div>
  )
}

export default TopBar
