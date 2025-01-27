import ThemeSelector from './ThemeSelector'
import Reset from './Reset'
import LogOut from './LogOut'

const Settings = () => {
  return (
    <div className='w-[600px] bg-cardbg rounded-xl p-2'>
      <ThemeSelector />
      <Reset />
      <LogOut />
    </div>
  )
}

export default Settings
