const nf = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 });

/** 122833 -> "122,833 ₪" */
export const nis = (n: number) => `${nf.format(n)} ₪`;
/** 0.1283 -> "12.83%" */
export const pct = (r: number) => `${Number((r * 100).toFixed(2))}%`;
/** "2026-09-24" -> "24.9.2026" */
export const date = (iso: string) => new Date(iso).toLocaleDateString('he-IL');
