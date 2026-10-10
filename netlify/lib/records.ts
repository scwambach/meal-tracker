import { getStore } from "@netlify/blobs";

/** Fields every dated record (meal, workout) has. */
export type Dated = { id: string; date: string; time?: string; created_at: string; updated_at: string };

/**
 * A Blobs store of records keyed "<date>/<id>", so a date range can be filtered from the
 * key list alone. `finish` recomputes derived fields (e.g. totals) on create and update.
 */
export function collection<In extends { date: string; time?: string }, Out extends In & Dated>(
  name: string,
  finish: (record: In & Dated) => Out,
) {
  const store = () => getStore({ name, consistency: "strong" });
  const keyFor = (r: Pick<Dated, "date" | "id">) => `${r.date}/${r.id}`;

  async function findKey(id: string): Promise<string | undefined> {
    const { blobs } = await store().list();
    return blobs.find((b) => b.key.endsWith(`/${id}`))?.key;
  }

  return {
    async list(from?: string, to?: string): Promise<Out[]> {
      const s = store();
      const { blobs } = await s.list();
      const keys = blobs
        .map((b) => b.key)
        .filter((k) => {
          const date = k.slice(0, 10);
          return (!from || date >= from) && (!to || date <= to);
        });
      const records: (Out | null)[] = await Promise.all(keys.map((k) => s.get(k, { type: "json" })));
      return records
        .filter((r): r is Out => r !== null)
        .sort((a, b) =>
          a.date === b.date ? (b.time ?? "").localeCompare(a.time ?? "") : b.date.localeCompare(a.date),
        );
    },

    async get(id: string): Promise<Out | null> {
      const key = await findKey(id);
      return key ? ((await store().get(key, { type: "json" })) as Out | null) : null;
    },

    async create(input: In): Promise<Out> {
      const now = new Date().toISOString();
      const record = finish({ ...input, id: crypto.randomUUID().slice(0, 8), created_at: now, updated_at: now });
      await store().setJSON(keyFor(record), record);
      return record;
    },

    async update(id: string, patch: Partial<In>): Promise<Out | null> {
      const s = store();
      const key = await findKey(id);
      if (!key) return null;
      const existing = (await s.get(key, { type: "json" })) as Out | null;
      if (!existing) return null;
      const record = finish({ ...existing, ...patch, id, updated_at: new Date().toISOString() });
      const newKey = keyFor(record);
      await s.setJSON(newKey, record);
      if (newKey !== key) await s.delete(key);
      return record;
    },

    async remove(id: string): Promise<boolean> {
      const key = await findKey(id);
      if (!key) return false;
      await store().delete(key);
      return true;
    },
  };
}
