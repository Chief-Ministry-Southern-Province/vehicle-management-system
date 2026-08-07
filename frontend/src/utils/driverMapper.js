const STATUS_LABELS = {
  available: "Available",
  scheduled_trip: "Scheduled Trip",
  ongoing_trip: "Ongoing Trip",
  unavailable: "Unavailable",
};

const DUTY_STATUS_LABELS = {
  active: "Active",
  inactive: "Inactive",
};

const DUTY_STATUS_VALUES = {
  Active: "active",
  Inactive: "inactive",
};

export function normalizeDriver(driver) {
  const profilePicturePath =
    driver.user?.profile_picture_path || driver.profile_picture_path;
  const apiOrigin =
    import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
    "http://127.0.0.1:8000";

  return {
    databaseId: driver.id,
    id: driver.driver_id,
    fullName: driver.full_name,
    dateOfBirth: driver.date_of_birth,
    nic: driver.nic,
    address: driver.address,
    contactNumber: driver.contact_number,
    email: driver.user?.email || driver.email || "",
    department: driver.user?.department || driver.department || "",
    profilePhotoUrl: profilePicturePath
      ? `${apiOrigin}/${String(profilePicturePath).replace(/^\/+/, "")}`
      : "",
    bloodGroup: driver.blood_group || "",
    licenceNumber: driver.licence_number,
    licenceType: driver.licence_type,
    licenceRenewalDate: driver.licence_renewal_date,
    vehicle: driver.allocated_vehicle || "Not allocated",
    registration: driver.allocated_vehicle || "",
    status: STATUS_LABELS[driver.status] || driver.status || "Unavailable",
    dutyStatus:
      DUTY_STATUS_LABELS[driver.duty_status] ||
      (driver.status === "available" ? "Active" : "Inactive"),
  };
}

export function toDriverPayload(driver) {
  return {
    driver_id: driver.id.trim(),
    full_name: driver.fullName.trim(),
    date_of_birth: driver.dateOfBirth,
    nic: driver.nic.trim(),
    address: driver.address.trim(),
    contact_number: driver.contactNumber.trim(),
    blood_group: driver.bloodGroup || null,
    licence_number: driver.licenceNumber.trim(),
    licence_type: driver.licenceType.trim(),
    licence_renewal_date: driver.licenceRenewalDate,
    allocated_vehicle: driver.registration.trim() || null,
    status: DUTY_STATUS_VALUES[driver.dutyStatus] || driver.dutyStatus,
  };
}
