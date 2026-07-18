const cards = [
  {
    title: "Fleet Compliance",
    text: "Request falls within standard delegation quota.",
  },
  {
    title: "Budget Allocation",
    text: "Fuel & maintenance credits available.",
  },
  {
    title: "Route Safety",
    text: "Minor construction on Route 4.",
  },
  {
    title: "Asset Availability",
    text: "Requested vehicle class is available.",
  },
];

export default function ComplianceCards() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white border rounded-xl p-5">
          <h4 className="font-semibold">{card.title}</h4>

          <p className="text-sm text-gray-500 mt-2">{card.text}</p>
        </div>
      ))}
    </div>
  );
}
