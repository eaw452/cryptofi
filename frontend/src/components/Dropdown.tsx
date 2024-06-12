import React, { useState } from 'react';


export function Dropdown({ user, setUser }: { user: string, setUser: React.Dispatch<React.SetStateAction<string>> }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };
    const handleUser = (user: string) => {
        setUser(user);
    };
    return (
        <div className="Dropdown-container">
            <button className="User-button" onClick={handleOpen}>User {user}</button>
            {open ? (
                <ul className="menu">
                    <li className="menu-item">
                        <button onClick={() => { handleOpen(); handleUser('1'); }}>User 1</button>
                    </li>
                    <li className="menu-item">
                        <button onClick={() => { handleOpen(); handleUser('2'); }}>User 2</button>
                    </li>
                </ul>
            ) : null}
        </div>
    );
}