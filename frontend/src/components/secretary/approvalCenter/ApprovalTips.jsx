import { FiShield } from "react-icons/fi";

export default function ApprovalTips() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-4">
        <FiShield className="text-blue-600" />

        <h3 className="font-bold">
          Secretary's Oversight Tip
        </h3>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">
        Executive approval should prioritize requests from
        the Ministry of Health and Emergency Management
        during high-alert periods. Always verify the
        Fuel Estimate against the current departmental
        quarterly caps displayed in the Executive Reports
        module.
      </p>

    </div>
  );
}