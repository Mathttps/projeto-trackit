import Calendar from 'react-calendar'
import styled from 'styled-components'
import 'react-calendar/dist/Calendar.css';

export default function History() {
    return (
        <Main>
            <h1>Historico</h1>
            <p>Em breve você poderá ver o histórico dos seus hábitos aqui!</p>
        </Main>
    )
}   



// STYLED COMPONENTS
const Main = styled.main`
    width: 90%;
    margin: 98px auto 120px;

    h1 {
        font-size: 23px;
        color: var(--theme--color--dark);
    }
    
    p{
        font-family: 'Lexend Deca';
        font-style: normal;
        font-weight: 400;
        font-size: 17.976px;
        line-height: 22px;
        color: #666666;
        margin-top: 16px;
    }
`

