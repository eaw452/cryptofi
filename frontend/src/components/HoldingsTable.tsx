import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Coin } from './Coin';
import { UserContext } from '../App';

export function HoldingsTable() {
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