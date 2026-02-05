import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./db/schema";

const client = createClient({ url: "file:local.db" });
const db = drizzle(client, { schema });

async function seed() {
  console.log("Reseting and Seeding database...");

  // 1. Seed Tooling
  const tool = await db.insert(schema.tooling).values({
    toolingId: 1,
    toolingName: "Caliper-X1",
    parentTooling: "Measurement Tools",
    description: "High precision digital caliper",
    measurementMetric: { unit: "mm", accuracy: 0.01 },
  }).returning().get();

  // 2. Seed Location
  const loc = await db.insert(schema.location).values({
    locationId: 101,
    assetName: "North Sea Platform A",
    component: "Subsea Jacket",
    itemId: "NODE-44-B",
    position: "Depth 50m",
    createdAt: new Date(),
  }).returning().get();

  // 3. Seed Result
  const res = await db.insert(schema.result).values({
    resultId: 501,
    method: "Visual Inspection",
    result: "Passed",
    remarks: "Slight bio-fouling observed, but structural integrity intact.",
    ssImgOri: { url: "https://storage.local/img1.jpg" },
    toolingId: tool.toolingId,
    createdAt: new Date(),
  }).returning().get();

  // 4. Seed Equipment
  const equip = await db.insert(schema.equipment).values({
    equipmentId: 201,
    equipmentName: "ROV Falcon 5",
    rovClass: "Observation Class",
    toolingId: tool.toolingId,
    createdAt: new Date(),
  }).returning().get();

  // 5. Seed Inspection
  const insp = await db.insert(schema.inspection).values({
    inspectionId: 301,
    locationId: loc.locationId,
    resultId: res.resultId,
    equipmentId: equip.equipmentId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning().get();

  // 6. Seed Project
  await db.insert(schema.project).values({
    projectId: 1,
    projectTitle: "Annual Subsea Maintenance 2026",
    documentReferenceId: "REF-2026-001",
    description: "Routine check of all structural nodes.",
    status: 1,
    inspectionId: insp.inspectionId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log("Seeding completed successfully! ");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});