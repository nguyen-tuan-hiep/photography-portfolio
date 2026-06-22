import Link from "next/link";
export default function NotFound(){return <main className="grid min-h-screen place-items-center bg-ink p-5 text-center text-white"><div><p className="eyebrow !text-white/50">404</p><h1 className="mt-4 font-serif text-7xl">This story isn’t here.</h1><Link href="/albums" className="button-light mt-8 !border-white">Browse albums</Link></div></main>}
