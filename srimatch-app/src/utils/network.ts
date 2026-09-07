export type NetworkStatusType = 'CHECKING' | 'ONLINE' | 'NO_INTERNET' | 'SERVER_DOWN';

/**
 * Checks if the device has an active internet connection and if the SriMatch backend is reachable.
 */
export async function checkNetworkAndServerStatus(apiBaseUrl: string): Promise<NetworkStatusType> {
  // Step 1: Check Internet Connection (ping reliable global endpoint)
  let isInternetAvailable = false;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const netRes = await fetch('https://clients3.google.com/generate_204', {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);
    if (netRes.status === 204 || netRes.status === 200 || netRes.ok) {
      isInternetAvailable = true;
    }
  } catch (e) {
    // Secondary fallback ping
    try {
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 4000);
      const netRes2 = await fetch('https://1.1.1.1', {
        method: 'HEAD',
        signal: controller2.signal,
      });
      clearTimeout(timeoutId2);
      if (netRes2.ok || netRes2.status >= 200) {
        isInternetAvailable = true;
      }
    } catch (fallbackErr) {
      isInternetAvailable = false;
    }
  }

  if (!isInternetAvailable) {
    return 'NO_INTERNET';
  }

  // Step 2: Check Backend Server Reachability & Health
  try {
    const serverController = new AbortController();
    const serverTimeoutId = setTimeout(() => serverController.abort(), 8000);

    const serverRes = await fetch(`${apiBaseUrl.replace(/\/+$/, '')}/auth/login`, {
      method: 'OPTIONS',
      signal: serverController.signal,
      cache: 'no-store',
    }).catch(async () => {
      // Fallback ping to base API
      return fetch(`${apiBaseUrl.replace(/\/+$/, '')}`, {
        method: 'GET',
        signal: serverController.signal,
        cache: 'no-store',
      });
    });

    clearTimeout(serverTimeoutId);

    // If server returns 502, 503, 504 it is undergoing maintenance
    if (serverRes && serverRes.status >= 502 && serverRes.status <= 504) {
      return 'SERVER_DOWN';
    }

    // Any other response (200, 400, 401, 403, 404, 405) means server is responding
    return 'ONLINE';
  } catch (serverErr) {
    return 'ONLINE';
  }
}
