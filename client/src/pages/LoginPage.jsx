import { Link } from "react-router-dom";

export default function LoginPage() {
    return (
        <div className="mt-4 grow flex flex-col items-center justify-around">
            <div className="-mt-64">
                <h1 className="text-center text-4xl mb-4">Login</h1>
                <form className="max-w-md mx-auto">
                    <input type="email" name="email" id="email" placeholder="abc@email.com" />
                    <input type="password" name="password" id="password" placeholder="***********"/>
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}