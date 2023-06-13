import React from 'react';
import "./style.css"
import Header from './components/Header/Header';
import Menu from './components/MainContent/components/Menu/Menu';
import GameBoard from './components/MainContent/components/GameBoard/GameBoard';
import Ship from './components/MainContent/components/Ship/Ship';
import MainContent from './components/MainContent/MainContent';
import Footer from './components/Footer/Footer';

export default function App() {
  return (
    <>
    <Header/>
    <MainContent/>
    <Footer/>
    </>
  )
}
