import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ReportWithCaptcha from "./components/ReportWithCaptcha"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ReportWithCaptcha />} />
          </Routes>
          </BrowserRouter>
          </>
  );
}

export default App;
