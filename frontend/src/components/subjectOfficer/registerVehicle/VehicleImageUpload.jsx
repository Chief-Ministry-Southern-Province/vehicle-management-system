import {
  FiImage,
  FiUpload,
  FiInfo,
} from "react-icons/fi";

export default function VehicleImageUpload() {
  return (
    <div className="bg-white border rounded-2xl p-6">

      <div className="flex items-center gap-3 mb-5">

        <FiImage className="text-blue-600" />

        <h3 className="font-bold text-xl">
          Vehicle Imagery
        </h3>

      </div>

      <div className="border-2 border-dashed rounded-xl p-10 text-center">

        <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />

        <p className="font-medium">
          Click to upload vehicle photo
        </p>

        <p className="text-sm text-gray-500">
          PNG, JPG up to 10MB
        </p>

        <input
          type="file"
          className="mt-4"
        />

      </div>

      <div className="mt-4 bg-gray-50 rounded-xl p-4 flex gap-3">

        <FiInfo className="text-gray-500 mt-1" />

        <p className="text-sm text-gray-600">
          High-quality photos from front, side and rear
          are recommended for fleet identification.
        </p>

      </div>

    </div>
  );
}