from fastapi import FastAPI, Path
from fastapi.middleware.cors import CORSMiddleware
import sys
from typing import Annotated
from .model import Balances, Prices

app = FastAPI(
    title="CryptoFi Full-Stack Coding Challenge",
)


@app.get("/")
def hello_world():
    """
    NOTE: This is route is used as an example for the test suite
    No action needed here
    """
    return {"hello": "world"}


@app.get("/prices_and_balances/{user_id}")    #validate user id input - assumption: must be in range [1, max int]
def get_prices_and_balances(user_id: Annotated[int, Path(title="The ID of the user", ge=1, le=sys.maxsize)]):
    """
    TODO
    Requirements:
    The GET route return the current prices for BTC, ETH and BCH and the user's balances for BTC, ETH and BCH.
    The prices should be ordered by the highest user balance to the lowest user balance, then alphabetically for all coins with no balance.
    """
    userBalances = Balances.safe_get(str(user_id))
    if userBalances == None:
        return {"balances": "user not found"}
    balances = []
    for coin, amount in userBalances.balances.items():
        balances.append((coin, amount))
    #dynamo limits batch read to 100 items or 16MB
    #should be handled with pagination if expecting to scale the result set
    prices = Prices.batch_get([coin for coin, _ in balances])
    if prices == None:
        return {"prices": "batch limit exceeded"}
    coinData = []
    for priceObj in prices:
        for balance in balances:
            if priceObj.coin == balance[0]:
                coinData.append((balance + (priceObj.price, priceObj.name)))
                break
    coinData.sort(key=lambda x : x[0])
    coinData.sort(key=lambda x : float(x[1]), reverse=True)
    coinObjects = []
    for obj in coinData:
        coinObjects.append({"ticker": obj[0], "amount": obj[1], "price":obj[2], "name":obj[3]})
    return {"prices_balances" : coinObjects}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
