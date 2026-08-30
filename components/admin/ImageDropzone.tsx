"use client";
import { useRef, useState } from "react";

export function ImageDropzone({value,onChange,label="IMAGE"}:{value:string;onChange:(v:string)=>void;label?:string}){
 const input=useRef<HTMLInputElement>(null); const [drag,setDrag]=useState(false); const [busy,setBusy]=useState(false); const [error,setError]=useState("");
 async function upload(file?:File){ if(!file)return; setError(""); setBusy(true); const fd=new FormData(); fd.append("file",file); const r=await fetch("/api/admin/upload",{method:"POST",body:fd}); const d=await r.json(); setBusy(false); if(!r.ok){setError(d.error||"Upload impossible.");return} onChange(d.url); }
 return <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
   <div className="mb-3 text-[10px] font-bold tracking-[.3em] text-white/35">{label}</div>
   <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);upload(e.dataTransfer.files?.[0])}} onClick={()=>input.current?.click()} className={`group relative grid min-h-44 cursor-pointer place-items-center overflow-hidden rounded-xl border border-dashed p-5 text-center transition ${drag?"border-white/60 bg-white/10":"border-white/10 bg-white/[.02] hover:border-white/25 hover:bg-white/[.04]"}`}>
     {value&&<img src={value} alt="Aperçu" className="absolute inset-0 h-full w-full object-cover opacity-35 transition group-hover:opacity-50"/>}
     <div className="relative z-10"><div className="text-3xl">{busy?"↻":"↥"}</div><div className="mt-2 text-sm font-bold">{busy?"UPLOAD...":"Clique pour choisir"}</div><div className="mt-1 text-xs text-white/35">ou glisse-dépose ton image ici</div><div className="mt-2 text-[10px] text-white/25">PNG · JPG · WEBP · GIF · 8 Mo max</div></div>
   </div>
   <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={e=>upload(e.target.files?.[0])}/>{error&&<div className="mt-2 text-xs text-red-300">{error}</div>}
   {value&&<div className="mt-3 flex items-center gap-3"><img src={value} alt="" className="h-12 w-12 rounded-lg object-cover"/><div className="min-w-0 flex-1 truncate text-xs text-white/35">{value}</div><button type="button" onClick={()=>onChange("")} className="text-xs text-red-200">Retirer</button></div>}
 </div>
}
