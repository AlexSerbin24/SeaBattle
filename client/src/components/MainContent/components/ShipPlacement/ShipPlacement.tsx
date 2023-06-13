import React from 'react'
import Ship from '../Ship/Ship'

export default function ShipPlacement() {
    return (
        <div className='ship-placement'>
            <div className='ship-placement-row'>
                <Ship shipSize={4} />
            </div>
            <div className='ship-placement-row'>
                <Ship shipSize={3} />
                <Ship shipSize={3} />
            </div>
            <div className='ship-placement-row'>
                <Ship shipSize={2} />
                <Ship shipSize={2} />
                <Ship shipSize={2} />
            </div>
            <div className='ship-placement-row'>
                <Ship shipSize={1} />
                <Ship shipSize={1} />
                <Ship shipSize={1} />
                <Ship shipSize={1} />
            </div>
        </div>
    )
}
