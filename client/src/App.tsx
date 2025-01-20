import CardList from './CardList'
import useCardsSlice, { Card } from './store/cardStore'

const addNew = (addNewCard) => {
  const newCard: Card = {
    id: 5,
    name: 'test'
  }

  addNewCard(newCard)
}

const App = () => {
  const addNewCard = useCardsSlice((state) => state.addNewCard)

  return (
    <>
      <button onClick={() => addNew(addNewCard)}>
        add-new
      </button>
      <CardList/>
    </>
  )
}

export default App
