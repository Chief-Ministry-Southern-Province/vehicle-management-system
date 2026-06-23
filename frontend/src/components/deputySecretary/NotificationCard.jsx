export default function NotificationCard() {
  return (
    <div className="bg-blue-600 text-white rounded-2xl p-6 mt-6">

      <h3 className="font-bold text-xl mb-2">
        System Notification
      </h3>

      <p className="text-blue-100 text-sm leading-relaxed">
        All critical vehicle maintenance for VIP fleet
        completed. All 12 high-priority units are
        currently online.
      </p>

      <button className="mt-5 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium">
        Acknowledge
      </button>

    </div>
  );
}