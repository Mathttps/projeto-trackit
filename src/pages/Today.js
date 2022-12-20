import styled from 'styled-components'
import UserContext from "../contexts/UserContext"
import { useEffect, useState, useContext } from "react"
import { ThreeDots } from  'react-loader-spinner'
import dayjs from 'dayjs'
import axios from 'axios'



export default function Today() {
    const {user, todayHabits, setTodayHabits} = useContext(UserContext)

    const [refresh, setRefresh] = useState(false) 

    let today = dayjs().locale("pt-br").format('DD/MM') 

    const date = dayjs().locale("pt-br").format("dddd, DD/MM");
    const weekday = dayjs().day()
    const config = {Authorization: `Bearer ${user.token}`} 


    function converterPt(weekday) {
        if (weekday === 0) {
            return "Domingo"
        } else if (weekday === 1) {
            return "Segunda"
        } else if (weekday === 2) {
            return "Terça"
        } else if (weekday === 3) {
            return "Quarta"
        } else if (weekday === 4) {
            return "Quinta"
        } else if (weekday === 5) {
            return "Sexta"
        } else if (weekday === 6) {
            return "Sábado"
        }
    }

    
    useEffect(() => {
        const URL = 'https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/today'
        let promise = axios.get(URL, {headers: config})
        promise.then(response => setTodayHabits(response.data))
        promise.catch(error => console.log(error.response))
    }, [refresh])


    function MostrarHab({habit}) {
        const [loading, setCarregando] = useState('') 

        const {id, name, done, currentSequence:CS, highestSequence:HS} = habit
        const URLC = `https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${id}/check`
        const UNRL = `https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${id}/uncheck`

    



        function Concluido() {
            setCarregando('loading')
            const obj = {id, name, done, currentSequence: CS, highestSequence: HS}
            if (done) {
                let promise = axios.post(UNRL, obj, {headers: config})
                promise.then(response => {
                    setRefresh(!refresh)
                })
                promise.catch(error => console.log(error.response))
            } else {
                let promise = axios.post(URLC, obj, {headers: config})
                promise.then(response => {
                    setRefresh(!refresh) 
                })
                promise.catch(error => console.log(error.response))
            }
        }

        let icone = <ion-icon name="checkmark-sharp"></ion-icon>
        let animacao = <ThreeDots color="#FFFFFF" height={69} width={60} />
        return (
            <SequenciaHab data-test="today-habit-container">
                <h3 data-test="today-habit-name">{name}</h3>
                <p data-test="today-habit-sequence">Sequência atual: <span className={done ? 'concluded' : ''}>{CS} dias</span></p>
                <p data-test="today-habit-record">Seu recode: <span className={(done && CS === HS) ? 'concluded' : ''}>{HS} dias</span></p>
                <button 
                    data-test="today-habit-check-btn"
                    onClick={Concluido}
                    className={done ? `concluded ${loading}` : `${loading}`}
                >
                    {loading === '' ? icone : animacao}
                </button>
            </SequenciaHab>
        )
    }

    let porcentagem = todayHabits.length > 0 ? todayHabits.filter(h => h.done).length/todayHabits.length * 100 : 0
    return (
        <ContainerHab>
            <h1 data-test="today" >{`${converterPt(weekday)}`}, {today}</h1>
            {porcentagem === 0 ? 
            <h2 data-test="today-counter">Nenhum hábito concluído ainda</h2> : 
            <h2 data-test="today-counter" className="concluded">{`${porcentagem.toFixed(0)}% dos hábitos concluídos`}</h2>}
            {todayHabits.map(habit => <MostrarHab key={habit.id} habit={habit} />)}
        </ContainerHab>
    )
}



const ContainerHab = styled.div`
    width: 90%;
    margin: 98px auto 115px;

    h1 {
        font-size: 23px;
        color: var(--theme--color--dark);
    }

    h2 {
        font-size: 18px;
        color: var(--habit--pending);
        margin: 5px 0 28px;
    }
    h2.concluded {
        color: var(--habit--concluded);
    }
`
const SequenciaHab = styled.article`
    position: relative;
    width: 100%;
    height: 94px;

    margin-bottom: 10px;
    padding: 13px 15px;

    border-radius: 5px;
    background-color: #FFFFFF;

    * {
        color: #666666;
    }

    h3 {
        max-width: 71%;
        max-height: 21px;
        overflow: hidden;

        margin-bottom: 11px;
        font-size: 21px;
    }

    p {
        font-size: 14px;
        margin-bottom: 4px;
    }
    span.concluded {
        color: var(--habit--concluded);
    }

    button {
        position: absolute;
        top: 13px;
        right: 13px;
        
        width: 69px;
        height: 69px;
        cursor: pointer;
        transition: all 0.5s;

        border: 1px solid #E7E7E7;
        border-radius: 5px;
        background-color: #EBEBEB;
    }
    ion-icon {
        font-size: 44px;
        color: #FFFFFF;
    }
    button.concluded {
        background-color: var(--habit--concluded);
    }
    button.loading {
        opacity: 0.6;
    }
`