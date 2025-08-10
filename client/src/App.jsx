import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FoodsPage from "./pages/FoodPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<FoodsPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
