import styled from 'styled-components'
import UserContext from '../contexts/UserContext'
import { useLocation } from 'react-router-dom'
import { useContext } from 'react'

export default function Header() {
    const {user} = useContext(UserContext)
    const {pathname} = useLocation()

    return (pathname !== '/' && pathname !== '/cadastro')  ? (
        <Head data-test="header">
            <h1>TrackIt</h1>
            <img src={user.image} alt='Profile' />
        </Head>
    ) : (
        <></>
    )   
}

const Head = styled.div`
    height: 69px;
    padding: 0 17px;
    background-color: var(--theme--color--dark);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);

    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 10;

    display: flex;
    justify-content: space-between;
    align-items: center;
    

    h1 {
        font-family: 'Playball', cursive;
        font-size: 39px;
        color: #FFFFFF;
    }

    img {
        width: 51px;
        height: 51px;
        border-radius: 50%;
    }
`