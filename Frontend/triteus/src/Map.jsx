import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect } from 'react';

// Stand-in for the real wind API call until the backend exists.
// Same shape/signature as the eventual fetch, so swapping it out later is a one-line change.
function fetchWindForBounds({ bbox, zoom }) {
    console.log('[wind] would fetch for viewport:', { bbox, zoom });
}

function Map() {
    useEffect(() => {
        const map = new maplibregl.Map({
            container: 'map', // container id
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // style URL
            center: [-80.33, 25.95], // starting position [lng, lat]
            zoom: 3, // starting zoom
        });

        map.on('load', () => {
            map.setProjection({type: 'globe'})
        })

        let debounceTimer;
        map.on('moveend', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const b = map.getBounds();
                fetchWindForBounds({
                    bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()],
                    zoom: map.getZoom(),
                });
            }, 400);
        });

        return() => {
            clearTimeout(debounceTimer);
            map.remove();
        }
    }, [])

    return(
        <>    
            <div id="map" className='flex-1 w-full relative bg-[#2a313b]'></div>
        </>
    )
}

export default Map