
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import GamePage from "./GamePage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/games/flip-match"
          element={<GamePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
