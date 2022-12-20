import { useState, useEffect, useContext } from "react"
import { ThreeDots } from  'react-loader-spinner'
import axios from 'axios'

import styled from 'styled-components'
import UserContext from "../contexts/UserContext"

export default function Habits() {
    const {user, getTodayHabits} = useContext(UserContext)
    const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] 
    const config = {Authorization: `Bearer ${user.token}`}

    const [todosHabitos, setTodosHabitos] = useState([]) 
    const [refreshAxios, setRefreshAxios] = useState(false) 
    const [days, setDays] = useState([]) 
    const [name, setName] = useState('') 
    const [add, setAdd] = useState(false) 
     

    useEffect(getTodayHabits, [])

    useEffect(() => {
        const promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits',
        {headers: config})
        promise.then(response => setTodosHabitos(response.data))
        promise.catch(error => console.log(error.response))
    }, [refreshAxios])

    function deletarHabito(id) {
        let confirmation = window.confirm('Tem certeza que deseja deletar esse hábito?')
        if (confirmation) {
            const promise = axios.delete(`https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/${id}`,
            {headers: config})
            promise.then(reponse => {
                setRefreshAxios(!refreshAxios)
                getTodayHabits()
            })
            promise.catch(error => console.log(error.response))
        }
    }

    function MostrarHabitos({id, name, days}) {
        return (
            <Habit data-test="habit-container">
                <ion-icon data-test="habit-delete-btn" name="trash-outline" onClick={() => deletarHabito(id)}></ion-icon>
                <p data-test="habit-name">{name}</p>
                <div className='Days'>
                    {dayNames.map((day, i) => 
                        <button data-test="habit-day"   key={`${day} - ${i}`} className={days.includes(i) ? 'selected' : ''}>{day}</button>
                    )}   
                </div>
            </Habit>
        )
    }


    return (
        <HabitCont>
            <Divo>
                <p>Meus hábitos</p>
                <button data-test="habit-create-btn" onClick={() => setAdd(true)}><ion-icon name="add-outline"></ion-icon></button>
            </Divo>

            {add ? 
            <Add dayNames={dayNames} setAdd={setAdd} token={user.token} getTodayHabits={getTodayHabits}
            days={days} setDays={setDays} name={name} setName={setName} 
            refreshAxios={refreshAxios} setRefreshAxios={setRefreshAxios} /> : 
            <></>}

            {todosHabitos.map( ({id, name, days}) => {return(
                <MostrarHabitos  key={id} id={id} name={name} days={days} />
            )})}

            {todosHabitos.length === 0 ? 
            <Text>Você não tem nenhum hábito cadastrado ainda. Adicione um hábito para começar a trackear!</Text> : 
            <></>}
        </HabitCont>
    )
}

function Add(props) {
    const {days, setDays, name, setName, dayNames, setAdd, token, refreshAxios, setRefreshAxios, getTodayHabits} = props

    const [invalido, setInvalido] = useState(true) 
    const [loading, setLoading] = useState(false) 

    function validarDia() {
        if (days.length > 0 && name.length > 2) {
            setInvalido(false)
        } else {
            setInvalido(true)
        }
    }
    useEffect(validarDia, [days, name])

    // function selecionado(day) {
//     if (days.includes(day.id)) {
//         day.status = true;
//         const newDays = days.filter(value => value !== day.id); 
//         setDays(newDays);
//     } else {
//         day.status = false;
//         setDays([...days, day.id]);
//     }
// }

// function resetForm() {
//     setName("");
//     setDays("");
//     setDayselecionado(weekdays);
// }

    function atualizarDias(index) {
        if (days.includes(index)) {
            const i = days.indexOf(index)
            days.splice(i, 1)
            setDays([...days].sort( (a, b) => {return a - b} ))
        } else {
            setDays([...days, index].sort( (a, b) => {return a - b} ))
        }
    }

    function adicionarHabito(e) {
        e.preventDefault()
        setLoading(true)

        const config = {Authorization: `Bearer ${token}`}
        
        const promise = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits', {
            name,
            days
        }, {headers: config})
        promise.then(response => {
            setAdd(false)
            setDays([])
            setName('')
            setRefreshAxios(!refreshAxios)
            getTodayHabits()
        })
        promise.catch(error => {
            console.log(error.response)
            alert(`Error type "${error.response.statusText}"`)
            setLoading(false)
        })
    }

    let loadingAnimation = <ThreeDots color="#FFFFFF" height={35} width={45} />
    return (
        <CriarHabito data-test="habit-create-container">
            <form onSubmit={e => adicionarHabito(e)}>
                <input 
                    data-test="habit-name-input"
                    type='text' 
                    placeholder='nome do hábito' 
                    className={loading ? 'loading' : ''}
                    disabled={loading ? true : false} 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required
                />
                <div className='Days'>
                    {dayNames.map((day, i) => 
                        <button 
                            data-test="habit-day"
                            key={`${day} - ${i}`} 
                            type='button'
                            className={days.includes(i) ? 'selected' : ''}
                            disabled={loading ? true : false}
                            style={loading ? {cursor: 'auto'} : {cursor: 'pointer'}}
                            onClick={() => atualizarDias(i)}
                        >{day}</button>
                    )}   
                </div>
                <div className='FinishHabit'>
                    <p data-test="habit-create-cancel-btn"
                        onClick={loading ? null : () => setAdd(false)}
                        className={loading ? 'loading' : ''}
                        style={loading ? {cursor: 'auto'} : {cursor: 'pointer'}}
                    >Cancelar</p>
                    <button data-test="habit-create-save-btn"
                        type="submit" 
                        className={(invalido || loading) ? 'loading' : ''}
                        disabled={(invalido || loading) ? true : false}
                        style={(invalido || loading) ? {cursor: 'auto'} : {cursor: 'pointer'}}
                    >{loading ? loadingAnimation : 'Salvar'}</button>
                </div>
            </form>
        </CriarHabito>
    )
}


const HabitCont = styled.div`
    width: 90%;
    margin: 92px auto 100px;

    display: flex;
    flex-direction: column;
    align-items: center;
`

const Divo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;

    p {
        font-size: 23px;
        color: var(--theme--color--dark);
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 35px;
        cursor: pointer;
        border: none;
        border-radius: 5px;
        background-color: var(--theme--color);
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.15);

        ion-icon {
            font-size: 22px;
            color: #FFFFFF;
        }
    }
`

const CriarHabito = styled.div`
    width: 100%;
    height: 180px;
    margin-bottom: 20px;
    position: relative;

    border-radius: 5px;
    background-color: #FFFFFF;

    input {
        width: 90%;
        height: 45px;
        margin: 20px auto 8px;
        padding: 0 11px;
        display: block;
        outline: none;
        border: 1px solid var(--input--placeholder);
        border-radius: 5px;

        font-size: 20px;
    }

    input::placeholder {
        color: var(--input--placeholder);
    }

    input.loading {
        background-color: var(--input--loading);
    }

    .Days {
        width: 90%;
        margin: 0 auto;

        button {
            width: 30px;
            height: 30px;
            margin-right: 4px;
            color: var(--input--placeholder);
            transition: all 0.5s;
            cursor: pointer;
            font-size: 20px;

            border-radius: 5px;
            border: 1px solid var(--input--placeholder);
            background: #FFFFFF;
        }
        button.selected {
            color: #FFFFFF;
            border: none;
            background: #CFCFCF;
        }
    }

    .FinishHabit {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 16px;
        right: 16px;
        
        * {
            font-size: 16px;
        }

        p {
            color: var(--theme--color);
            margin-right: 23px;
        }
        p.loading {
            opacity: 0.7;
        }

        button {
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.5s;
            width: 84px;
            height: 35px;

            color: #FFFFFF;
            border: none;
            border-radius: 5px;
            background-color: var(--theme--color);
        }
        button.loading {
            opacity: 0.5;
        }
    }
`

const Habit = styled.article`
    width: 100%;
    height: 91px;
    margin-bottom: 20px;
    padding: 0 15px;
    position: relative;

    border-radius: 5px;
    background-color: #FFFFFF;

    ion-icon {
        top: 10px;
        right: 10px;
        cursor: pointer;
        position: absolute;
      
    }

    * {
        font-size: 20px;
    }

    p {
        margin: 13px 0;
        color: #666666;
        max-width: 85%;
        max-height: 20px;
        overflow: hidden;
    }

    button {
        width: 30px;
        height: 30px;
        font-size: 20px;
        color: var(--input--placeholder);
        margin-right: 4px;

        border-radius: 5px;
        border: 1px solid var(--input--placeholder);
        background: #FFFFFF;
    }
    button.selected {
        color: #FFFFFF;
        border: none;
        background: #CFCFCF;
    }
`

const Text = styled.p`
    color: #666666;
    font-size: 18px;
`