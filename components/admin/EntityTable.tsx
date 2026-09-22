import Link from "next/link";
import { RowActions } from "./RowActions";

export type Column = {
  key: string;
  label: string;
  kind?: "text" | "image" | "status" | "date";
};

export function EntityTable({
  columns,
  rows,
  base,
  api,
  withStatus = true,
}: {
  columns: Column[];
  rows: Record<string, unknown>[];
  base: string;
  api: string;
  withStatus?: boolean;
}) {
  const safe = JSON.parse(JSON.stringify(rows)) as Record<string, unknown>[];
  return (
    <div className="tableWrap">
      <table className="adminTable">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.label}>{c.label}</th>
            ))}
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {safe.map((row) => (
            <tr key={String(row.id)}>
              {columns.map((c) => (
                <td key={c.label}>
                  <Cell kind={c.kind ?? "text"} value={row[c.key]} />
                </td>
              ))}
              <td>
                <RowActions
                  base={base}
                  api={api}
                  id={String(row.id)}
                  status={withStatus ? String(row.status ?? "") : undefined}
                />
              </td>
            </tr>
          ))}
          {safe.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1}>لا توجد عناصر بعد.</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ kind, value }: { kind: NonNullable<Column["kind"]>; value: unknown }) {
  if (kind === "image" && typeof value === "string" && value) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={value} alt="" width={64} height={44} />
    );
  }
  if (kind === "status" && typeof value === "string") {
    const label = value === "published" ? "منشور" : value === "hidden" ? "مخفي" : value === "draft" ? "مسودة" : value === "new" ? "جديد" : value;
    return <span className={`badge st-${value}`}>{label}</span>;
  }
  if (kind === "date" && (typeof value === "string" || value instanceof Date)) {
    const d = new Date(value);
    return <span dir="ltr">{Number.isNaN(d.getTime()) ? "" : d.toLocaleString("en-GB")}</span>;
  }
  if (value === null || value === undefined) return <span>—</span>;
  const s = String(value);
  return <span>{s.length > 60 ? `${s.slice(0, 60)}…` : s}</span>;
}

export function PageHead({
  title,
  back,
  action,
}: {
  title: string;
  back?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="pageHead">
      <h1>{title}</h1>
      <span>
        {action}
        {back ? (
          <Link className="btnLink" href={back}>
            رجوع
          </Link>
        ) : null}
      </span>
    </div>
  );
}
