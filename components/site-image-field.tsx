"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { optimizeForCloudinary } from "@/lib/client-image";

export function SiteImageField({ label, name, initialUrl, initialPublicId, aspect }: { label: string; name: string; initialUrl: string; initialPublicId: string | null; aspect: "hero" | "portrait" }) {
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [publicId, setPublicId] = useState(initialPublicId || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true); setError("");
    try {
      const optimizedFile = await optimizeForCloudinary(file);
      const signResponse = await fetch("/api/cloudinary/site-upload", { method: "POST" });
      const signed = await signResponse.json();
      if (!signResponse.ok) throw new Error(signed.error || "Could not authorize upload.");
      const body = new FormData();
      body.append("file", optimizedFile); body.append("api_key", signed.apiKey); body.append("timestamp", String(signed.timestamp)); body.append("folder", signed.folder); body.append("signature", signed.signature);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, { method: "POST", body });
      const image = await response.json();
      if (!response.ok) throw new Error(image.error?.message || "Upload failed.");
      setUrl(image.secure_url); setPublicId(image.public_id);
    } catch (uploadError) { setError(uploadError instanceof Error ? uploadError.message : "Upload failed."); }
    finally { setUploading(false); if (input.current) input.current.value = ""; }
  };

  return <div><p className="text-xs uppercase tracking-wider">{label} *</p><input type="hidden" name={`${name}_url`} value={url} /><input type="hidden" name={`${name}_public_id`} value={publicId} /><div className={`relative mt-3 overflow-hidden bg-neutral-100 ${aspect === "hero" ? "aspect-[16/8]" : "aspect-[4/5] max-w-sm"}`}><Image src={url} alt="" fill sizes="600px" className="object-cover" /></div><input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => upload(event.target.files?.[0])} /><button type="button" className="button-light mt-3" disabled={uploading} onClick={() => input.current?.click()}><ImagePlus size={15} className="mr-2" />{uploading ? "Uploading..." : "Replace image"}</button>{error && <p className="mt-2 text-sm text-red-700">{error}</p>}</div>;
}
