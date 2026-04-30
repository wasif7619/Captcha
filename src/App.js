import { BrowserRouter, Routes, Route } from "react-router-dom";
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
