import { HomepageForm } from "@/components/homepage-form";
import { getSiteSettings } from "@/lib/data";

export default async function HomepageAdminPage() {
  const settings = await getSiteSettings();
  return (
    <main className="p-5 sm:p-8 lg:p-12">
      <p className="eyebrow">Website content</p>
      <h1 className="mt-2 font-serif text-5xl">Homepage</h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-600">
        Update the images and copy shown on your public homepage.
      </p>
      <div className="mt-10 max-w-4xl">
        <HomepageForm settings={settings} />
      </div>
    </main>
  );
}
