import { createSignal, JSX } from "solid-js"
import { A } from "@solidjs/router"
import { House } from "lucide-solid"
import Transition from "../../lib/components/Transition"
// import { useUserContext } from "../../lib/context/auth"

interface ItemProps {
  href: string
  label: string
  icon?: JSX.Element
}

const Item = (props: ItemProps) => {
  return (
    <A
      href={props.href}
      class="block py-2 px-4 rounded hover:bg-gray-300"
    >
      {props.icon && <span class="mr-2">{props.icon}</span>}
      {props.label}
    </A>
  )
}

const NavBar = () => {
  // const { user } = useUserContext()
  // console.log(user())

  const [isVisible, setIsVisible] = createSignal(false)

  return (
    <nav class="w-60 bg-gray-200 text-gray-900 px-4 py-6 flex flex-col">
      <Transition
        onEnter="motion-scale-in-[0.8] motion-translate-x-in-[0%] motion-translate-y-in-[30%] motion-opacity-in-[0%] motion-blur-in-[5px] motion-duration-[0.2s]"
        onExit="motion-scale-out-[0.8] motion-translate-x-out-[0%] motion-translate-y-out-[30%] motion-opacity-out-[0%] motion-blur-out-[5px] motion-duration-[0.2s]"
      >
        {isVisible() && (
          <Item
            href="/"
            label="home"
            icon={<House />}
          />
        )}
      </Transition>

      <button class="flex mt-auto" onClick={() => setIsVisible(!isVisible())}>
        User
      </button>
      {/*<A
        href="/trackers"
        class="block py-2 px-4 rounded hover:bg-gray-300"
      >
        Trackers
      </A>*/}
      {/*<A
        href="/me"
        class="block py-2 px-4 rounded hover:bg-gray-300"
      >
        Me
      </A>*/}
    </nav>
  )
}

export default NavBar
