const itinerary = [
  {
    time: "08:00 AM",
    title: "Ministry Central Gate",
    desc: "Departure of diplomatic staff",
  },
  {
    time: "11:30 AM",
    title: "Regional Medical Center",
    desc: "Facility inspection",
  },
  {
    time: "02:00 PM",
    title: "District Council Office",
    desc: "Working lunch & meeting",
  },
  {
    time: "06:00 PM",
    title: "Ministry Central Gate",
    desc: "Return and secure briefing",
  },
];

export default function ProposedItinerary() {
  return (
    <div className="bg-white border rounded-2xl">

      <div className="p-5 border-b">
        <h3 className="font-bold text-xl">
          Proposed Itinerary
        </h3>
      </div>

      <div className="p-6">

        {itinerary.map((item) => (
          <div
            key={item.time}
            className="flex gap-4 mb-8"
          >
            <div className="w-3 h-3 mt-2 rounded-full bg-blue-600" />

            <div>
              <p className="text-sm text-gray-500">
                {item.time}
              </p>

              <h4 className="font-semibold">
                {item.title}
              </h4>

              <p className="text-gray-500 text-sm">
                {item.desc}
              </p>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}