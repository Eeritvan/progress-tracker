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
        -translate-y-1/2 bg-iconbg/40 backdrop-blur-sm px-2 py-1 shadow-md
        whitespace-nowrap group-hover:visible'
      >
        <span className='select-none'>{ date }</span>
        <div className='absolute -right-1 top-1/2 -translate-y-1/2 w-0 h-0
          border-t-[4px] border-t-transparent border-l-[4px] border-l-iconbg/60
          border-b-[4px] border-b-transparent'
        />
      </div>
    </div>
  )
}

export default SingleDay
