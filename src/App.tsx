import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { CheckPage } from './pages/CheckPage'
import { ResultsPage } from './pages/ResultsPage'
import { DemoPage } from './pages/DemoPage'
import { EmergencyPage } from './pages/EmergencyPage'
import { HistoryPage } from './pages/HistoryPage'
import { LearnPage } from './pages/LearnPage'
import { AboutPage } from './pages/AboutPage'
import { AiPage } from './pages/AiPage'

export default function App(){return <BrowserRouter><div className="min-h-screen"><Navbar/><Routes><Route path="/" element={<HomePage/>}/><Route path="/ai" element={<AiPage/>}/><Route path="/check" element={<CheckPage/>}/><Route path="/results/:id" element={<ResultsPage/>}/><Route path="/demo" element={<DemoPage/>}/><Route path="/emergency" element={<EmergencyPage/>}/><Route path="/history" element={<HistoryPage/>}/><Route path="/learn" element={<LearnPage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes><Footer/></div></BrowserRouter>}
