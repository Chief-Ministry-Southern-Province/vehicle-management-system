import {
  deletePushSubscription,
  getPushPublicKey,
  savePushSubscription,
} from "../api/authApi";

const SERVICE_WORKER_URL = "/push-sw.js";

export const supportsPushNotifications = () =>
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window;

const base64UrlToUint8Array = (value) => {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replaceAll("-", "+").replaceAll("_", "/");
  const binary = window.atob(base64);

  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

export const registerPushServiceWorker = async () => {
  if (!supportsPushNotifications()) return null;

  return navigator.serviceWorker.register(SERVICE_WORKER_URL);
};

const persistSubscription = async (subscription) => {
  const json = subscription.toJSON();

  await savePushSubscription({
    endpoint: json.endpoint,
    keys: json.keys,
    content_encoding: PushManager.supportedContentEncodings?.[0] || "aes128gcm",
  });
};

export const enablePushNotifications = async ({ requestPermission = false } = {}) => {
  if (!supportsPushNotifications()) return "unsupported";

  let permission = Notification.permission;
  if (permission === "default" && requestPermission) {
    permission = await Notification.requestPermission();
  }
  if (permission !== "granted") return permission === "denied" ? "denied" : "prompt";

  const registration = await registerPushServiceWorker();
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const response = await getPushPublicKey();
    const publicKey = response.data?.public_key;

    if (!publicKey) throw new Error("The Web Push public key is not configured.");

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlToUint8Array(publicKey),
    });
  }

  await persistSubscription(subscription);

  return "enabled";
};

export const disablePushNotifications = async () => {
  if (!supportsPushNotifications()) return;

  const registration = await navigator.serviceWorker.getRegistration(SERVICE_WORKER_URL);
  const subscription = await registration?.pushManager.getSubscription();

  if (!subscription) return;

  try {
    await deletePushSubscription(subscription.endpoint);
  } finally {
    await subscription.unsubscribe();
  }
};
