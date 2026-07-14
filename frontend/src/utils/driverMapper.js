const STATUS_LABELS = {
  available: "Available",
  on_trip: "On Trip",
  unavailable: "Unavailable",
};

const STATUS_VALUES = {
  Available: "available",
  "On Trip": "on_trip",
  Unavailable: "unavailable",
};

export function normalizeDriver(driver) {
  return {
    databaseId: driver.id,
    id: driver.driver_id,
    fullName: driver.full_name,
    dateOfBirth: driver.date_of_birth,
    nic: driver.nic,
    address: driver.address,
    contactNumber: driver.contact_number,
    bloodGroup: driver.blood_group || "",
    licenceNumber: driver.licence_number,
    licenceType: driver.licence_type,
    licenceRenewalDate: driver.licence_renewal_date,
    vehicle: driver.allocated_vehicle || "Not allocated",
    registration: driver.allocated_vehicle || "",
    status: STATUS_LABELS[driver.status] || driver.status || "Unavailable",
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
    status: STATUS_VALUES[driver.status] || driver.status,
  };
}
