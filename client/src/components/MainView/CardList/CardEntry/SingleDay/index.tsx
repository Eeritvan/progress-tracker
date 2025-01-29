const SingleDay = ({
  date, completed, color
}: { date: string; completed: boolean; color: string }) => {
  return (
    <div className="group relative">
      <div
        className={
          `aspect-square h-4 rounded-sm ${completed ? '' : 'opacity-40'}`
        }
        style={{ backgroundColor: color }}
      />
      <div className='invisible absolute right-full top-1/2 mr-2 rounded text-sm
        -translate-y-1/2 bg-iconbg px-2 py-1 shadow-md whitespace-nowrap
        group-hover:visible'
      >
        <span className='select-none'>{ date }</span>
        <div className='absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2
         rotate-45 bg-iconbg'
        />
      </div>
    </div>
  )
}

export default SingleDay
