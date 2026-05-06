/**
 * Azure Maps Geocoding utility.
 *
 * Usage:
 *   import { geocodeAddress } from './geocode.js';
 *   const result = await geocodeAddress('10 Downing Street, London', 'YOUR_AZURE_MAPS_KEY');
 *   // { lat: 51.5034, lon: -0.1276, displayName: '10 Downing St, London, ...' }
 *
 * To get an API key: create an Azure Maps account at https://portal.azure.com/,
 * then find your key under the Azure Maps resource → Authentication.
 */

const AZURE_MAPS_URL = 'https://atlas.microsoft.com/search/address/json';

/**
 * Geocode a free-text address using the Azure Maps Search API.
 *
 * @param {string} address   Full address or postcode to look up.
 * @param {string} apiKey    Your Azure Maps subscription key.
 * @returns {Promise<{lat: number, lon: number, displayName: string}>}
 * @throws  {Error} if no result found or the API call fails.
 */
export async function geocodeAddress(address, apiKey) {
    const params = new URLSearchParams({
        'api-version': '1.0',
        'subscription-key': apiKey,
        query: address,
        // Bias results toward the UK without excluding global results.
        countrySet: 'GB',
        limit: 1,
    });

    const response = await fetch(`${AZURE_MAPS_URL}?${params}`);
    if (!response.ok) {
        throw new Error(`Azure Maps geocoding request failed: ${response.status}`);
    }

    const data = await response.json();
    const results = data?.results ?? [];

    if (results.length === 0) {
        throw new Error(`No location found for: "${address}"`);
    }

    const { lat, lon } = results[0].position;
    const displayName = results[0].address?.freeformAddress ?? address;

    return { lat, lon, displayName };
}
