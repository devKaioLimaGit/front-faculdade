import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Importação do toast
import './CreateUser.css';
import api from '../utils/api';
import Header from './Header';

function CreateUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const isPasswordStrong = (pwd) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasLowerCase = /[a-z]/.test(pwd);
        const hasNumbers = /\d/.test(pwd);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
        return (
            pwd.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChar
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            toast.error('Todos os campos são obrigatórios');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('As senhas não coincidem');
            return;
        }

        if (!isPasswordStrong(password)) {
            toast.error('A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais');
            return;
        }

        try {
            const response = await api.post('/users', {
                name,
                email,
                password,
            });

            if (response.status === 201 || response.status === 200) {
                toast.success('Usuário criado com sucesso!');
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            if (err.response && err.response.data?.error) {
                toast.error(err.response.data.error);
            } else {
                toast.error('Erro interno do servidor');
            }
        }
    };

    return (
        <>
            <Header />
            <div className="login-container">
                <div className="overlay"></div>
                <div className="login-box">
                    <h2 className="login-title">Criar Conta</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="login-input"
                            placeholder="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="email"
                            className="login-input"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            className="login-input"
                            placeholder="Confirmar Senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button type="submit" className="login-button">
                            Criar Conta
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateUser;
