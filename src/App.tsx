import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import AgentConsole from "./pages/AgentConsole"
import Campaigns from "./pages/Campaigns"

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="agent" element={<AgentConsole />} />
                <Route path="campaigns" element={<Campaigns />} />
            </Route>
        </Routes>
    )
}
