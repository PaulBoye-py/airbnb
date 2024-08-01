import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State for redirect postive login to homepagge
    const [redirect, setRedirect] = useState(false);

    const {setUser} = useContext(UserContext)

    async function handleLoginSubmit(e) {
        e.preventDefault();
        try {
            const data = await axios.post('/login', {
                email,
                password,
            }, {withCredentials: true});
            setUser(data);
            alert('Login Successful')
            // If login is successful, set redirect state to true

            setRedirect(true);
        } catch(e) {
            alert('Unsuccessful login. Please check your credentials.')
            setRedirect(false)
        }
    }

    // Return the homepage if login is sucessful
    if(redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 grow flex flex-col items-center justify-around">
            <div className="-mt-62">
                <h1 className="text-center text-4xl mb-4">Login</h1>

                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        placeholder="abc@email.com"
                        value={email}
                        autoComplete="username" 
                        onChange={e => setEmail(e.target.value)}
                         />

                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        placeholder="***********"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}/>
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}