import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { getProfile } from "../api/authApi";
import { useAuth } from "./useAuth";
import { RealtimeContext } from "./RealtimeContext";

const apiUrl = () => (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api").replace(/\/$/, "");

const reverbOptions = (token) => {
  const key = import.meta.env.VITE_REVERB_APP_KEY;
  const scheme = import.meta.env.VITE_REVERB_SCHEME || "http";
  const port = Number(import.meta.env.VITE_REVERB_PORT || (scheme === "https" ? 443 : 8080));

  if (!key || !import.meta.env.VITE_REVERB_HOST || !Number.isFinite(port)) return null;

  return {
    broadcaster: "reverb",
    Pusher,
    key,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === "https",
    enabledTransports: scheme === "https" ? ["wss"] : ["ws", "wss"],
    authEndpoint: `${apiUrl()}/broadcasting/auth`,
    auth: {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  };
};

/**
 * Keeps one authenticated WebSocket subscription for the signed-in user.
 * Route screens use workflowRevision as an invalidation key, so their existing
 * role-protected data loaders re-run without a poll interval.
 */
export default function RealtimeProvider({ children }) {
  const { user, token, login } = useAuth();
  const [workflowRevision, setWorkflowRevision] = useState(0);

  useEffect(() => {
    if (!token || user?.id) return undefined;

    let active = true;

    getProfile()
      .then((response) => {
        const currentUser = response?.data?.user;
        if (active && currentUser?.id) login({ ...user, ...currentUser }, token);
      })
      .catch(() => {
        // A session created before numeric user IDs were cached remains usable;
        // it will join the live channel after the next successful sign-in.
      });

    return () => { active = false; };
  }, [login, token, user]);

  useEffect(() => {
    if (!user?.id || !token) return undefined;

    const options = reverbOptions(token);
    if (!options) return undefined;

    let echo;

    try {
      echo = new Echo(options);
      echo.private(`workflow.user.${user.id}`).listen(".workflow.updated", (update) => {
        window.dispatchEvent(new CustomEvent("vms:workflow-updated", { detail: update }));
        setWorkflowRevision((current) => current + 1);
      });
    } catch {
      // Initial page loads and explicit refresh actions still work if a local
      // Reverb server is unavailable or has not been configured yet.
      return undefined;
    }

    return () => echo.disconnect();
  }, [token, user?.id]);

  return (
    <RealtimeContext.Provider value={{ workflowRevision }}>
      {children}
    </RealtimeContext.Provider>
  );
}
