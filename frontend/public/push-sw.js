self.addEventListener("install", () => self.skipWaiting());

const appBaseUrl = new URL(self.registration.scope);
const appUrl = (path = "") => {
  const value = String(path);
  if (/^https?:\/\//i.test(value)) return value;

  return new URL(value.replace(/^\/+/, ""), appBaseUrl).href;
};

self.addEventListener("push", (event) => {
  let payload;

  try {
    payload = event.data?.json() || {};
  } catch {
    payload = { body: event.data?.text() || "You have a new workflow update." };
  }

  const title = payload.title || "Vehicle Management System";
  const options = {
    body: payload.body || "You have a new workflow update.",
    icon: appUrl(payload.icon || "national-emblem.png"),
    badge: appUrl(payload.badge || "national-emblem.png"),
    tag: payload.tag,
    renotify: Boolean(payload.renotify),
    requireInteraction: Boolean(payload.requireInteraction),
    vibrate: payload.vibrate || [200, 100, 200],
    data: {
      ...(payload.data || {}),
      url: appUrl(payload.data?.url),
    },
  };

  const refreshOpenClients = self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((clientList) => clientList.forEach((client) => client.postMessage({ type: "VMS_PUSH_NOTIFICATION" })));

  event.waitUntil(Promise.all([
    self.registration.showNotification(title, options),
    refreshOpenClients,
  ]));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = appUrl(event.notification.data?.url);

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (clientList) => {
      const appClient = clientList.find((client) => client.url.startsWith(self.registration.scope));

      if (appClient) {
        if ("navigate" in appClient && appClient.url !== targetUrl) await appClient.navigate(targetUrl);
        return appClient.focus();
      }

      return self.clients.openWindow(targetUrl);
    }),
  );
});
