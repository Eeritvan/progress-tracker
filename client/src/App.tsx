import Settings from './components/Settings'
import AddNew from './components/AddNew'
import CardList from './components/CardList'

const App = () => {
  return (
    <>
      <div className='flex'>
        <Settings />
        <AddNew />
      </div>
      <CardList/>
    </>
  )
}

export default App
