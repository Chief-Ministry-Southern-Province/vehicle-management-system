import DashboardLayout from "../../layouts/DashboardLayout";

import RequestHeader from "../../components/deputySecretary/approvalWorkspace/RequestHeader";
import RequestOverview from "../../components/deputySecretary/approvalWorkspace/RequestOverview";
import ProposedItinerary from "../../components/deputySecretary/approvalWorkspace/ProposedItinerary";
import DocumentationSection from "../../components/deputySecretary/approvalWorkspace/DocumentationSection";
import ComplianceCards from "../../components/deputySecretary/approvalWorkspace/ComplianceCards";
import VehicleSelection from "../../components/deputySecretary/approvalWorkspace/VehicleSelection";
import DriverAssignment from "../../components/deputySecretary/approvalWorkspace/DriverAssignment";
import ApprovalActions from "../../components/deputySecretary/approvalWorkspace/ApprovalActions";

export default function ApprovalWorkspace() {
  return (
    <DashboardLayout>
      <div className="bg-slate-50 min-h-screen p-6">

        <RequestHeader />

        <div className="grid lg:grid-cols-12 gap-6 mt-6">

          <div className="lg:col-span-7 space-y-6">
            <RequestOverview />
            <ProposedItinerary />
            <DocumentationSection />
            <ComplianceCards />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <ApprovalActions />
            <VehicleSelection />
            <DriverAssignment />
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}