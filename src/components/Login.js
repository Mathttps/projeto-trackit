import styled from 'styled-components'
import Logo from './../assets/Images/Logo.jpg'
import UserContext from '../contexts/UserContext'
import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ThreeDots } from  'react-loader-spinner'
import axios from 'axios'

export default function Login() {
    const inputs = [ 
        {type: 'email', placeholder: 'email', test: 'email-input'}, 
        {type: 'password', placeholder: 'senha', test: 'password-input'}
    ]
    const {user, setUser} = useContext(UserContext)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false) 
    const [valid, setValid] = useState(true) 


    function enviarFormulario(event) {
        event.preventDefault()
        setLoading(true)

        let promise = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/auth/login', {
            email: event.target[0].value,
            password: event.target[1].value
        })
        promise.then(response => {
            setUser(response.data)

            const userString = JSON.stringify(response.data)
            localStorage.setItem('user', userString)

            navigate('/hoje')
        })
        promise.catch(error => {
            setLoading(false)
            setValid(false)
        })
    }

    let loadingAnimation = <ThreeDots color="#FFFFFF" height={46} width={59} />
    return (
        <Logar>
            <img src={Logo} alt='Logo' />
            <Title>TrackIt</Title>
            <form onSubmit={e => enviarFormulario(e)}>
                {inputs.map( ({type, placeholder, test}) => {return (
                    <input 
                        data-test={test}
                        key={placeholder}
                        type={type} 
                        placeholder={placeholder}
                        className={loading ? 'loading' : ''}
                        disabled={loading ? true : false} 
                        required />
                )})}
                <button data-test="login-btn"
                    type='submit' 
                    className={loading ? 'loading' : ''}
                    disabled={loading ? true : false}
                    style={loading ? {cursor: 'auto'} : {cursor: 'pointer'}}
                >{loading ? loadingAnimation : 'Entrar'}</button>
            </form>
            {valid ? <></> : <>{alert("Falha no login...")}</>}
            <StyledLink data-test="signup-link" to={'/cadastro'}>
                Não tem uma conta? Cadastre-se!
            </StyledLink>   
        </Logar>
    )
}

const Logar = styled.div`
    height: 100%;
    width: 100%;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    position: absolute;

    img {
        margin-top: 69px;
        width: 155px;
    }

    form {
        margin-top: 31px;
        width: 79%;
    }

    button {
        width: 100%;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;border: none;
        border-radius: 5px;
        background-color: var(--theme--color);

        font-size: 20px;
        color: #FFFFFF;
    }

    button.loading {
        opacity: 0.7;
    }
    
    p {
        font-size: 25px;
        font-weight: 500;
        margin-top: 16px;
        color: var(--error);
    }

    input {
        width: 100%;
        height: 46px;
        display: block;
        margin-bottom: 7px;
        font-size: 20px;
        padding: 0 10px;

        outline: none;
        border: 1px solid var(--input--placeholder);
        border-radius: 5px;
    }
    
    input.loading {
        background-color: var(--input--loading);
    }

    input::placeholder {
        color: var(--input--placeholder);
    }
` 
const StyledLink = styled(Link)`
    font-size: 15px;
    text-decoration: none;
    color: var(--theme--color);
    margin: 24px 0;

    &:hover {
        text-decoration: underline;
    }
`

const Title = styled.div`
    font-size: 69px;
    font-family: 'Playball', cursive;
    color: var(--theme--color--dark);
`