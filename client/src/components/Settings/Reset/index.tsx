import useCardListSlice from '@/store/cardListStore'

const Reset = () => {
  const resetCards = useCardListSlice((state) => state.resetCards)

  const handleClick = () => {
    const answer = confirm('Are you sure?')
    if (answer) resetCards()
  }

  return (
    <div>
      <button onClick={() => handleClick()}>
        Reset everything
      </button>
    </div>
  )
}

export default Reset
