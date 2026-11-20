import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request,{params}) {
 const supabase=createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const admin=createAdminClient();
 const {data:profile}=await admin.from("profiles").select("role").eq("id",user.id).single();
 if(profile?.role!=="admin")return NextResponse.json({error:"Forbidden"},{status:403});
 const {service_status}=await request.json();
 if(!["pending","active","suspended"].includes(service_status))return NextResponse.json({error:"Status tidak valid"},{status:400});
 const {error}=await admin.from("orders").update({service_status}).eq("id",params.id).eq("payment_status","paid");
 if(error)return NextResponse.json({error:error.message},{status:500});
 return NextResponse.json({ok:true});
}