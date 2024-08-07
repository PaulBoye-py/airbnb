import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import PlacesPage from "./PlacesPage";

export default function AccountPage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);

  // Grab the subpage parameter from the '/account' route in app.jsx
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  // Function to Logout when the logout button is clicked
  async function logOut() {
    await axios.post('/logout');
    setRedirect('/');
    setUser(null);
  }

  // If the User Data has not been fetched, return Loading
  if (!ready) {
    return <div>Loading...</div>;
  }

  // If the user is not logged in
  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />;
  }

  // Function to dynamically add the active nav css when each link in the subpage is clicked
  function linkClasses(type = null) {
    let classes = 'flex items-center justify-center gap-2 py-2 px-6 rounded-full';
    if (type === subpage) {
      classes += ' bg-primary text-white ';
    } else {
        classes += ' bg-gray-200'
    }
    return classes;
  }

  // Redirect to Homepage once the user is logged out
  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div>
      <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
        <Link to={'/account'} className={linkClasses('profile')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span>My Profile</span>
        </Link>
        <Link to={'/account/bookings'} className={linkClasses('bookings')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span>My Bookings</span>
        </Link>
        <Link to={'/account/places'} className={linkClasses('places')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
          </svg>
          <span>My Accommodations</span>
        </Link>
      </nav>

      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          {user ? (
            <>
              Logged in as {user.name} ({user.email})<br />
              <button onClick={logOut} className="primary max-w-sm mt-2">Log out</button>
            </>
          ) : (
            <div>Loading user data...</div>
          )}
        </div>
      )}

      {subpage === 'places' && (
        <div>
          <PlacesPage />
        </div>
      )}
    </div>
  );
}
