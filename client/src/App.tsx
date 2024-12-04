import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginComponent from "./components/LoginComponent";

function App(): JSX.Element {
  return (

    <Routes>
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/" element={<HomePage />} />
    </Routes>

  );
}

export default App;
