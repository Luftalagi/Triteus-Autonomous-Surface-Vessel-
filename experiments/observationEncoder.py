import openmeteo_requests

import math
import pandas as pd
import requests_cache
from retry_requests import retry

import PIL

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

url = "https://api.open-meteo.com/v1/forecast"

class Bounds:
    def __init__(self, min_lat, max_lat, min_lon, max_lon):
        self.min_lat = min_lat
        self.max_lat = max_lat
        self.min_lon = min_lon
        self.max_lon = max_lon


def step_for_bbox(bounds : Bounds, max_points=250):
    span_lat = bounds.max_lat - bounds.min_lat
    span_lon = bounds.max_lon - bounds.min_lon
    # pick step so lat_count * lon_count ≈ max_points
    step = math.sqrt((span_lat * span_lon) / max_points)
    # snap to sane increments, floor at GFS native
    for s in (0.25, 0.5, 1.0, 2.0, 4.0):
        if step <= s:
            return s
    return 4.0

def generateLatLong(bounds: Bounds, interval: float):
    lats = []
    lons = []

    lat = bounds.min_lat
    while lat <= bounds.max_lat:
        lats.append(lat)
        lat += interval
        
    lon = bounds.min_lon
    while lon <= bounds.max_lon:
        lons.append(lon)
        lon += interval

    return lats, lons

demoBoundary = Bounds(78, 80, 28, 30)
interval = step_for_bbox(demoBoundary)
lat, lon = generateLatLong(demoBoundary, interval=interval)

print(f"Latitude: {lat}")
print(f"Longitudes: {lon}")

params = {
	"latitude": lat,
	"longitude": lon,
	"current": ["wind_speed_10m", "wind_direction_10m"],
}
responses = openmeteo.weather_api(url, params = params)
response = responses[0]

for response in responses:
    current = response.Current()
    speed = current.Variables(0).Value()
    direction = current.Variables(1).Value()
    print(f"{response.Latitude():.2f}N {response.Longitude():.2f}E — {speed:.1f} m/s, {direction:.0f}°")