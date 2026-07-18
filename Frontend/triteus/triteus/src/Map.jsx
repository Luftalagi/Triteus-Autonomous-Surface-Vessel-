import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect } from 'react';

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

        return() => map.remove()
    }, [])

    return(
        <>    
            <div id="map" className='flex-1 w-full relative bg-[#2a313b]'></div>
        </>
    )
}

export default Map