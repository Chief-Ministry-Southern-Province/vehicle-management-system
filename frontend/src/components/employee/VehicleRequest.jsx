import { FiMapPin, FiUsers, FiPaperclip, FiSend, FiSave, FiTruck } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { createVehicleRequest, reverseGeocodeLocation } from "../../api/authApi";
import { useLanguage } from "../../context/useLanguage";
import { useAuth } from "../../context/useAuth";
import LocationMapPicker from "./LocationMapPicker";

const formatPoint = (point) => point ? `${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}` : "";

export default function VehicleRequest() {
  const { language, translate } = useLanguage();
  const { user } = useAuth();
  const [form, setForm] = useState({
    purpose: "",
    starting_location: "",
    starting_latitude: "",
    starting_longitude: "",
    destination: "",
    destination_latitude: "",
    destination_longitude: "",
    departure_at: "",
    expected_return_at: "",
    passenger_count: 1,
    passenger_names: "",
  });
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activePoint, setActivePoint] = useState("start");
  const [focusPoint, setFocusPoint] = useState(null);
  const [searching, setSearching] = useState(null);
  const [resolvingAddress, setResolvingAddress] = useState({ start: false, end: false });
  const [routeResult, setRouteResult] = useState({ key: null, route: null });
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");
  const fileInputRef = useRef(null);
  const reverseLookupRequestRef = useRef({ start: 0, end: 0 });
  const startPoint = form.starting_latitude === "" ? null : { lat: Number(form.starting_latitude), lng: Number(form.starting_longitude) };
  const endPoint = form.destination_latitude === "" ? null : { lat: Number(form.destination_latitude), lng: Number(form.destination_longitude) };
  const startLat = startPoint?.lat;
  const startLng = startPoint?.lng;
  const endLat = endPoint?.lat;
  const endLng = endPoint?.lng;
  const routeKey = startPoint && endPoint ? `${startLng},${startLat};${endLng},${endLat}` : null;
  const route = routeResult.key === routeKey ? routeResult.route : null;
  const visibleRouteError = routeResult.key === routeKey ? routeError : "";
  const distanceKm = route?.distance_km ?? null;
  const addressLookupInProgress = resolvingAddress.start || resolvingAddress.end;

  useEffect(() => {
    if (!routeKey) return undefined;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setRouteLoading(true);
      setRouteError("");
      try {
        const directionsUrl = (import.meta.env.VITE_DIRECTIONS_API_URL || "https://router.project-osrm.org").replace(/\/$/, "");
        const response = await fetch(`${directionsUrl}/route/v1/driving/${routeKey}?overview=full&geometries=geojson&steps=false`);
        if (!response.ok) throw new Error("Directions service request failed");
        const result = await response.json();
        const drivingRoute = result?.routes?.[0];
        if (result?.code !== "Ok" || !drivingRoute?.geometry?.coordinates) throw new Error("No feasible route found");
        if (!cancelled) setRouteResult({ key: routeKey, route: {
          distance_km: Number((drivingRoute.distance / 1000).toFixed(2)),
          duration_seconds: Math.round(drivingRoute.duration || 0),
          geometry: drivingRoute.geometry.coordinates,
        } });
      } catch (error) {
        if (!cancelled) {
          setRouteResult({ key: routeKey, route: null });
          setRouteError(error?.message || translate("A feasible driving route could not be calculated for these locations."));
        }
      } finally {
        if (!cancelled) setRouteLoading(false);
      }
    }, 400);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [routeKey, translate]);

  const setSelectedLocation = (type, point, label) => {
    setForm((current) => type === "start" ? {
      ...current,
      starting_location: label,
      starting_latitude: point.lat,
      starting_longitude: point.lng,
    } : {
      ...current,
      destination: label,
      destination_latitude: point.lat,
      destination_longitude: point.lng,
    });
  };

  const selectLocation = async (type, point, label = null, shouldFocus = false) => {
    const requestId = reverseLookupRequestRef.current[type] + 1;
    reverseLookupRequestRef.current[type] = requestId;

    if (label) {
      setSelectedLocation(type, point, label);
      setResolvingAddress((current) => ({ ...current, [type]: false }));
    } else {
      setSelectedLocation(type, point, translate("Finding location..."));
      setResolvingAddress((current) => ({ ...current, [type]: true }));

      try {
        const result = await reverseGeocodeLocation(point.lat, point.lng, language);
        const address = result?.data?.address?.trim();
        if (!address) throw new Error("No address was returned for this point");

        if (reverseLookupRequestRef.current[type] === requestId) {
          setSelectedLocation(type, point, address);
        }
      } catch {
        if (reverseLookupRequestRef.current[type] === requestId) {
          setSelectedLocation(type, point, formatPoint(point));
          toast.error(translate("Unable to find that location. Please select it on the map."));
        }
      } finally {
        if (reverseLookupRequestRef.current[type] === requestId) {
          setResolvingAddress((current) => ({ ...current, [type]: false }));
        }
      }
    }

    if (shouldFocus) setFocusPoint(point);
    setActivePoint(type === "start" ? "end" : "start");
  };

  const updateLocationText = (type, value) => {
    reverseLookupRequestRef.current[type] += 1;
    setResolvingAddress((current) => ({ ...current, [type]: false }));
    setForm((current) => type === "start" ? {
      ...current,
      starting_location: value,
      starting_latitude: "",
      starting_longitude: "",
    } : {
      ...current,
      destination: value,
      destination_latitude: "",
      destination_longitude: "",
    });
  };

  const findLocation = async (type) => {
    const hasCoordinates = type === "start" ? form.starting_latitude !== "" : form.destination_latitude !== "";
    if (hasCoordinates) return;
    const query = (type === "start" ? form.starting_location : form.destination).trim();
    if (query.length < 3 || searching) return;
    setSearching(type);
    try {
      const parameters = new URLSearchParams({ q: query, format: "jsonv2", countrycodes: "lk", limit: "1", "accept-language": "en,si,ta" });
      const geocodingUrl = import.meta.env.VITE_GEOCODING_API_URL || "https://nominatim.openstreetmap.org/search";
      const response = await fetch(`${geocodingUrl}?${parameters}`);
      if (!response.ok) throw new Error("Location lookup failed");
      const [result] = await response.json();
      if (!result) {
        toast.error(translate("No matching location found in Sri Lanka."));
        return;
      }
      selectLocation(type, { lat: Number(result.lat), lng: Number(result.lon) }, result.display_name, true);
    } catch {
      toast.error(translate("Unable to find that location. Please select it on the map."));
    } finally {
      setSearching(null);
    }
  };

  const handleLocationKeyDown = (event, type) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    findLocation(type);
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    if (!startPoint || !endPoint) {
      toast.error(translate("Select both locations to calculate distance"));
      return;
    }
    if (addressLookupInProgress) {
      toast.error(translate("Finding location..."));
      return;
    }
    if (routeLoading || !route || distanceKm === null) {
      toast.error(visibleRouteError || translate("A feasible driving route could not be calculated for these locations."));
      return;
    }
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        payload.append(key, value),
      );
      if (attachment) payload.append("attachment", attachment);

      await createVehicleRequest(payload);
      toast.success(translate("Vehicle request submitted successfully."));
      setForm({
        purpose: "",
        starting_location: "",
        starting_latitude: "",
        starting_longitude: "",
        destination: "",
        destination_latitude: "",
        destination_longitude: "",
        departure_at: "",
        expected_return_at: "",
        passenger_count: 1,
        passenger_names: "",
      });
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      const errors = error?.errors;
      const message = errors ? Object.values(errors).flat()[0] : error?.message;
      toast.error(
        message || translate("Unable to submit the request. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] sm:p-6">
      <form className="mx-auto max-w-6xl" onSubmit={submitRequest}>
        {/* Header */}
        <div className="relative mb-4 overflow-hidden rounded-2xl border border-blue-400/20 bg-linear-to-br from-slate-950 via-blue-950 to-blue-800 px-4 py-4 text-white shadow-[0_16px_40px_-22px_rgba(30,64,175,0.8)] sm:mb-6 sm:px-6 sm:py-5">
          <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-1/3 h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg text-cyan-200 ring-1 ring-inset ring-white/20 backdrop-blur-sm sm:h-12 sm:w-12 sm:text-xl">
              <FiTruck />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-cyan-200 sm:text-[10px]">
                    {translate("Official Transport")}
                  </p>
                  {user?.role && (
                    <span className="rounded-full bg-cyan-300/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-cyan-100 ring-1 ring-inset ring-cyan-200/20 sm:text-[9px]">
                      {translate(user.role.replaceAll("_", " "))}
                    </span>
                  )}
                </div>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-semibold text-blue-50 ring-1 ring-inset ring-white/15 backdrop-blur-sm sm:text-[10px]">
                  {translate("Draft ID")}: VMS-REQ-PENDING
                </span>
              </div>

              <h1 className="mt-2 text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                {translate("Create New Vehicle Request")}
              </h1>

              <p className="mt-1.5 max-w-2xl text-xs leading-5 text-blue-100/90 sm:text-sm">
                {translate(
                  "Please fill in the details below to request a vehicle for official business.",
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Trip Information */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-linear-to-r from-blue-50/80 to-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-md">
                <FiMapPin />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {translate("Trip Information")}
                </h2>

                <p className="text-sm text-slate-500">
                  {translate("Where and when are you travelling?")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {translate("Purpose of Trip")}
              </label>

              <input
                type="text"
                name="purpose"
                value={form.purpose}
                onChange={updateField}
                required
                placeholder={translate("Regional Site Inspection")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <LocationMapPicker start={startPoint} end={endPoint} routeCoordinates={route?.geometry} focusPoint={focusPoint} activePoint={activePoint} onActivePointChange={setActivePoint} onSelect={selectLocation} translate={translate} />

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {translate("Starting Location")}
              </label>

              <input
                type="text"
                name="starting_location"
                value={form.starting_location}
                onChange={(event) => updateLocationText("start", event.target.value)}
                onKeyDown={(event) => handleLocationKeyDown(event, "start")}
                onBlur={() => findLocation("start")}
                required
                placeholder={translate("Type or select the starting point on the map")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
              <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => findLocation("start")} disabled={searching !== null || form.starting_location.trim().length < 3} className="mt-2 text-xs font-bold text-blue-600 disabled:text-slate-400">{searching === "start" ? translate("Finding location...") : translate("Find on map")}</button>
              {resolvingAddress.start && <p className="mt-2 text-xs font-medium text-blue-600">{translate("Finding location...")}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">{translate("Ending Location")}</label>
              <input type="text" name="destination" value={form.destination} onChange={(event) => updateLocationText("end", event.target.value)} onKeyDown={(event) => handleLocationKeyDown(event, "end")} onBlur={() => findLocation("end")} required placeholder={translate("Type or select the ending point on the map")} className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50" />
              <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => findLocation("end")} disabled={searching !== null || form.destination.trim().length < 3} className="mt-2 text-xs font-bold text-blue-600 disabled:text-slate-400">{searching === "end" ? translate("Finding location...") : translate("Find on map")}</button>
              {resolvingAddress.end && <p className="mt-2 text-xs font-medium text-blue-600">{translate("Finding location...")}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">{translate("Calculated Distance")}</label>
              <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm font-bold text-blue-900">
                <FiMapPin className="text-blue-600" />
                {routeLoading ? translate("Calculating feasible route...") : distanceKm === null ? translate("Select both locations to calculate distance") : `${Number(distanceKm).toFixed(2)} km`}
                <span className="ml-auto text-xs font-medium text-blue-600">{translate("Driving route")}</span>
              </div>
              {visibleRouteError && <p className="mt-2 text-sm font-medium text-red-600">{visibleRouteError}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {translate("Departure Date & Time")}
              </label>

              <input
                type="datetime-local"
                name="departure_at"
                value={form.departure_at}
                onChange={updateField}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                {translate("Expected Return")}
              </label>

              <input
                type="datetime-local"
                name="expected_return_at"
                value={form.expected_return_at}
                onChange={updateField}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-linear-to-r from-indigo-50/80 to-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white shadow-md">
                <FiUsers />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {translate("Passenger Details")}
                </h2>

                <p className="text-sm text-slate-500">
                  {translate("Who else is travelling with you?")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {translate("Total Count")}
                </label>

                <input
                  type="number"
                  name="passenger_count"
                  min="1"
                  max="100"
                  value={form.passenger_count}
                  onChange={updateField}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {translate("Passenger Names")}
                </label>

                <input
                  type="text"
                  name="passenger_names"
                  value={form.passenger_names}
                  onChange={updateField}
                  placeholder={translate("Enter names")}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 p-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-linear-to-r from-cyan-50/80 to-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-600 text-xl text-white shadow-md">
                <FiPaperclip />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {translate("Attachments")}
                </h2>

                <p className="text-sm text-slate-500">
                  {translate("Upload supporting documents.")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50/50 sm:py-14"
            >
              <FiPaperclip className="mx-auto text-4xl text-slate-300 transition group-hover:text-blue-500" />

              <p className="mt-4 font-semibold text-slate-700">
                {translate("Click to upload or drag & drop")}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                PDF, JPG, PNG (Max 5MB)
              </p>
              {attachment && (
                <p className="mt-3 text-sm font-medium text-blue-600">
                  {translate("Selected")}:{" "}
                  <span data-no-translate>{attachment.name}</span>
                </p>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(event) =>
                setAttachment(event.target.files?.[0] || null)
              }
              className="hidden"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse justify-end gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row">
          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50"
            disabled
          >
            <FiSave />
            {translate("Save Draft")}
          </button>

          <button
            type="submit"
            disabled={submitting || routeLoading || addressLookupInProgress || !route}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiSend />
            {submitting
              ? translate("Submitting...")
              : translate("Submit Request")}
          </button>
        </div>
      </form>
    </section>
  );
}
