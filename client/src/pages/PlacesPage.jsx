import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../components/Perks";
import axios from "axios";

export default function PlacesPage() {
    const { action } = useParams()

    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [addedPhotos, setAddedPhotos] = useState([])
    const [photoLink, setPhotoLink] = useState('')
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState('')

    // Function to dynamically set input header
    function inputHeader(text) {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        )
    }
    // Function to dynamically set input description
    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    // Combined function for header and description
    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }

    // Function to add photos by Link 
    async function addPhotoByLink(e) {
        e.preventDefault()
        const { data } = await axios.post('/upload-by-link', { link: photoLink })
        const { filename } = data; // Extracting the filename from the response data
        setAddedPhotos(prev => [...prev, filename]);
        setPhotoLink('')
    }

    return (
        <div className="">

            {action !== 'new' && (
                <div className="flex justify-center">
                    <Link className="flex-grow max-w-xs bg-primary text-white py-2 rounded-full inline-flex items-center justify-center" to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>
                            Add a new place
                        </span>
                    </Link>
                </div>
            )}
            
            {action === 'new' && (
                <div>
                    <form>
                        {preInput('Title', 'Use a catchy phrase')}
                        <input value={title} onChange={e => setTitle(e.target.value)} type="text" id="title" placeholder="Title, for example: My nice home" />

                        {preInput('Address', 'Address to this place')}
                        <input type="text" value={address} onChange={e => setAddress(e.target.value)} id="address" placeholder="address" />

                        {preInput('Photos', 'more = better')}
                        <div className="flex gap-2">
                            <input value={photoLink} onChange={e => setPhotoLink(e.target.value)} type="text" placeholder="add image link  ...jpg, png" />
                            <button onClick={addPhotoByLink} className="bg-gray-200 grow rounded-2xl px-8">Add&nbsp;image</button>
                        </div>

                        <div className="grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4 mt-2">
                            {addedPhotos.length > 0 && addedPhotos.map(link => (
                                <div key={link}>
                                    {link}
                                </div>
                            ))}

                            <button className="flex justify-center gap-1 border bg-transparent rounded-2xl p-8 text-gray-500 text-2xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                </svg>
                                Upload
                            </button>
                        </div>

                        {preInput('Description', 'Describe your apartment')}
                        <textarea value={description} onChange={e => setDescription(e.target.value)} className="" type="text" id="title" placeholder="A nice penthouse in the heart of NYC" />

                        {preInput('Perks', 'select all the perks your house offers')}
                        <Perks selected={perks} onChange={setPerks} />

                        {preInput('Extra Information', 'house rules, etc')}
                        <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />

                        {preInput('Check in & out times, max guests', 'add time for checking in and out')}
                        <div className="grid sm:grid-cols-3 gap-2">
                            <div>
                                <h3 className="mt-2 -mb-2">Check in time</h3>
                                <input value={checkIn} onChange={e => setCheckIn(e.target.value)} type="number" placeholder="16" />
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-2">Check out time</h3>
                                <input value={checkOut} onChange={e => setCheckOut(e.target.value)} type="number" placeholder="20" />
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-2">Max number of guests</h3>
                                <input value={maxGuests} onChange={e => setMaxGuests(e.target.value)} type="number" placeholder="3" />
                            </div>
                        </div>

                        <button className="primary my-4">Save</button>
                    </form>
                </div>
            )}
        </div>
    )
}
