import Link from "next/link";
import { getAdminData } from "@/lib/data";
import { RecentInquiries } from "@/components/recent-inquiries";
export default async function Dashboard() {
  const { albums, inquiries } = await getAdminData();
  const counts = {
    Total: albums.length,
    Public: albums.filter((a) => a.visibility === "public").length,
    Unlisted: albums.filter((a) => a.visibility === "unlisted").length,
    Drafts: albums.filter((a) => a.visibility === "draft").length,
  };
  return (
    <main className="p-5 sm:p-8 lg:p-12">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="mt-2 font-serif text-5xl">Dashboard</h1>
        </div>
        <Link href="/admin/albums/new" className="button-dark">
          New album
        </Link>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(counts).map(([label, count]) => (
          <div key={label} className="border border-neutral-200 bg-white p-6">
            <p className="text-xs uppercase tracking-wider text-neutral-500">
              {label}
            </p>
            <p className="mt-3 font-serif text-5xl">{count}</p>
          </div>
        ))}
      </div>
      <section className="mt-10">
        <RecentInquiries initialInquiries={inquiries} />
      </section>
    </main>
  );
}
