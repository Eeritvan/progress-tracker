import { ReactNode, Children, cloneElement, isValidElement } from 'react'
import { useBasePath } from '@/hooks/useBasePath'

interface SelectorProps {
  children: ReactNode
}

interface SelectorChildProps {
  to: string;
  className?: string;
}

const Selector = ({ children }: SelectorProps) => {
  const { matches } = useBasePath()
  const childCount = Children.count(children)

  const childrenArray = Children.toArray(children)
  const activeIndex = childrenArray.findIndex(child =>
    isValidElement<SelectorChildProps>(child) && matches(child.props.to)
  )

  const styledSChildren = Children.map(children, child => {
    if (!isValidElement<SelectorChildProps>(child)) {
      return child
    }
    const isActive = matches(child.props.to)

    const className = `flex relative items-center justify-center w-full ${
      isActive ? 'font-bold' : 'text-neutral-500 font-semibold'}`
    return cloneElement(child, { ...child.props, className })
  })

  return (
    <div className='flex flex-col w-[400px]'>
      <div className='relative rounded-xl grid bg-neutral-200 h-12 p-1'>
        {activeIndex !== -1 &&
        <div
          className='relative rounded-xl bg-white transition-all duration-200
            row-start-1 col-start-1'
          style={{
            width: `${100/childCount}%`,
            transform: `translateX(${activeIndex * 100}%)`
          }}
        />}
        <div className="flex row-start-1 col-start-1">
          {styledSChildren}
        </div>
      </div>
    </div>
  )
}

export default Selector
