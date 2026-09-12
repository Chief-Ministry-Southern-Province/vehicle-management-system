import { useEffect, useState } from "react";
import { FiEdit2, FiMap, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  createPredefinedJourney,
  deletePredefinedJourney,
  getPredefinedJourneys,
  updatePredefinedJourney,
} from "../api/authApi";

const emptyJourney = { name: "", starting_location: "", destination: "", distance_km: "" };

export default function JourneyManagement() {
  const [journeys, setJourneys] = useState([]);
  const [form, setForm] = useState(emptyJourney);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadJourneys = async () => {
    try {
      const response = await getPredefinedJourneys();
      setJourneys(response?.data?.journeys || []);
    } catch (error) {
      toast.error(error?.message || "Unable to load pre-defined journeys.");
    }
  };

  useEffect(() => { loadJourneys(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingId) await updatePredefinedJourney(editingId, form);
      else await createPredefinedJourney(form);
      toast.success(editingId ? "Journey updated." : "Journey created.");
      setForm(emptyJourney);
      setEditingId(null);
      await loadJourneys();
    } catch (error) {
      const message = error?.errors ? Object.values(error.errors).flat()[0] : error?.message;
      toast.error(message || "Unable to save journey.");
    } finally { setSaving(false); }
  };

  const edit = (journey) => {
    setEditingId(journey.id);
    setForm({
      name: journey.name,
      starting_location: journey.starting_location,
      destination: journey.destination,
      distance_km: journey.distance_km,
    });
  };

  const remove = async (journey) => {
    if (!window.confirm(`Delete "${journey.name}"?`)) return;
    try {
      await deletePredefinedJourney(journey.id);
      setJourneys((items) => items.filter((item) => item.id !== journey.id));
      toast.success("Journey deleted.");
    } catch (error) { toast.error(error?.message || "Unable to delete journey."); }
  };

  return (
    <DashboardLayout>
      <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <header><p className="text-xs font-bold uppercase tracking-[.2em] text-blue-600">System administration</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900">Journey Management</h1><p className="mt-2 text-slate-600">Create reusable official journeys with their approved locations and distance.</p></header>
        <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3"><span className="rounded-xl bg-blue-600 p-3 text-xl text-white"><FiMap /></span><h2 className="font-bold text-slate-900">{editingId ? "Edit journey" : "Add pre-defined journey"}</h2></div>
            {[["name", "Journey name", "e.g. Galle Office to Colombo Secretariat"], ["starting_location", "Starting location", "Enter the official starting location"], ["destination", "Destination", "Enter the official destination"], ["distance_km", "One-way distance (km)", "e.g. 125.50"]].map(([key, label, placeholder]) => <label key={key} className="mb-4 block text-sm font-semibold text-slate-700">{label}<input required type={key === "distance_km" ? "number" : "text"} min={key === "distance_km" ? "0.01" : undefined} step={key === "distance_km" ? "0.01" : undefined} value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 font-normal outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50" /></label>)}
            <div className="flex gap-3"><button disabled={saving} className="rounded-xl bg-blue-700 px-4 py-3 font-bold text-white disabled:opacity-50">{saving ? "Saving..." : editingId ? "Update journey" : "Create journey"}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyJourney); }} className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-700">Cancel</button>}</div>
          </form>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 p-6"><h2 className="font-bold text-slate-900">Available journeys</h2></div><div className="divide-y divide-slate-100">{journeys.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No pre-defined journeys have been created.</p> : journeys.map((journey) => <article key={journey.id} className="p-5"><div className="flex gap-4"><span className="mt-1 rounded-lg bg-blue-50 p-2 text-blue-600"><FiMap /></span><div className="min-w-0 flex-1"><h3 className="font-bold text-slate-900">{journey.name}</h3><p className="mt-1 text-sm text-slate-600">{journey.starting_location} <span className="mx-1 text-blue-500">→</span> {journey.destination}</p><p className="mt-2 text-sm font-bold text-blue-700">{Number(journey.distance_km).toFixed(2)} km one way</p></div><div className="flex h-fit gap-2"><button onClick={() => edit(journey)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" aria-label="Edit journey"><FiEdit2 /></button><button onClick={() => remove(journey)} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label="Delete journey"><FiTrash2 /></button></div></div></article>)}</div></div>
        </div>
      </section>
    </DashboardLayout>
  );
}
