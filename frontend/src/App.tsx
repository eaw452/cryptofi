import React, { useState, useEffect } from 'react';
import { createContext, useContext } from 'react'
import './App.css';

//object type to be in the response from API
type CoinData = {
  name: string,
  price: string,
  amount: string,
  ticker: string
};

const UserContext = createContext('1');

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

function Dropdown({ user, setUser }: { user: string, setUser: React.Dispatch<React.SetStateAction<string>> }) {
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

function HoldingsTable() {
  const user = useContext(UserContext);
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    //ignore flag ensures state is not updated if effect is fired twice
    let ignore = false;
    async function fetchPricesBalances() {
      try {
        const resp = await fetch(`http://localhost:8000/prices_and_balances/${user}`);
        if (!resp.ok) {
          throw resp.statusText;
        }
        const respJson = await resp.json();
        if (!ignore) {
          setHoldings(respJson["prices_balances"]);
        }
      } catch (e) {
        //ideally should log error and inform user of error
        console.log(e);
      }
    }
    fetchPricesBalances();
    return () => {
      ignore = true;
    };
  }, [user]);

  const coins: any[] = []
  holdings.forEach((holding, i) => {
    coins.push(
      <Coin key={i} coinData={holding} />
    );
  });
  return (
    <table className='Holdings-table'>
      <thead>
      </thead>
      <tbody>
        {coins}
      </tbody>
    </table>
  );
}

function Coin({ coinData }: { coinData: CoinData }) {
  const coinSvgPath = `/assets/${coinData.ticker.toLowerCase()}.svg`
  return (
    <tr className='row'>
      <td className='table-row'>
        <div className="Item-row">
          <div className="Coin-logo-container">
            <img className="coin-svg" src={coinSvgPath} alt={coinData.name} />
          </div>
          <div className="Coin-title-value-container">
            <div>
              <div className="Coin-title">{coinData.name}</div>
              <span>{Number(coinData.price).toLocaleString('en-US', { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div className="Coin-holdings-container">
            <div className='Coin-holdings'>
              <div className="Coin-value">
                {/* convert price into cents before performing operations where precision may be lost */}
                {(Number(coinData.price) * 100 * Number(coinData.amount) / 100).toLocaleString('en-US', { style: "currency", currency: "USD", minimumFractionDigits: 2 })}
              </div>
              <span>{coinData.amount} {coinData.ticker}</span>
            </div>
          </div>
          <div className="Button-container">
            {Number(coinData.amount) ? <button className="Trade-button">Trade</button> : <button className="Buy-button">Buy</button>}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default App;
