import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { FormBuilder } from "./pages/FormBuilder";
import { FormFiller } from "./pages/FormFiller";
import { FormResponses } from "./pages/FormResponses";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms/new" element={<FormBuilder />} />
        <Route path="/forms/:id/fill" element={<FormFiller />} />
        <Route path="/forms/:id/responses" element={<FormResponses />} />
      </Routes>
    </Router>
  );
}
export default App;
