import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { RuletaVTT } from './components/RuletaVTT';
import { SalonDeLaFama } from './components/SalonDeLaFama';
import HomePage from './pages/HomePage';
import './App.css';

export default function App() {
  return <BrowserRouter><div className="min-h-screen bg-[#07060a] text-[#f8f5ff]"><Navbar/><Routes><Route path="/" element={<HomePage/>}/><Route path="/ruleta" element={<RuletaVTT/>}/><Route path="/salon-de-la-fama" element={<SalonDeLaFama/>}/></Routes></div></BrowserRouter>;
}
