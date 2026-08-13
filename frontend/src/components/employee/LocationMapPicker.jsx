import { useEffect, useMemo, useRef, useState } from "react";
import { FiCrosshair, FiMinus, FiPlus } from "react-icons/fi";

const TILE_SIZE = 256;
const SRI_LANKA = { lat: 7.8731, lng: 80.7718 };

function getRouteViewport(routeCoordinates) {
  const longitudes = routeCoordinates.map(([lng]) => lng);
  const latitudes = routeCoordinates.map(([, lat]) => lat);
  const longitudeSpan = Math.max(...longitudes) - Math.min(...longitudes);
  const latitudeSpan = Math.max(...latitudes) - Math.min(...latitudes);
  const span = Math.max(longitudeSpan, latitudeSpan, 0.01);

  return {
    center: {
      lat: (Math.min(...latitudes) + Math.max(...latitudes)) / 2,
      lng: (Math.min(...longitudes) + Math.max(...longitudes)) / 2,
    },
    zoom: Math.max(7, Math.min(15, Math.floor(Math.log2(3.2 / span)) + 7)),
  };
}

function project({ lat, lng }, zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const sine = Math.sin((Math.max(-85.0511, Math.min(85.0511, lat)) * Math.PI) / 180);
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI)) * scale,
  };
}

function unproject({ x, y }, zoom) {
  const scale = TILE_SIZE * 2 ** zoom;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  return {
    lat: (180 / Math.PI) * Math.atan(Math.sinh(n)),
    lng: (x / scale) * 360 - 180,
  };
}

export default function LocationMapPicker({ start, end, routeCoordinates, focusPoint, activePoint, onActivePointChange, onSelect, translate = (text) => text, readOnly = false, heightClass = "h-[360px]" }) {
  const mapRef = useRef(null);
  const [mapSize, setMapSize] = useState({ width: 900, height: 360 });
  const [viewport, setViewport] = useState({
    center: SRI_LANKA,
    zoom: 8,
    focusPoint,
    routeCoordinates,
  });

  if (focusPoint !== viewport.focusPoint) {
    setViewport({
      center: focusPoint || viewport.center,
      zoom: focusPoint ? Math.max(viewport.zoom, 13) : viewport.zoom,
      focusPoint,
      routeCoordinates,
    });
  } else if (routeCoordinates !== viewport.routeCoordinates) {
    const nextViewport = routeCoordinates?.length
      ? getRouteViewport(routeCoordinates)
      : { center: viewport.center, zoom: viewport.zoom };
    setViewport({ ...nextViewport, focusPoint, routeCoordinates });
  }

  const { center, zoom } = viewport;
  useEffect(() => {
    const element = mapRef.current;
    if (!element) return undefined;
    const updateSize = () => setMapSize({
      width: Math.max(element.clientWidth, 1),
      height: Math.max(element.clientHeight, 1),
    });
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const { width, height } = mapSize;
  const setCenter = (nextCenter) => setViewport((current) => ({
    ...current,
    center: typeof nextCenter === "function" ? nextCenter(current.center) : nextCenter,
  }));
  const setZoom = (nextZoom) => setViewport((current) => ({
    ...current,
    zoom: typeof nextZoom === "function" ? nextZoom(current.zoom) : nextZoom,
  }));
  const centerPixel = project(center, zoom);

  const tiles = useMemo(() => {
    const topLeft = { x: centerPixel.x - width / 2, y: centerPixel.y - height / 2 };
    const firstX = Math.floor(topLeft.x / TILE_SIZE);
    const firstY = Math.floor(topLeft.y / TILE_SIZE);
    const lastX = Math.floor((topLeft.x + width) / TILE_SIZE);
    const lastY = Math.floor((topLeft.y + height) / TILE_SIZE);
    const count = 2 ** zoom;
    const result = [];
    for (let y = firstY; y <= lastY; y += 1) {
      if (y < 0 || y >= count) continue;
      for (let x = firstX; x <= lastX; x += 1) {
        const wrappedX = ((x % count) + count) % count;
        result.push({ x, y, left: x * TILE_SIZE - topLeft.x, top: y * TILE_SIZE - topLeft.y, url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png` });
      }
    }
    return result;
  }, [centerPixel.x, centerPixel.y, height, width, zoom]);

  const pointPosition = (point) => {
    if (!point) return null;
    const pixel = project(point, zoom);
    return { left: width / 2 + pixel.x - centerPixel.x, top: height / 2 + pixel.y - centerPixel.y };
  };
  const startPosition = pointPosition(start);
  const endPosition = pointPosition(end);
  const routePoints = (routeCoordinates || []).map(([lng, lat]) => pointPosition({ lat, lng })).filter(Boolean);
  const routePath = routePoints.map((point) => `${(point.left / width) * 100},${(point.top / height) * 100}`).join(" ");

  const selectPoint = (event) => {
    if (readOnly || !onSelect) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const point = unproject({
      x: centerPixel.x + ((event.clientX - bounds.left) / bounds.width) * width - width / 2,
      y: centerPixel.y + ((event.clientY - bounds.top) / bounds.height) * height - height / 2,
    }, zoom);
    onSelect(activePoint, { lat: Number(point.lat.toFixed(6)), lng: Number(point.lng.toFixed(6)) });
  };

  const pan = (x, y) => setCenter(unproject({ x: centerPixel.x + x, y: centerPixel.y + y }, zoom));

  return (
    <div className="md:col-span-2">
      {!readOnly && <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={translate("Location to select")}>
        {[["start", "Select starting location"], ["end", "Select ending location"]].map(([value, label]) => (
          <button key={value} type="button" onClick={() => onActivePointChange(value)} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${activePoint === value ? "bg-blue-600 text-white shadow-md" : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
            {translate(label)}
          </button>
        ))}
        <span className="self-center text-xs text-slate-500">{translate("Click the map to place the selected point.")}</span>
      </div>}
      <div ref={mapRef} className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ${heightClass} ${readOnly ? "cursor-grab" : "cursor-crosshair"}`} onClick={selectPoint} role={readOnly ? "img" : "application"} aria-label={readOnly ? translate("Saved driving route map") : translate("Map location selector")}>
        <div className="absolute left-0 top-0 h-full w-full" style={{ transform: `scaleX(${1})` }}>
          {tiles.map((tile) => <img key={`${tile.x}-${tile.y}`} src={tile.url} alt="" draggable="false" className="pointer-events-none absolute max-w-none select-none" style={{ width: `${(TILE_SIZE / width) * 100}%`, height: `${(TILE_SIZE / height) * 100}%`, left: `${(tile.left / width) * 100}%`, top: `${(tile.top / height) * 100}%` }} />)}
          {routePath && (
            <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full drop-shadow-md" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline points={routePath} fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <polyline points={routePath} fill="none" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <polyline points={routePath} fill="none" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
          )}
          {[[startPosition, "A", "bg-emerald-600"], [endPosition, "B", "bg-rose-600"]].map(([position, label, color]) => position && <span key={label} className={`pointer-events-none absolute z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full border-2 border-white text-xs font-black text-white shadow-lg ${color}`} style={{ left: `${(position.left / width) * 100}%`, top: `${(position.top / height) * 100}%` }}>{label}</span>)}
        </div>
        <div className="absolute right-2 top-2 flex flex-col gap-1 sm:right-3 sm:top-3" onClick={(event) => event.stopPropagation()}>
          <button type="button" aria-label={translate("Zoom in")} onClick={() => setZoom((value) => Math.min(16, value + 1))} className="rounded-lg bg-white p-1.5 text-sm shadow sm:p-2"><FiPlus /></button>
          <button type="button" aria-label={translate("Zoom out")} onClick={() => setZoom((value) => Math.max(3, value - 1))} className="rounded-lg bg-white p-1.5 text-sm shadow sm:p-2"><FiMinus /></button>
          <button type="button" aria-label={translate("Center saved route")} onClick={() => routeCoordinates?.length ? setViewport((current) => ({ ...current, ...getRouteViewport(routeCoordinates) })) : setCenter(SRI_LANKA)} className="rounded-lg bg-white p-1.5 text-sm shadow sm:p-2"><FiCrosshair /></button>
        </div>
        <div className="absolute bottom-7 left-3 hidden grid-cols-3 gap-1 sm:grid" onClick={(event) => event.stopPropagation()}>
          <span /><button type="button" aria-label={translate("Pan north")} onClick={() => pan(0, -160)} className="rounded bg-white/95 px-2 py-1 shadow">↑</button><span />
          <button type="button" aria-label={translate("Pan west")} onClick={() => pan(-220, 0)} className="rounded bg-white/95 px-2 py-1 shadow">←</button><span /><button type="button" aria-label={translate("Pan east")} onClick={() => pan(220, 0)} className="rounded bg-white/95 px-2 py-1 shadow">→</button>
          <span /><button type="button" aria-label={translate("Pan south")} onClick={() => pan(0, 160)} className="rounded bg-white/95 px-2 py-1 shadow">↓</button><span />
        </div>
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="absolute bottom-0 right-0 bg-white/80 px-1 text-[10px] text-slate-600">© OpenStreetMap contributors</a>
      </div>
    </div>
  );
}
