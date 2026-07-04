# ArduSail

**An autonomous research sailboat platform — solo-developed, built for real science.**

The Triteus ASV is a wind-powered autonomous surface vessel with standardized mounting points for research equipment, designed to give environmental researchers an affordable way to collect water and atmospheric data across lakes and coastal waters. It is powered by [ArduPilot](https://ardupilot.org)'s sailboat autonomy modules and paired with a web application I developed that gives researchers easy, sailing-aware access to the ArduPilot API.

This is my freshman-year flagship project. The goal: a prototype adopted by university research programs by **Q2 2027**.

## Why this exists

Research-grade autonomous surface vessels cost tens of thousands of dollars. However there is no university grade platform for aquatic research. Triteus ASV and its companion application address these pitfalls. With a simple interface, anyone can operate it even without sailing experience.

- **Sailing intelligence** — wind-aware mission planning and no-go zone visualization, built on a live true-wind estimate from the boat itself
- **A science layer** — sensor scheduling and environmental data displayed alongside the boat's track, so a researcher plans a sampling transect, not a flight plan

ArduPilot handles the core autopilot logic (navigation, tacking, sail trim). The web application is a system built to make ArduPilot's interface more accessible.

## Current status: Version 1 — Lake testing

Triteus is developed in phases, each with a concrete deliverable. **The project is currently in Version 1**, where I experiment with simulationware in an effort to understand the ArduPilot API to integrate it to the web app.

| Version | Stage | Deliverable |
|---------|-------|-------------|
| ** v1 **| Simulation (current) **| Web app working end-to-end against ArduPilot SITL (sailboat frame) |
| v2 | Lake testing | RC-scale hull with Pixhawk, telemetry radio link, Raspberry Pi companion computer, and initial sensor suite — full mission upload and live telemetry over the water |
| v3 | Scaled platform | Larger hull, solar power, standardized research sensor bay |
| v4 | Pilot missions | Real environmental data collection with university researchers |


Version 2
- The web app uploads a real mission over a real radio link, and ArduPilot sails it autonomously
- Telemetry (position, heading, speed, wind) streams back live and renders on the map
- The Raspberry Pi companion computer relays MAVLink and hosts the sensor suite, validating the science-layer pipeline before the v3 hull is built
- The wind sensor feeds the Pixhawk directly, keeping true-wind estimation inside the real-time control loop and independent of companion-computer latency

## Architecture (v2)

<img width="398" height="712" alt="Tritusv2 drawio" src="https://github.com/user-attachments/assets/0f6c15d9-bd12-4fe5-9bfa-3ea4c332fd83" />

**Legend:** green — telemetry / sensor data · gray — processing & commands · maroon — radio hardware

**Command path:** A researcher draws a route in the web app, which is uploaded as GeoJSON. The local FastAPI server converts it to a MAVLink mission and transmits it over USB serial to the ground-side telemetry radio. The onboard radio receives it and hands it to the Raspberry Pi, which relays it over serial to the Pixhawk running ArduPilot.

**Telemetry path:** The Pixhawk continuously reports heading, speed, position, and wind state up through the Pi and the radio link. The local server parses the incoming MAVLink stream, reformats it for the client, and pushes it to the web app over WebSocket, where the boat's live position and sensor data render on the map.

**Sensor inputs:** The research sensor suite feeds the Raspberry Pi (science layer). The wind sensor feeds the Pixhawk directly (control loop).

## Stack

- **Autopilot:** ArduPilot (sailboat/rover frame) on Pixhawk, developed against ArduPilot SITL in WSL2/Ubuntu
- **Backend:** FastAPI (Python) + pymavlink — HTTP POST for one-shot commands (mode changes, mission upload, arm/disarm), WebSocket for continuous telemetry downstream and manual control upstream
- **Frontend:** React + MapLibre
- **Companion computer:** Raspberry Pi — MAVLink relay and sensor host
- **Link:** USB/serial telemetry radios (v2) → cellular/satellite planned for offshore phases
- **Packaging:** Docker

## Roadmap to Q2 2027

1. **Complete v2 lake trials** — repeatable autonomous missions with live telemetry and sensor logging
2. **v3 build** — scaled hull, solar power, standardized sensor bay; recruit collaborators to move from solo development to a team
3. **v4 pilots** — partner with university research programs on real data-collection missions

## Contributing

Trietus is solo-developed through the current phase. If you're interested in autonomous marine systems, environmental sensing, or ground-station software, reach out.

## License

TBD
