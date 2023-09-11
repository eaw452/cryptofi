import os
from abc import abstractmethod
from dyntastic import Dyntastic
from pydantic import BaseModel, Field


class DynamoDbModelBase(Dyntastic):
    __table_region__ = os.environ.get("AWS_REGION")
    __table_host__ = os.environ.get("DYNAMO_ENDPOINT")
    __hash_key__ = "hash_key"

    @property
    @abstractmethod
    def __table_name__(self):  # over-ride this on each implementing class
        pass

    hash_key: str = Field(default=None, title="DynamoDB Partition Key")


"""TODO
Architect a data structure for storing user's recurring orders. Two tables have already been setup for you,
User and RecurringOrder. It is up to you how you want to structure the data, so feel free to user both tables
or only one based on your strategy.

Don't forget to checkout the full requirements in the README or in api.py as those will pertain relevant information that
will apply to this file.
"""


class Prices(DynamoDbModelBase):
    __table_name__ = "prices"
    __hash_key__ = "coin"

    coin: str = Field(default=None, title="The abbreviation of the coin, i.e. BTC. This is the DynamoDB Partition Key")
    price: str = Field(default=None, title="The price of the coin.")
    name: str = Field(default=None, title="The name of the coin.")


class Balances(DynamoDbModelBase):
    __table_name__ = "balances"
    __hash_key__ = "user_id"

    user_id: str = Field(default=None, title="The user's ID. This is the DynamoDB Partition Key")
    balances: dict = Field(default=None, title="The user's balances.")
