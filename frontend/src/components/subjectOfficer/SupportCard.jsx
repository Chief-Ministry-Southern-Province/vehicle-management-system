import {
  FiBookOpen,
  FiHeadphones,
} from "react-icons/fi";

export default function SupportCard() {
  return (
    <div className="bg-blue-600 text-white rounded-2xl p-6">

      <h2 className="text-2xl font-semibold">
        Operational Support
      </h2>

      <p className="mt-3 text-blue-100">
        Need technical assistance or want to report
        a system bug with fleet tracking sensors?
      </p>

      <div className="space-y-3 mt-6">

        <button className="w-full bg-white/10 py-3 rounded-xl text-left px-4">
          <FiBookOpen className="inline mr-2" />
          View Documentation
        </button>

        <button className="w-full bg-white/10 py-3 rounded-xl text-left px-4">
          <FiHeadphones className="inline mr-2" />
          Contact IT Support
        </button>

      </div>

    </div>
  );
}