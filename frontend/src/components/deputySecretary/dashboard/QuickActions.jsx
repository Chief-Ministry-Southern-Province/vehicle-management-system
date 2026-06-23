export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">

      <button className="bg-blue-600 text-white h-24 rounded-2xl font-semibold">
        New Request
      </button>

      <button className="bg-white border h-24 rounded-2xl font-semibold">
        Audit Log
      </button>

    </div>
  );
}