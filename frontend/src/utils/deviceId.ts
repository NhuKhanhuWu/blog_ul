/** @format */

import FingerprintJS from "@fingerprintjs/fingerprintjs";

export async function deviceId(): Promise<string> {
  // check device id in local storage
  const cachedId = localStorage.getItem("app_device_id");
  if (cachedId) return cachedId;

  try {
    // 2. if not, create one FingerprintJS
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    // visitorId is a unique hash base on hardware/browser
    const deviceId = result.visitorId;

    // 3. save id in local storage
    localStorage.setItem("app_device_id", deviceId);
    return deviceId;
  } catch (error) {
    console.error("Error device id:", error);

    // backup if the library is broken (generate random string)
    const fallbackId =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("app_device_id", fallbackId);
    return fallbackId;
  }
}
