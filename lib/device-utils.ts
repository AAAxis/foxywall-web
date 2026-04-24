export function getDeviceType(): "ios" | "android" | "other" {
  if (typeof window === "undefined") return "other"

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ""

  // Check for iOS devices
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "ios"
  }

  // Check for Android devices
  if (/android/i.test(userAgent)) {
    return "android"
  }

  return "other"
}

export function getStoreUrl(): string {
  const device = getDeviceType()

  if (device === "ios") {
    return "https://apps.apple.com/app/id6757646633"
  }

  if (device === "android") {
    return "https://play.google.com/store/apps/details?id=com.theholylabs.rock"
  }

  // Default to App Store for desktop/other
  return "https://apps.apple.com/app/id6757646633"
}
