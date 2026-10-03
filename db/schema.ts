import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const analyses = pgTable('analyses', {
  id: text().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  inputType: text('input_type').notNull(),
  riskLevel: text('risk_level').notNull(),
  record: jsonb().notNull(),
})
