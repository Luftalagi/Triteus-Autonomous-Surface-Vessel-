import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ParticleMotion, SmoothRaster, RgbGeoTiff } from 'mapbox-exif-layer';
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

        const windLayer = new ParticleMotion({
            id: 'wind-particle',
            source: '/wind.jpg',
            color: [[0, [0, 195, 255]], [20, [249, 243, 1]], [42, [128, 0, 0]]],
            unit: 'mps',
            bounds: [-82.0, 27.0, -79.5, 24.5],
            readyForDisplay: true,
            velocityRange: [-50, 50],
            mapRuntime: 'maplibre',
            velocityFactor: 0.005,
        });


        map.on('load', () => {
            map.setProjection({type: 'globe'})
            map.addLayer(windLayer)
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