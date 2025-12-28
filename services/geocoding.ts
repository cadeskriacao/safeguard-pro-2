
const MAPBOX_TOKEN = process.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiY2FkZXNrcmlhY2FvIiwiYSI6ImNtanA2eGU1ZTNuaHkzbHB5eDZuNWM0MWsifQ.aR3EZJ9lhmTYPoZM7ABEYw';

export async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    if (!address) return null;

    try {
        const encodedAddress = encodeURIComponent(address);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&limit=1`;

        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Mapbox Geocoding Error: ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center; // Mapbox returns [lng, lat]
            return { lat, lng };
        }

        return null;
    } catch (error) {
        console.error('Geocoding exception:', error);
        return null;
    }
}
