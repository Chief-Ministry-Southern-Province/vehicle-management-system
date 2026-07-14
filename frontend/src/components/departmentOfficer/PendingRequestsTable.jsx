import RecommendationTable from "../recommendations/RecommendationTable";

export default function PendingRequestsTable({ requests, loading }) {
  return (
    <div className="space-y-6">
      <RecommendationTable requests={requests} loading={loading} />
    </div>
  );
}
