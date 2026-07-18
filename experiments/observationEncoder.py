import openmeteo_requests

import math
import pandas as pd
import requests_cache
from retry_requests import retry

from PIL import Image

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

demoBoundary = Bounds(24.5, 27.0, -82.0, -79.5)
interval = step_for_bbox(demoBoundary)
lat, lon = generateLatLong(demoBoundary, interval=interval)

print(f"Latitude: {lat}")
print(f"Longitudes: {lon}")

grid_lats = []
grid_lons = []
for la in lat:
    for lo in lon:
        grid_lats.append(la)
        grid_lons.append(lo)

params = {
	"latitude": grid_lats,
	"longitude": grid_lons,
	"current": ["wind_speed_10m", "wind_direction_10m"],
}
responses = openmeteo.weather_api(url, params = params)
response = responses[0]

height = len(lat)
width = len(lon)
img = Image.new("RGB", (width, height))

max_wind = 50
i = 0
for y in range(height):
    for x in range(width):
        response = responses[i]
        current = response.Current()
        speed = current.Variables(0).Value()
        direction = current.Variables(1).Value()

        u = speed * math.sin(math.radians(direction))
        v = speed * math.cos(math.radians(direction))

        r = int(((u / max_wind) + 1) / 2 * 255)
        b = int(((v / max_wind) + 1) / 2 * 255)
        r = max(0, min(255, r))
        b = max(0, min(255, b))

        img.putpixel((x, y), (r, 0, b))
        i += 1

scaled = img.resize((width * 50, height * 50), Image.NEAREST)
scaled.save("wind.png")

