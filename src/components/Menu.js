import {useContext} from  'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

import styled from 'styled-components'
import 'react-circular-progressbar/dist/styles.css'

import UserContext from '../contexts/UserContext'

export default function Menu() {
    const {todayHabits} = useContext(UserContext)
    const {pathname} = useLocation()
    const navigate = useNavigate()

    let porcentagem = todayHabits.length > 0 ? todayHabits.filter(h => h.done).length/todayHabits.length * 100 : 0
    
    return (pathname !== '/' && pathname !== '/cadastro') ? (
        <Footer data-test="menu">
            <Link data-test="habit-link" to='/habitos' style={{textDecoration: 'none'}}>
                <p>Hábitos</p>
            </Link>
            <BarraProgressao data-test="today-link" onClick={() => navigate('/hoje')}>
                <CircularProgressbar value={porcentagem} text={`Hoje`} background={true} backgroundPadding={6}
                    styles={buildStyles({
                        textSize: '18px',
                        pathColor: '#FFFFFF',
                        textColor: '#FFFFFF',
                        trailColor: 'none',
                        backgroundColor: 'var(--theme--color)',
                    })}
                />
            </BarraProgressao>
            <Link data-test="history-link" to='/historico' style={{textDecoration: 'none'}}>
                <p>Histórico</p>
            </Link>
        </Footer>
    ) : (
        <></>
    )
}

const Footer = styled.footer`
    height: 70px;
    padding: 0 36px;
    background-color: #FFFFFF;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15);

    display: flex;
    align-items: center;
    justify-content: space-between;

    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 10;

    p {
        font-size: 18px;
        color: var(--theme--color);
    }
`
const BarraProgressao = styled.div`
    width: 91px;
    height: 91px;

    position: absolute;
    bottom: 10px;
    right: calc((100% - 91px) / 2);

    cursor: pointer;
`