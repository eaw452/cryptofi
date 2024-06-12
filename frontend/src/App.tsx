import { useState } from 'react';
import { createContext } from 'react';
import { Dropdown } from './components/Dropdown';
import { HoldingsTable } from './components/HoldingsTable';

import './App.css';

export const UserContext = createContext('1');

function App() {
  //Assumption is that there will only be user 1 and user 2. 
  //Handling dynamic number of users requires DB query to get user Ids.
  const [user, setUser] = useState('1');
  return (
    <div className="Background">
      <Dropdown user={user} setUser={setUser} />
      <h2 className="Page-header">Available Coins</h2>
      <UserContext.Provider value={user}>
        <HoldingsTable />
      </UserContext.Provider>
    </div>
  );
}

export default App;
