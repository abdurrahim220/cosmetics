// utils/deviceInfo.ts
import { Request as ExpressRequest} from "express";
import geoip from "geoip-lite";

export interface DeviceInfo {
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
}

export const getDeviceInfo = (req: ExpressRequest): DeviceInfo => {
  const userAgent = req.headers["user-agent"] || "";
  const ip = req.ip || req.socket.remoteAddress || "";
  const geo = geoip.lookup(ip);

  // Parse user agent for device and browser info
  let deviceType = "Unknown";
  let browser = "Unknown";
  let os = "Unknown";

  if (userAgent.includes("Mobile")) {
    deviceType = "Mobile";
  } else if (userAgent.includes("Tablet")) {
    deviceType = "Tablet";
  } else {
    deviceType = "Desktop";
  }

  if (userAgent.includes("Chrome")) {
    browser = "Chrome";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
  } else if (userAgent.includes("Safari")) {
    browser = "Safari";
  } else if (userAgent.includes("Edge")) {
    browser = "Edge";
  }

  if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Mac OS")) {
    os = "Mac OS";
  } else if (userAgent.includes("Linux")) {
    os = "Linux";
  } else if (userAgent.includes("Android")) {
    os = "Android";
  } else if (userAgent.includes("iOS")) {
    os = "iOS";
  }

  // Format location
  let location = "Unknown";
  if (geo) {
    location = `${geo.city || ''}, ${geo.region || ''}, ${geo.country || ''}`.trim();
    if (location.endsWith(',')) {
      location = location.slice(0, -1);
    }
  }

  return {
    deviceType,
    browser,
    os,
    ipAddress: ip,
    location: location || "Unknown location",
  };
};