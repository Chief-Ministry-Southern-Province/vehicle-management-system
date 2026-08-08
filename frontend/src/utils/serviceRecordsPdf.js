import { generateRepairRecordsPdf } from "./repairRecordsPdf";

export function generateServiceRecordsPdf(records) {
  const serviceRecords = records.map((record) => ({
    ...record,
    repair_date: record.service_date,
    repair_type: record.service_type,
  }));

  generateRepairRecordsPdf(serviceRecords, { recordKind: "Service" });
}
