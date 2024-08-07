import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

export default function RegisterPage() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    // const test = "/test";

    async function registerUser(e) {
        e.preventDefault();
        try {
            await axios.post('/register', {
                name,
                email,
                password,
            });
            alert('Registration successful! Please proceed to login.')
        } catch (e) {
            alert('Registration failed! Please try again.')
        }
       
    }


    return (
        <div className="mt-4 grow flex flex-col items-center justify-around">
            <div className="-mt-62">
                <h1 className="text-center text-4xl mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input 
                        type="text"
                        placeholder="Jon Doe"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />

                    <input 
                        type="email" 
                        name="email"
                        autoComplete="username" 
                        id="email" 
                        placeholder="abc@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <input 
                        type="password" 
                        name="password"
                        autoComplete="new-password" 
                        id="password" 
                        placeholder="***********"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">Already a member? <Link className="underline text-black" to={'/login'}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}