const STORAGE_KEY = "vms-fleet-vehicles";

const INITIAL_VEHICLES = [
  { reg: "GV-8821", name: "Toyota Land Cruiser", year: "2022", type: "SUV", status: "Available", lastServiceDate: "2025-11-15", fuelLevel: 85, serviceCategory: "Public Works", licenceCancellationDate: "", repairType: "Routine service", repairDate: "2025-11-15", repairStation: "Colombo Central Workshop", maintenanceCost: 28500, image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200" },
  { reg: "GV-4402", name: "Honda Accord", year: "2021", type: "Sedan", status: "Unavailable", lastServiceDate: "2026-01-10", fuelLevel: 45, serviceCategory: "Secretary Works", licenceCancellationDate: "", repairType: "Brake inspection", repairDate: "2026-01-10", repairStation: "Rajagiriya Service Centre", maintenanceCost: 18750, image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200" },
  { reg: "GV-1193", name: "Mitsubishi Pajero", year: "2020", type: "SUV", status: "Maintenance", lastServiceDate: "2026-03-01", fuelLevel: 10, serviceCategory: "Public Works", licenceCancellationDate: "", repairType: "Engine repair", repairDate: "2026-03-01", repairStation: "Government Mechanical Workshop", maintenanceCost: 125000, image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200" },
  { reg: "GV-7754", name: "Toyota Camry", year: "2023", type: "Sedan", status: "Available", lastServiceDate: "2026-02-20", fuelLevel: 92, serviceCategory: "Secretary Works", licenceCancellationDate: "", repairType: "Oil and filter change", repairDate: "2026-02-20", repairStation: "Colombo Central Workshop", maintenanceCost: 22000, image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1200" },
];

export function getFleetVehicles() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_VEHICLES;
  } catch {
    return INITIAL_VEHICLES;
  }
}

export function getFleetVehicle(registration) {
  return getFleetVehicles().find((vehicle) => vehicle.reg === registration);
}

export function saveFleetVehicle(updatedVehicle) {
  const vehicles = getFleetVehicles();
  const found = vehicles.some((vehicle) => vehicle.reg === updatedVehicle.reg);
  const nextVehicles = found ? vehicles.map((vehicle) => vehicle.reg === updatedVehicle.reg ? updatedVehicle : vehicle) : [...vehicles, updatedVehicle];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextVehicles));
  return nextVehicles;
}

export function deleteFleetVehicle(registration) {
  const nextVehicles = getFleetVehicles().filter((vehicle) => vehicle.reg !== registration);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextVehicles));
  return nextVehicles;
}
