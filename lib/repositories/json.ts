import { promises as fs } from "fs";
import path from "path";

function resolve(file:string){return path.join(process.cwd(),"data",file)}

export async function readJson<T>(file:string,fallback:T):Promise<T>{
 const full=resolve(file);
 try{return JSON.parse(await fs.readFile(full,"utf8")) as T}
 catch{await fs.mkdir(path.dirname(full),{recursive:true});await fs.writeFile(full,JSON.stringify(fallback,null,2),"utf8");return fallback}
}

export async function writeJson<T>(file:string,data:T):Promise<void>{
 const full=resolve(file);await fs.mkdir(path.dirname(full),{recursive:true});
 const temp=`${full}.tmp`;
 await fs.writeFile(temp,JSON.stringify(data,null,2),"utf8");
 await fs.rename(temp,full);
}
