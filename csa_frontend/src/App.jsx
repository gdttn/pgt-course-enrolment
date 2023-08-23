import "./App.css";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Apply from "./pages/Apply";
import Success from "./pages/Success";
import Error from "./pages/Error";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="PTMSCADTFC1F"
          element={<Apply course={"PTMSCADTFC1F"} />}
        />
        <Route
          path="PTMSCAINTL1F"
          element={<Apply course={"PTMSCAINTL1F"} />}
        />
        <Route
          path="PTMSCCMPSI1F"
          element={<Apply course={"PTMSCCMPSI1F"} />}
        />
        <Route
          path="PTMSCCOGSC1F"
          element={<Apply course={"PTMSCCOGSC1F"} />}
        />
        <Route
          path="PTMSCCSPTR1F"
          element={<Apply course={"PTMSCCSPTR1F"} />}
        />
        <Route
          path="PTMSCDATSC1F"
          element={<Apply course={"PTMSCDATSC1F"} />}
        />
        <Route
          path="PTMSCDESIN1F"
          element={<Apply course={"PTMSCDESIN1F"} />}
        />
        <Route
          path="PTMSCHPCDS1F"
          element={<Apply course={"PTMSCHPCDS1F"} />}
        />
        <Route
          path="PTMSCHPCMP1F"
          element={<Apply course={"PTMSCHPCMP1F"} />}
        />
        <Route path="success" element={<Success />} />
        <Route path="error" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
