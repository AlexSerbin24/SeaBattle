import React, { useEffect } from 'react';
import "./style.css"
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import Footer from './components/Footer/Footer';

export default function App() {
  useEffect(() => {
  }, [])
  
  return (
    <>
    <Header/>
    <MainContent/>
    <Footer/>
    </>
  )
}
