"use client";
import {useState} from "react";
import {createBrowserClient} from "@supabase/ssr";
export default function Login(){
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [msg,setMsg]=useState("");
 async function submit(e){e.preventDefault();const s=createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);const {error}=await s.auth.signInWithPassword({email,password});if(error){setMsg(error.message);return;}location.href="/admin";}
 return <main className="auth-wrap"><form className="auth-card" onSubmit={submit}><a className="brand" href="/">◈ SKY<span>HOST</span></a><h1>Masuk</h1><p>Masuk ke akun SkyHost kamu.</p><label>Email</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/><label>Password</label><input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/><button className="primary auth-submit">Masuk</button>{msg&&<p className="error">{msg}</p>}<a href="/daftar">Belum punya akun? Daftar</a></form></main>;
}