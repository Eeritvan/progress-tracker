const SingleDay = ({
  date, completed, color
}: { date: string; completed: boolean; color: string }) => {
  return (
    <button
      className='aspect-square h-4 rounded-sm'
      style={{
        backgroundColor: color,
        opacity: completed ? 1 : 0.5
      }}
      onClick={() => console.log(date, color)}
    />
  )
}

export default SingleDay
