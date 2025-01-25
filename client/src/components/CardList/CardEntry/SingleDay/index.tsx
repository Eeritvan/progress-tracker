const SingleDay = ({
  date, completed, color
}: { date: Date; completed: boolean; color: string }) => {
  return (
    <button
      className='aspect-square h-4 rounded-sm'
      style={{
        backgroundColor: color,
        opacity: completed ? 1 : 0.5
      }}
      // eslint-disable-next-line no-console
      onClick={() => console.log(date, color)}
    />
  )
}

export default SingleDay
