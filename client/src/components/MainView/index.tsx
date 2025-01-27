import CardList from './CardList'
import TopBar from './TopBar'

const MainView = () => {
  return (
    <div className='container w-[600px]'>
      <TopBar />
      <CardList />
    </div>
  )
}

export default MainView
