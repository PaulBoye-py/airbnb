import { useContext, useState } from "react"
import axios from "axios";
import { UserContext } from "../userContext"
import { Link, Navigate, redirect, useParams } from "react-router-dom";

export default function AccountPage() {
    const [redirect, setRedirect] = useState(null);
    const {ready, user} = useContext(UserContext);

    // Grab the subpage parameter from the '/account' route in app.jsx
    let {subpage} = useParams();
    if (subpage === undefined) {
        subpage = 'profile'
    }

    // Function to Logout when the logout button is clicked
    async function logOut() {
       await axios.post('/logout');
       setRedirect('/');
    }

    // If the User Data has not been fetched, return Loading
    if (!ready) {
        return (
            <div>Loading...</div>
        )
    }

    // If tUser is not logged in
    if (ready && !user) {
        return <Navigate to={'/login'}/>
    }

    // Function to dynamically add the active nav css when each link in the subpage is clicked
    function linkClasses (type=null) {
        let classes = 'py-2 px-6';
        if (type === subpage) {
            classes += ' bg-primary text-white rounded-full'
        };
        return classes;
    };
    
    // Redirect to Homepage once the user is logged out
    if (redirect) {
        return <Navigate to={'/'} />
    }

    // If user is logged in, and data is ready, return the following page
    return (
        <div>
            <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
                <Link to={'/account'} className={linkClasses('profile')}>My Profile</Link>
                <Link to={'/account/bookings'} className={linkClasses('bookings')}>My Bookings</Link>
                <Link to={'/account/places'} className={linkClasses('places')}>My Accomodation</Link>
            </nav>

            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logOut} className="primary max-w-sm mt-2 ">Log out</button>
                </div>
            )}
        </div>
    )
}