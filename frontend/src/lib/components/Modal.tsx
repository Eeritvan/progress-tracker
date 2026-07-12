import { Component } from "solid-js";

const Modal: Component = () => {
  let myElement: HTMLDialogElement | undefined;

  return (
    <>
      <button onClick={() => myElement?.showModal()}>
        press here
      </button>

      <dialog
        class="m-auto backdrop:bg-black/80 rounded-2xl w-170"
        ref={(el) => (myElement = el)}
      >
        hello
      </dialog>
    </>
  );
};

export default Modal;
