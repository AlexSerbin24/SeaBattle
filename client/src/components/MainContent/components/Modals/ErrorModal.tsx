import React from 'react'
import Modal from '../../../UI/Modal/Modal'


type Props = {
    isErrorModalVisible:boolean,
    setIsErrorModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    errorMessage:string
}
export default function ErrorModal({errorMessage, isErrorModalVisible, setIsErrorModalVisible}:Props) {
    return (
        <Modal title='Error' isVisible={isErrorModalVisible} setModal={setIsErrorModalVisible}>
            <h3 style={{ textAlign: "center" }}>{errorMessage}</h3>
        </Modal>
    )
}
