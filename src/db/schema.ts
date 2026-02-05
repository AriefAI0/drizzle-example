import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// -------- Tooling Table --------
export const tooling = sqliteTable("tooling", {
  toolingId: integer("tooling_id").primaryKey(),
  toolingName: text("tooling_name").notNull(),
  parentTooling: text("parent_tooling"),
  description: text("description"),
  measurementMetric: text("measurement_metric", { mode: "json" }).notNull(),
});

// -------- Location Table --------
export const location = sqliteTable("location", {
  locationId: integer("location_id").primaryKey(),
  assetName: text("asset_name").notNull(),
  component: text("component").notNull(),
  itemId: text("item_id").notNull(),
  position: text("position"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// -------- Result Table --------
export const result = sqliteTable("result", {
  resultId: integer("result_id").primaryKey(),
  method: text("method").notNull(),
  result: text("result").notNull(),
  remarks: text("remarks"),
  ssImgOri: text("ss_img_ori", { mode: "json" }),
  ssImgWComment: text("ss_img_w_comment", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  toolingId: integer("tooling_id").references(() => tooling.toolingId),
});

// -------- Equipment Table --------
export const equipment = sqliteTable("equipment", {
  equipmentId: integer("equipment_id").primaryKey(),
  equipmentName: text("equipment_name").notNull(),
  rovClass: text("rov_class"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  toolingId: integer("tooling_id").references(() => tooling.toolingId),
});

// -------- Inspection Table --------
export const inspection = sqliteTable("inspection", {
  inspectionId: integer("inspection_id").primaryKey(),
  locationId: integer("location_id").notNull().references(() => location.locationId),
  resultId: integer("result_id").notNull().references(() => result.resultId),
  equipmentId: integer("equipment_id").notNull().references(() => equipment.equipmentId),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// -------- Project Table --------
export const project = sqliteTable("project", {
  projectId: integer("project_id").primaryKey(),
  projectTitle: text("project_title").notNull(),
  documentReferenceId: text("document_reference_id"),
  description: text("description"),
  status: integer("status"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  inspectionId: integer("inspection_id").references(() => inspection.inspectionId),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// -------- RELATIONS DEFINITIONS --------

export const projectRelations = relations(project, ({ one }) => ({
  inspection: one(inspection, {
    fields: [project.inspectionId],
    references: [inspection.inspectionId],
  }),
}));

export const inspectionRelations = relations(inspection, ({ one, many }) => ({
  location: one(location, {
    fields: [inspection.locationId],
    references: [location.locationId],
  }),
  result: one(result, {
    fields: [inspection.resultId],
    references: [result.resultId],
  }),
  equipment: one(equipment, {
    fields: [inspection.equipmentId],
    references: [equipment.equipmentId],
  }),
  projects: many(project),
}));

export const resultRelations = relations(result, ({ one }) => ({
  tooling: one(tooling, {
    fields: [result.toolingId],
    references: [tooling.toolingId],
  }),
}));