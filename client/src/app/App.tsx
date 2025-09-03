import { TodoProvider } from '../context/todoContext';
import MainPage from '../pages/MainPage/MainPage';

import './App.scss';

function App() {
  return (
    <>
      <TodoProvider>
        <MainPage />
      </TodoProvider>
    </>
  );
}

export default App;
