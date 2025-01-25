const SingleDay = ({
  date, completed, color
}: { date: string; completed: boolean; color: string }) => {
  return (
    <button
      className={
        `aspect-square h-4 rounded-sm ${completed ? '' : 'opacity-50'}`
      }
      style={{ backgroundColor: color }}
      // eslint-disable-next-line no-console
      onClick={() => console.log(date)}
    />
  )
}

export default SingleDay
