import DashboardLayout from "../layouts/DashboardLayout";

export default function SystemChanges() {
  return (
    <DashboardLayout>  

        <section className="mx-auto w-full max-w-4xl rounded-2xl border border-slate-200 bg-white px-5 py-8 shadow-sm md:px-10">
            <div className="w-full">
                <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
                    <div><p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">Administration Panel</p><h2 className="mt-2 text-3xl font-bold text-slate-900">System Changes</h2><p className="mt-2 text-sm text-slate-500">View all the changes made to the system.</p></div>
                </div>
            </div>
        </section>

    </DashboardLayout>
  )
}