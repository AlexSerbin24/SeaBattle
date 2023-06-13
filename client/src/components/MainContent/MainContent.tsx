import React from 'react'
import Container from '../UI/Container/Container'
import GameBoard from './components/GameBoard/GameBoard'
import Menu from './components/Menu/Menu'
import ShipPlacement from './components/ShipPlacement/ShipPlacement'

export default function MainContent() {
    return (
        <Container className='main-container'>
            <main>
                <div>
                    <GameBoard isEnemyField />
                    <ShipPlacement />
                </div>
                <Menu user={{ email: "a", username: "a" }} />
            </main>
        </Container>
    )
}
