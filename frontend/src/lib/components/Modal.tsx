import { createEffect, type ParentComponent } from 'solid-js';

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

const Modal: ParentComponent<ModalProps> = (props) => {
  let dialogElement: HTMLDialogElement | undefined;

  createEffect(() => {
    if (!dialogElement) {
      return;
    }

    if (props.open && !dialogElement.open) {
      dialogElement.showModal();
    }

    if (!props.open && dialogElement.open) {
      dialogElement.close();
    }
  });

  return (
    <dialog
      class="m-auto backdrop:bg-black/80 rounded-2xl w-170"
      onClose={props.onClose}
      ref={(el) => (dialogElement = el)}
    >
      <div>
        {props.children}
      </div>
    </dialog>
  );
};

export default Modal;
