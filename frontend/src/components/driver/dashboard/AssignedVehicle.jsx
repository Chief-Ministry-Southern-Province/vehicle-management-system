export default function AssignedVehicle() {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1550355291-bbee04a92027?w=1000"
        alt="vehicle"
        className="w-full h-52 object-cover"
      />

      <div className="p-5">
        <h3 className="text-2xl font-bold">Toyota Camry Hybrid</h3>

        <p className="text-slate-500">Fleet ID: VMS-SUV-042</p>

        <div className="mt-5 space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>Fuel Level</span>
              <span>82%</span>
            </div>

            <div className="h-2 bg-slate-200 rounded-full">
              <div className="h-2 w-[82%] bg-blue-600 rounded-full" />
            </div>
          </div>

          <div>
            <p>Register Number</p>
            <h4 className="text-lg font-bold">KDA-042-2023</h4>

            <p className="text-slate-500">Seact Capacity</p>
            <h4 className="text-lg font-bold">5 Seater</h4>

            <p className="text-slate-500">Vehicle Type</p>
            <h4 className="text-lg font-bold">Sedan</h4>

            <p className="text-slate-500">Livence Expir Date</p>
            <h4 className="text-lg font-bold">12/12/2024</h4>
          </div>
        </div>

        <button className="w-full mt-6 border border-blue-200 text-blue-600 py-3 rounded-xl">
          Report Vehicle Issue
        </button>
      </div>
    </div>
  );
}
