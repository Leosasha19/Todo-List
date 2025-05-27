import MainPage from "../pages/MainPage/MainPage.tsx";
import {TodoProvider} from "../context/todoContext.tsx";
import './App.scss'

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
