
import { BrowserRouter, Routes, Route } from "react-router-dom"
import {useState} from 'react'
import axios from 'axios'

import Header from './Header'
import Login from './Login'
import SignIn from '../pages/SignIn'
import Habits from '../pages/Habits'
import Today from '../pages/Today'
import History from '../pages/History'
import Menu from './Menu'

import UserContext from './../contexts/UserContext'
// import GlobalStyle from "../assets/CSS/GlobalStyle"

export default function App() {

    const [user, setUser] = useState() 
    const [todayHabits, setTodayHabits] = useState([])

    function getTodayHabits() {
        let config = {Authorization: `Bearer ${user.token}`}
        let promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/habits/today', {headers: config})
        promise.then(response => setTodayHabits(response.data))
        promise.catch(e => console.log(e.response))
    }

    return (
        <UserContext.Provider value={{user, setUser, todayHabits, setTodayHabits, getTodayHabits}}>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/cadastro" element={<SignIn />} />
                    <Route path="/habitos" element={<Habits />} />
                    <Route path="/hoje" element={<Today />} />
                    <Route path="/historico" element={<History />} />
                </Routes>
                <Menu />
            </BrowserRouter>
        </UserContext.Provider>
    )
}