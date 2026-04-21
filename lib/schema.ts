import {
  mysqlTable,
  varchar,
  text,
  boolean,
  int,
  decimal,
  date,
  timestamp,
  json,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const viloyatlar = mysqlTable('viloyatlar', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const tumanlar = mysqlTable('tumanlar', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  viloyatId: varchar('viloyat_id', { length: 36 })
    .notNull()
    .references(() => viloyatlar.id),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = mysqlTable('projects', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  tumanId: varchar('tuman_id', { length: 36 }).references(() => tumanlar.id),
  title: varchar('title', { length: 255 }).notNull(),
  ownerName: varchar('owner_name', { length: 255 }).notNull(),
  description: text('description'),
  loanAmount: decimal('loan_amount', { precision: 10, scale: 2 }),
  studentsCount: int('students_count'),
  languages: json('languages').$type<string[]>(),
  photoUrl: varchar('photo_url', { length: 500 }),
  isPublished: boolean('is_published').default(false),
  fundedAt: date('funded_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const faqs = mysqlTable('faqs', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  sortOrder: int('sort_order').default(0),
  isPublished: boolean('is_published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const callbacks = mysqlTable('callbacks', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  region: varchar('region', { length: 255 }),
  message: text('message'),
  status: varchar('status', { length: 20 }).default('new'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const stats = mysqlTable('stats', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: decimal('value', { precision: 10, scale: 2 }).notNull(),
  labelUz: varchar('label_uz', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 100 }),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const admins = mysqlTable('admins', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
