import { Suspense, type Component } from 'solid-js';
import NavBar from './modules/navbar';

const App: Component<{ children: Element }> = (props) => {
  return (
    <div class="flex min-h-screen">
      <NavBar />
      <main class="flex-1 p-6">
        <Suspense>{props.children}</Suspense>
      </main>
    </div>
  );
};

export default App;
