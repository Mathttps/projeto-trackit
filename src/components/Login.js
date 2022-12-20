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
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #FFFFFF;

    img {
        width: 155px;
        margin-top: 69px;
    }


    form {
        width: 79%;
        margin-top: 31px;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 46px;

        border: none;
        border-radius: 5px;
        background-color: var(--theme--color);

        font-size: 20px;
        color: #FFFFFF;
    }

    button.loading {
        opacity: 0.7;
    }
    
    p {
        margin-top: 16px;
        font-size: 25px;
        font-weight: 500;
        color: var(--error);
    }

    input {
        display: block;
        width: 100%;
        height: 46px;
        margin-bottom: 7px;
        padding: 0 10px;

        outline: none;
        border: 1px solid var(--input--placeholder);
        border-radius: 5px;

        font-size: 20px;
    }
    
    input.loading {
        background-color: var(--input--loading);
    }

    input::placeholder {
        color: var(--input--placeholder);
    }
` 
const StyledLink = styled(Link)`
    color: var(--theme--color);
    margin: 24px 0;
    font-size: 15px;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`

const Title = styled.div`
    font-family: 'Playball', cursive;
    font-size: 69px;
    color: var(--theme--color--dark);
`