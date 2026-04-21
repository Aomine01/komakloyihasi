import {
  viloyatlar,
  tumanlar,
  projects,
  faqs,
  callbacks,
  stats,
  admins,
} from './schema';

export type Viloyat = typeof viloyatlar.$inferSelect;
export type Tuman = typeof tumanlar.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type FAQ = typeof faqs.$inferSelect;
export type Callback = typeof callbacks.$inferSelect;
export type Stat = typeof stats.$inferSelect;
export type Admin = typeof admins.$inferSelect;

// Extended types with joins
export type ViloyatWithCount = Viloyat & { projectCount?: number };
export type ProjectWithTuman = Project & { tuman?: Tuman | null };
