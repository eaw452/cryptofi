type CoinData = {
    name: string,
    price: string,
    amount: string,
    ticker: string
};

export function Coin({ coinData }: { coinData: CoinData }) {
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