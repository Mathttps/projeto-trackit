import { useState, useEffect, useContext } from "react"
import { ThreeDots } from  'react-loader-spinner'
import axios from 'axios'

import styled from 'styled-components'
import UserContext from "../contexts/UserContext"

export default function Habits() {
    const {user, getTodayHabits} = useContext(UserContext)

    const [days, setDays] = useState([]) // array of selected days
    const [name, setName] = useState('') // name of the new habit
    const [add, setAdd] = useState(false) // show "Add Habit" section 
    const [allHabits, setAllHabits] = useState([]) // get all habits from API
    const [refreshAxios, setRefreshAxios] = useState(false) // refresh axios.get when a new habit is added
    
    const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'] // day buttons
    const config = {Authorization: `Bearer ${user.token}`} // Authorization for axios

    useEffect(getTodayHabits, [])

    useEffect(() => {
        const promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits',
        {headers: config})
        promise.then(response => setAllHabits(response.data))
        promise.catch(error => console.log(error.response))
    }, [refreshAxios])

    function ShowHabits({id, name, days}) {
        return (
            <Habit data-test="habit-container">
                <ion-icon data-test="habit-delete-btn" name="trash-outline" onClick={() => deleteHabit(id)}></ion-icon>
                <p data-test="habit-name">{name}</p>
                <div className='Days'>
                    {dayNames.map((day, i) => 
                        <button data-test="habit-day"   key={`${day} - ${i}`} className={days.includes(i) ? 'selected' : ''}>{day}</button>
                    )}   
                </div>
            </Habit>
        )
    }

    function deleteHabit(id) {
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

    return (
        <Main>
            <Wrapper>
                <p>Meus hábitos</p>
                <button data-test="habit-create-btn" onClick={() => setAdd(true)}><ion-icon name="add-outline"></ion-icon></button>
            </Wrapper>

            {add ? 
            <Add dayNames={dayNames} setAdd={setAdd} token={user.token} getTodayHabits={getTodayHabits}
            days={days} setDays={setDays} name={name} setName={setName} 
            refreshAxios={refreshAxios} setRefreshAxios={setRefreshAxios} /> : 
            <></>}

            {allHabits.map( ({id, name, days}) => {return(
                <ShowHabits  key={id} id={id} name={name} days={days} />
            )})}

            {allHabits.length === 0 ? 
            <Text>Você não tem nenhum hábito cadastrado ainda. Adicione um hábito para começar a trackear!</Text> : 
            <></>}
        </Main>
    )
}

function Add(props) {
    const {days, setDays, name, setName, dayNames, setAdd, token, refreshAxios, setRefreshAxios, getTodayHabits} = props

    const [notValid, setNotValid] = useState(true) // validate 'days' and 'name'
    const [loading, setLoading] = useState(false) // loading API

    function validateObj() {
        if (days.length > 0 && name.length > 2) {
            setNotValid(false)
        } else {
            setNotValid(true)
        }
    }
    useEffect(validateObj, [days, name])

    function attDays(index) {
        if (days.includes(index)) {
            const i = days.indexOf(index)
            days.splice(i, 1)
            setDays([...days].sort( (a, b) => {return a - b} ))
        } else {
            setDays([...days, index].sort( (a, b) => {return a - b} ))
        }
    }

    function addHabit(e) {
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
            <form onSubmit={e => addHabit(e)}>
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
                            onClick={() => attDays(i)}
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
                        className={(notValid || loading) ? 'loading' : ''}
                        disabled={(notValid || loading) ? true : false}
                        style={(notValid || loading) ? {cursor: 'auto'} : {cursor: 'pointer'}}
                    >{loading ? loadingAnimation : 'Salvar'}</button>
                </div>
            </form>
        </CriarHabito>
    )
}


// STYLED COMPONENTS
const Main = styled.main`
    width: 90%;
    margin: 92px auto 100px;

    display: flex;
    flex-direction: column;
    align-items: center;
`

const Wrapper = styled.div`
    width: 100%;
    margin-bottom: 20px;


    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
        font-size: 23px;
        color: var(--theme--color--dark);
    }

    button {
        width: 40px;
        height: 35px;
        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: center;

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
    position: relative;
    width: 100%;
    height: 180px;
    margin-bottom: 20px;

    border-radius: 5px;
    background-color: #FFFFFF;

    input {
        display: block;
        width: 90%;
        height: 45px;
        margin: 20px auto 8px;
        padding: 0 11px;

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

            font-size: 20px;
            color: var(--input--placeholder);
            transition: all 0.5s;
            cursor: pointer;

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
        position: absolute;
        bottom: 16px;
        right: 16px;

        display: flex;
        align-items: center;

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
            width: 84px;
            height: 35px;

            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.5s;

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
    position: relative;
    width: 100%;
    height: 91px;
    margin-bottom: 20px;
    padding: 0 15px;

    border-radius: 5px;
    background-color: #FFFFFF;

    ion-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }

    * {
        font-size: 20px;
    }

    p {
        max-width: 85%;
        max-height: 20px;
        overflow: hidden;
        
        margin: 13px 0;
        color: #666666;
    }

    button {
        width: 30px;
        height: 30px;
        margin-right: 4px;

        font-size: 20px;
        color: var(--input--placeholder);

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
    font-size: 18px;
    color: #666666;
`