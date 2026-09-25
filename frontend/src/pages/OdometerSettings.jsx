import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle, FiSettings } from "react-icons/fi";
import { getOdometerSettings, updateOdometerSettings } from "../api/authApi";
import { useLanguage } from "../context/useLanguage";
import DashboardLayout from "../layouts/DashboardLayout";

export default function OdometerSettings() {
  const { t } = useLanguage();
  const [odometerReadingsRequired, setOdometerReadingsRequired] = useState(true);
  const [loading, setLoading] = useState(true);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getOdometerSettings();
      setOdometerReadingsRequired(response?.data?.settings?.odometer_readings_required !== false);
      setSettingsLoaded(true);
    } catch (requestError) {
      setSettingsLoaded(false);
      setError(requestError?.message || t("odometer.settingLoadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const initialLoad = window.setTimeout(loadSettings, 0);
    return () => window.clearTimeout(initialLoad);
  }, [loadSettings]);

  const toggleRequirement = async () => {
    const nextValue = !odometerReadingsRequired;
    setSaving(true);
    setError("");

    try {
      const response = await updateOdometerSettings({
        odometer_readings_required: nextValue,
      });
      setOdometerReadingsRequired(
        response?.data?.settings?.odometer_readings_required !== false,
      );
      toast.success(t("odometer.settingUpdated"));
    } catch (requestError) {
      const message = requestError?.errors
        ? Object.values(requestError.errors).flat()[0]
        : requestError?.message || t("odometer.settingSaveFailed");
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const statusLabel = odometerReadingsRequired
    ? t("odometer.required")
    : t("odometer.optional");
  const statusDescription = odometerReadingsRequired
    ? t("odometer.requiredDescription")
    : t("odometer.optionalDescription");

  return (
    <DashboardLayout>
      <section className="mx-auto w-full max-w-4xl space-y-6 py-2 sm:py-4">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">{t("odometer.systemAdministration")}</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">{t("nav.odometer_settings")}</h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">{t("odometer.settingsDescription")}</p>
        </header>

        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">{error}</p>}

        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="bg-linear-to-r from-blue-950 via-blue-900 to-indigo-900 p-5 text-white sm:p-7">
            <div className="flex items-start gap-4">
              <span className="rounded-2xl bg-white/10 p-3 text-cyan-200 ring-1 ring-inset ring-white/20"><FiSettings size={26} aria-hidden="true" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">{t("odometer.driverJourneys")}</p>
                <h2 className="mt-1 text-xl font-bold">{t("odometer.settingsTitle")}</h2>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("odometer.loadingSettings")}</p>
            ) : (
              <>
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${odometerReadingsRequired ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"}`}>{statusLabel}</span>
                      {odometerReadingsRequired && <FiCheckCircle className="text-emerald-600 dark:text-emerald-300" aria-hidden="true" />}
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">{statusDescription}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={odometerReadingsRequired}
                    aria-label={t("odometer.settingsTitle")}
                    disabled={saving || !settingsLoaded}
                    onClick={toggleRequirement}
                    className={`relative inline-flex h-9 w-16 shrink-0 items-center rounded-full p-1 transition focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-blue-900 ${odometerReadingsRequired ? "bg-blue-700" : "bg-slate-400 dark:bg-slate-600"}`}
                  >
                    <span className={`h-7 w-7 rounded-full bg-white shadow transition ${odometerReadingsRequired ? "translate-x-7" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900 dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-100">
                  {odometerReadingsRequired
                    ? t("odometer.requiredDescription")
                    : t("odometer.optionalHint")}
                </div>
              </>
            )}
          </div>
        </article>
      </section>
    </DashboardLayout>
  );
}
