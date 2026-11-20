import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request) {
 let response=NextResponse.next({request});
 const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{cookies:{
  get(name){return request.cookies.get(name)?.value;},
  set(name,value,options){request.cookies.set({name,value,...options});response=NextResponse.next({request});response.cookies.set({name,value,...options});},
  remove(name,options){request.cookies.set({name,value:"",...options});response=NextResponse.next({request});response.cookies.set({name,value:"",...options});}
 }});
 const {data:{user}}=await supabase.auth.getUser();
 if(!user){const url=request.nextUrl.clone();url.pathname="/login";return NextResponse.redirect(url);}
 const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
 if(profile?.role!=="admin"){const url=request.nextUrl.clone();url.pathname="/";url.searchParams.set("notice","admin-only");return NextResponse.redirect(url);}
 return response;
}
export const config={matcher:["/admin/:path*"]};