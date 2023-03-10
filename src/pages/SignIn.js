import styled from 'styled-components'
import Logo from './../assets/Images/Logo.jpg'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ThreeDots } from  'react-loader-spinner'
import axios from 'axios'

export default function SignIn() {

    let animacao = <ThreeDots color="#FFFFFF" height={46} width={59} />

    const navigate = useNavigate()
    const [loading, setCarregando] = useState(false) 
    const [valid, setValid] = useState(true) 
    const inputs = [
        {type: 'email', placeholder: 'email', test: 'email-input'}, 
        {type: 'password', placeholder: 'senha', test: 'password-input'},
        {type: 'text', placeholder: 'nome', test: 'user-name-input'},
        {type: 'url', placeholder: 'foto', test: 'user-image-input'}
    ] 

    function enviarDados(evento) {
        evento.preventDefault()
        setCarregando(true)
        
        const promise = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v2/trackit/auth/sign-up', {
            email: evento.target[0].value,
            password: evento.target[1].value,
            name: evento.target[2].value,
            image: evento.target[3].value
        })
        promise.then(response => navigate('/'))   
        promise.catch(error => {
            console.log(error.response)
            setCarregando(false)
            setValid(false)
        })     
    }

   
    return (
        <Cadastro>
            <img src={Logo} alt='Logo' />
            <h1>TrackIt</h1>
            <form onSubmit={e => enviarDados(e)}>
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
                <button 
                    type='submit' 
                    className={loading ? 'loading' : ''}
                    disabled={loading ? true : false}
                    data-test="signup-btn"
                    style={loading ? {cursor: 'auto'} : {cursor: 'pointer'}}
                >{loading ? animacao : 'Cadastrar'}</button >
            </form>
            {valid ? <></> : <>{alert("Erro, tente novamente...")}</>}
            <StyledLink data-test="login-link" to={'/'}>
                J?? tem uma conta? Fa??a login
            </StyledLink>
        </Cadastro>
    )
}


const Cadastro = styled.div`
    height: 100%;
    width: 100%;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: auto;
    position: absolute;

    img {
        width: 155px;
        margin-top: 69px;
    }

    h1 {
        font-family: 'Playball', cursive;
        font-size: 69px;
        color: var(--theme--color--dark);
    }

    form {
        margin-top: 29px;
        width: 79%;
    }

    button {
        width: 100%;
        height: 46px;
        display: flex;
        align-items: center;
        justify-content: center;
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
        font-size: 24px;
        font-weight: 500;
        color: var(--error);
    }

    input {
        display: block;
        width: 100%;
        height: 44px;
        margin-bottom: 6px;
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