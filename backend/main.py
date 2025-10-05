from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import requests
from dotenv import load_dotenv
from os import getenv
import json
from  datetime import datetime

origins = [
    "*"
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

API_KEY = getenv("API_KEY")

@app.get("/")
def ping():
    return {"msg": "hello"}

"""
    What we need is an average od the predicted diameter and to do so, we need to get the min and the max of the respective values
    and then calculate the avg.

    the request comes as such:
    curl -s "https://api.nasa.gov/neo/rest/v1/feed
            ?start_date=2025-10-01
            &end_date=2025-10-03
            &api_key=YOUR_API_KEY" 
    | jq .

    what we need is to be able to do is get a range data and we will be able to do
    is let the user provide a date then give him a range of asteriods and he can then proceed to simulate a crash of those asteroids.

"""

@app.get("/get_range")
async def get_range(start: str, end: str, rate: int):
    print(f"\t[DEBUG]\t\t https://api.nasa.gov/neo/rest/v1/feed?start_date={start}&end_date={end}&api_key={API_KEY}\n")
    d1 = datetime.strptime(start, "%Y-%m-%d")
    d2 = datetime.strptime(end, "%Y-%m-%d")
    if (d2 - d1).days > 7:
        raise HTTPException(status_code=403, detail="Internal SERVER ERROR")

    data = requests.get(f"https://api.nasa.gov/neo/rest/v1/feed?start_date={start}&end_date={end}&api_key={API_KEY}").json()

    # after getting the data we are required to return a detailed view of the data, 
    # all the useless data will be stripped.

    # i need to put everything in one list first

    epoch_size = int(data["element_count"])
    asteroids = []
    for _,asteroids_list in data["near_earth_objects"].items():
        for asteroid in asteroids_list:
            asteroids.append({
                "name": asteroid["name"],
                "absolute_magnitude": asteroid["absolute_magnitude_h"],
                "diameter_min_km": asteroid["estimated_diameter"]["kilometers"]["estimated_diameter_min"],
                "diameter_max_km": asteroid["estimated_diameter"]["kilometers"]["estimated_diameter_max"],
                "velocity_km_s": asteroid["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"],
                "miss_distance_km": asteroid["close_approach_data"][0]["miss_distance"]["kilometers"],
                "close_approach_date": asteroid["close_approach_data"][0]["close_approach_date"],
                "is_hazardous": asteroid["is_potentially_hazardous_asteroid"]
            })


    
    return asteroids[:min(rate, epoch_size)]
