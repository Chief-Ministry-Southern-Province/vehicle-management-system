import RequestHistory from "../requests/RequestHistory";

export default function SubjectOfficerRequestHistory() {
  return (
    <RequestHistory
      title="Subject Officer Request History"
      description="Track vehicle requests you submitted and their recommendation and approval status."
      detailBasePath="/subjectofficer/requests"
    />
  );
}
