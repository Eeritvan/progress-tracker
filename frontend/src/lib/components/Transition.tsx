import { ParentComponent } from "solid-js";
import { Transition as SolidTransition } from "solid-transition-group"

interface Props {
  onEnter: string;
  onExit: string;
}

const Transition: ParentComponent<Props> = (props) => {
  return (
    <SolidTransition
      onEnter={(el, done) => {
        el.classList.add(...props.onEnter.split(" "));

        el.addEventListener("animationend", done, {
          once: true,
        });
      }}
      onExit={(el, done) => {
        el.classList.add(...props.onExit.split(" "));

        el.addEventListener("animationend", done, {
          once: true,
        });
      }}
    >
      {props.children}
    </SolidTransition>
  )
}

export default Transition
