import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminOrders from "./orders-client";
export default async function Admin(){
 const supabase=createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/login");
 const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).single();
 if(profile?.role!=="admin")redirect("/");
 const {data:orders,error}=await supabase.from("orders").select("*").order("created_at",{ascending:false}).limit(100);
 return <main className="admin-single"><header className="admin-head"><div><a href="/">← Kembali ke website</a><h1>Dashboard SkyHost</h1><p>Login sebagai {user.email}</p></div><span className="demo">ADMIN</span></header>{error?<p>Gagal memuat pesanan: {error.message}</p>:<AdminOrders initialOrders={orders||[]}/>}</main>;
}