export default function DocumentationSection() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <h3 className="font-bold text-xl mb-5">
        Documentation & Recommendations
      </h3>

      <div className="grid md:grid-cols-2 gap-4">

        <div className="border rounded-xl p-4">
          Itinerary_Matrix_7721.pdf
        </div>

        <div className="border rounded-xl p-4">
          Sec_Protocol_Check.pdf
        </div>

      </div>

      <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h4 className="font-semibold mb-2">
          Secretary of State Recommendation
        </h4>

        <p className="italic text-gray-600">
          Given the diplomatic nature of this visit,
          an SUV with high-clearance is recommended.
        </p>
      </div>

    </div>
  );
}