import { FiCheckCircle } from "react-icons/fi";

export default function ApprovalHealthCard() {
  return (
    <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-5">

      <div className="flex items-start gap-3">

        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-cyan-600">
          <FiCheckCircle />
        </div>

        <div>

          <h3 className="font-bold text-cyan-700">
            System Health
          </h3>

          <p className="text-sm text-cyan-700 mt-2 leading-relaxed">
            Vehicle assignment logic is currently matching
            optimal fuel consumption routes. Four new
            drivers completed verification this morning
            and are ready for assignment.
          </p>

        </div>

      </div>

    </div>
  );
}