import * as React from 'react';
import Map, { Marker } from 'react-map-gl/mapbox';
import mapboxgl from 'mapbox-gl';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

// Using the token provided by the user
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiY2FkZXNrcmlhY2FvIiwiYSI6ImNtanA2eGU1ZTNuaHkzbHB5eDZuNWM0MWsifQ.aR3EZJ9lhmTYPoZM7ABEYw';

interface ProjectLocation {
    id: string;
    name: string; // Project name or partial address
    lat: number;
    lng: number;
}

interface ProjectMapProps {
    locations?: ProjectLocation[];
}

// Initial view state centered on Brazil
const INITIAL_VIEW_STATE = {
    longitude: -51.9253,
    latitude: -14.2350,
    zoom: 3
};

// Some mock locations if none provided (for demo purposes) or fallback
const MOCK_LOCATIONS: ProjectLocation[] = [
    { id: '1', name: 'Obra São Paulo', lat: -23.5505, lng: -46.6333 },
    { id: '2', name: 'Obra Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
    { id: '3', name: 'Obra Belo Horizonte', lat: -19.9167, lng: -43.9345 },
    { id: '4', name: 'Obra Brasília', lat: -15.7801, lng: -47.9292 },
    { id: '5', name: 'Obra Salvador', lat: -12.9777, lng: -38.5016 },
];

export default function ProjectMap({ locations = [] }: ProjectMapProps) {
    // Combine real locations (if we had coords) with mock ones for now to ensure visibility
    // If the parent passes locations with valid lat/lng, we use them.
    // Since we know the DB currently only has address strings, we will likely be using
    // the mock locations inside this component or passed from parent until we geocode.
    // For this implementation, I'll prefer the prop, but default to MOCK if empty so the user sees *something*.
    const displayLocations = locations.length > 0
        ? locations.filter(l => l.lat && l.lng)
        : MOCK_LOCATIONS;

    return (
        <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">
            <Map
                initialViewState={INITIAL_VIEW_STATE}
                style={{ width: '100%', height: 400 }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                mapLib={mapboxgl}
            >
                {displayLocations.map((loc) => (
                    <Marker
                        key={loc.id}
                        longitude={loc.lng}
                        latitude={loc.lat}
                        anchor="bottom"
                    >
                        <div className="relative group cursor-pointer">
                            <MapPin className="w-8 h-8 text-red-500 fill-current" />
                            {/* Tooltip on hover */}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                {loc.name}
                            </div>
                        </div>
                    </Marker>
                ))}
            </Map>

            {/* Legend / Info Overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-md text-sm border border-gray-100 max-w-xs z-10">
                <h4 className="font-semibold text-gray-800 mb-1">Mapa de Obras</h4>
                <p className="text-gray-600 text-xs">
                    Visualização da distribuição geográfica dos projetos ativos.
                </p>
            </div>
        </div>
    );
}
