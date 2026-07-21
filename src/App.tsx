import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { SprintProvider } from "./lib/SprintContext";
import { Assumptions } from "./pages/Assumptions";
import { Cases } from "./pages/Cases";
import { Experiments } from "./pages/Experiments";
import { Guide } from "./pages/Guide";
import { Home } from "./pages/Home";
import { Hypothesis } from "./pages/Hypothesis";
import { Learnings } from "./pages/Learnings";
import { Leverage } from "./pages/Leverage";
import { Setup } from "./pages/Setup";

export default function App() {
  return (
    <SprintProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="setup" element={<Setup />} />
            <Route path="assumptions" element={<Assumptions />} />
            <Route path="leverage" element={<Leverage />} />
            <Route path="hypothesis" element={<Hypothesis />} />
            <Route path="experiments" element={<Experiments />} />
            <Route path="learnings" element={<Learnings />} />
            <Route path="guide" element={<Guide />} />
            <Route path="cases" element={<Cases />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SprintProvider>
  );
}
