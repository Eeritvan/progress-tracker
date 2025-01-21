const SingleDay = ({ date, completed }) => {
  return (
    <button
      className={`aspect-square h-4 rounded-sm 
        ${completed ? 'bg-red-400' : 'bg-red-400/50'}`}
      onClick={() => console.log(date)}
    />
  )
}

export default SingleDay
