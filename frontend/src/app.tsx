import { Suspense, createSignal, type Component } from 'solid-js';
import { A, useLocation } from '@solidjs/router';
import Modal from './lib/components/Modal';

const App: Component<{ children: Element }> = (props) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  return (
    <>
      <nav class="bg-gray-200 text-gray-900 px-4">
        <ul class="flex items-center">
          <li class="py-2 px-4">
            <A href="/" class="no-underline hover:underline">
              Home
            </A>
          </li>
          <li class="py-2 px-4">
            <A href="/about" class="no-underline hover:underline">
              About
            </A>
          </li>
          <li class="py-2 px-4">
            <A href="/error" class="no-underline hover:underline">
              Error
            </A>
          </li>

          <li class="py-2 px-4">
            <A href="/trackers" class="no-underline hover:underline">
              trackers
            </A>
          </li>

          <li class="py-2 px-4">
            <A href="/trackers2" class="no-underline hover:underline">
              tracker2
            </A>
          </li>

          <li class="text-sm flex items-center space-x-1 ml-auto">
            <span>URL:</span>
            <input
              class="w-75px p-1 bg-white text-sm rounded-lg"
              type="text"
              readOnly
              value={location.pathname}
            />
          </li>

          <button
            onClick={() => setIsModalOpen(true)}
          >
            presss here
          </button>
          <Modal open={isModalOpen()} onClose={() => setIsModalOpen(false)}>
            hello
          </Modal>
        </ul>
      </nav>

      <main>
        <Suspense>{props.children}</Suspense>
      </main>
    </>
  );
};

export default App;
