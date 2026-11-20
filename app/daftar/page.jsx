"use client";
import {useState} from "react";
import {createBrowserClient} from "@supabase/ssr";
export default function Daftar(){
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [msg,setMsg]=useState("");
 async function submit(e){e.preventDefault();const s=createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);const {error}=await s.auth.signUp({email,password});setMsg(error?error.message:"Akun dibuat. Periksa email untuk konfirmasi, lalu masuk.");}
 return <main className="auth-wrap"><form className="auth-card" onSubmit={submit}><a className="brand" href="/">◈ SKY<span>HOST</span></a><h1>Buat akun</h1><label>Email</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/><label>Password (minimal 6 karakter)</label><input type="password" minLength="6" required value={password} onChange={e=>setPassword(e.target.value)}/><button className="primary auth-submit">Daftar</button>{msg&&<p>{msg}</p>}<a href="/login">Sudah punya akun? Masuk</a></form></main>;
}