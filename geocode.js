/**
 * Bing Maps Geocoding utility.
 *
 * Usage:
 *   import { geocodeAddress } from './geocode.js';
 *   const result = await geocodeAddress('10 Downing Street, London', 'YOUR_BING_KEY');
 *   // { lat: 51.5034, lon: -0.1276, displayName: '10 Downing St, London, ...' }
 *
 * To get a free API key: https://www.bingmapsportal.com/
 * Free tier: 125,000 transactions/year.
 */

const BING_GEOCODE_URL = 'https://dev.virtualearth.net/REST/v1/Locations';

/**
 * Geocode a free-text address using the Bing Maps Locations API.
 *
 * @param {string} address   Full address or postcode to look up.
 * @param {string} apiKey    Your Bing Maps API key.
 * @returns {Promise<{lat: number, lon: number, displayName: string}>}
 * @throws  {Error} if no result found or the API call fails.
 */
export async function geocodeAddress(address, apiKey) {
    const params = new URLSearchParams({
        q: address,
        key: apiKey,
        // Bias results toward the UK without excluding global results.
        userRegion: 'GB',
        c: 'en-GB',
        maxResults: 1,
    });

    const response = await fetch(`${BING_GEOCODE_URL}?${params}`);
    if (!response.ok) {
        throw new Error(`Bing geocoding request failed: ${response.status}`);
    }

    const data = await response.json();
    const resources = data?.resourceSets?.[0]?.resources ?? [];

    if (resources.length === 0) {
        throw new Error(`No location found for: "${address}"`);
    }

    const [lat, lon] = resources[0].point.coordinates;
    const displayName = resources[0].name ?? address;

    return { lat, lon, displayName };
}
