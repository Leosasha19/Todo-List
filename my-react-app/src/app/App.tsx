import './App.scss'
import MainPage from "../pages/MainPage/MainPage.tsx";
import {TodoProvider} from "../context/todoContext.tsx";

function App() {

  return (
    <>
        <TodoProvider>
            <MainPage/>
        </TodoProvider>
    </>
  )
}

export default App
