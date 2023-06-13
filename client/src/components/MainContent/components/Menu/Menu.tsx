import React from 'react'
import Button from '../../../UI/Button/Button'
import User from '../../../../types/User'

type Props = {
    user: User | null
};

export default function Menu({ user }: Props) {
    return (
        <div className='menu'>
            <Button className='singleplayer-btn'>Play with bot</Button>
            {
                user
                    ?
                    <>
                        <Button className='multiplayer-btn'>To battle</Button>
                        <Button className='logout-btn'>Logout</Button>
                    </>
                    :
                    <>
                        <Button className='login-btn'>Login</Button>
                        <Button className='register-btn'>Register</Button>
                    </>

            }

            <h3>Players online: 1488</h3>
        </div>
    )
}
