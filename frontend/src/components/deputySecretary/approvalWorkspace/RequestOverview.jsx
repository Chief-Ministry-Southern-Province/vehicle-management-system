function Detail({ label, children }) {
  return (
    <div>
      <p className="text-xs uppercase text-gray-400">{label}</p>
      <div className="mt-1 font-semibold text-slate-800">{children || "—"}</div>
    </div>
  );
}

export default function RequestOverview({ request }) {
  const attachmentUrl = request.attachment_path
    ? `${import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://127.0.0.1:8000"}/storage/${request.attachment_path}`
    : null;
  return (
    <section className="overflow-hidden rounded-2xl border bg-white">
      <div className="border-b p-5">
        <h3 className="text-xl font-bold">Complete Request Details</h3>
      </div>
      <div className="grid gap-6 p-6 sm:grid-cols-2">
        <Detail label="Requester">
          {request.requester_name || request.user?.name}
        </Detail>
        <Detail label="Employee ID">{request.user?.employee_id}</Detail>
        <Detail label="Department">{request.user?.department}</Detail>
        <Detail label="Request Status">
          <span className="capitalize">
            {request.status?.replaceAll("_", " ")}
          </span>
        </Detail>
        <Detail label="Purpose">{request.purpose}</Detail>
        <Detail label="Destination">{request.destination}</Detail>
        <Detail label="Departure">
          {new Date(request.departure_at).toLocaleString()}
        </Detail>
        <Detail label="Expected Return">
          {new Date(request.expected_return_at).toLocaleString()}
        </Detail>
        <Detail label="Passenger Count">{request.passenger_count}</Detail>
        <Detail label="Submitted">
          {new Date(request.created_at).toLocaleString()}
        </Detail>
        <div className="sm:col-span-2">
          <Detail label="Passenger Names">
            <p className="whitespace-pre-wrap font-normal">
              {request.passenger_names || "Not provided"}
            </p>
          </Detail>
        </div>
        <div className="sm:col-span-2">
          <Detail label="Attachment">
            {attachmentUrl ? (
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {request.attachment_original_name || "View attachment"}
              </a>
            ) : (
              "No attachment"
            )}
          </Detail>
        </div>
      </div>
    </section>
  );
}
