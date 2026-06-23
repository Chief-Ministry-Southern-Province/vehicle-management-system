import { FiShield } from "react-icons/fi";

export default function ComplianceRegulatory() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-6">

        <FiShield className="text-blue-600" />

        <div>
          <h2 className="text-2xl font-bold">
            Compliance & Regulatory
          </h2>

          <p className="text-gray-500 text-sm">
            Registration dates, tax information and insurance policies.
          </p>
        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-5">

        <input
          type="date"
          className="border rounded-xl px-4 py-3"
        />

        <input
          type="date"
          className="border rounded-xl px-4 py-3"
        />

        <input
          placeholder="Insurance Policy No"
          className="border rounded-xl px-4 py-3"
        />

        <input
          placeholder="Insurance Provider"
          className="border rounded-xl px-4 py-3"
        />

      </div>

    </div>
  );
}