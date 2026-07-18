import {
  FiImage,
  FiUploadCloud,
  FiInfo,
  FiCamera,
  FiCheckCircle,
} from "react-icons/fi";

export default function VehicleImageUpload() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-sky-50 via-blue-50 to-slate-50 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <FiImage size={20} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Vehicle Imagery
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upload official vehicle photographs for fleet records and
              identification.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="p-6">
        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
            <FiUploadCloud size={28} />
          </div>

          <h4 className="mt-5 text-lg font-semibold text-slate-800">
            Upload Vehicle Images
          </h4>

          <p className="mt-2 text-sm text-slate-500">
            Drag & drop files here or click to browse
          </p>

          <span className="mt-3 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            PNG, JPG • Maximum 10 MB
          </span>

          <input type="file" className="hidden" />
        </label>

        {/* Preview Placeholders */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
            <FiCamera size={22} className="mx-auto text-slate-400" />

            <p className="mt-2 text-sm font-medium text-slate-700">
              Front View
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
            <FiCamera size={22} className="mx-auto text-slate-400" />

            <p className="mt-2 text-sm font-medium text-slate-700">Side View</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
            <FiCamera size={22} className="mx-auto text-slate-400" />

            <p className="mt-2 text-sm font-medium text-slate-700">Rear View</p>
          </div>
        </div>

        {/* Information Card */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex gap-3">
            <FiInfo className="mt-1 text-blue-600" />

            <div>
              <h4 className="font-medium text-slate-800">Image Guidelines</h4>

              <p className="mt-1 text-sm text-slate-600">
                Upload clear, high-resolution photographs showing the front,
                side, and rear views of the vehicle. These images assist with
                fleet verification, identification, and compliance records.
              </p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
          <FiCheckCircle />
          Images will be securely stored in the fleet registry.
        </div>
      </div>
    </div>
  );
}
