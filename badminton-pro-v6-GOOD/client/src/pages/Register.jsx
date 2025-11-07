import React, { useState } from 'react'; import api from '../api';
export default function Register(){ const [form,setForm]=useState({name:'',country:'',email:'',phone:'',hand:'R'}); const [photo,setPhoto]=useState(null); const [ok,setOk]=useState(null);
  const submit=async e=>{ e.preventDefault(); const fd=new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,v)); if(photo) fd.append('photo',photo); const {data}=await api.post('/players/register', fd); setOk(data); setForm({name:'',country:'',email:'',phone:'',hand:'R'}); setPhoto(null); };
  return (<section className="card max-w-lg"><h3 className="font-semibold mb-2">Register as Player</h3>
    <form onSubmit={submit} className="space-y-2">
      <input className="input" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
      <input className="input" placeholder="Country" value={form.country} onChange={e=>setForm({...form,country:e.target.value})}/>
      <div className="grid grid-cols-2 gap-2">
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input className="input" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
      </div>
      <select className="input" value={form.hand} onChange={e=>setForm({...form,hand:e.target.value})}><option value="R">Right</option><option value="L">Left</option></select>
      <input className="input" type="file" accept="image/*" onChange={e=>setPhoto(e.target.files[0])}/>
      <button className="btn" type="submit">Submit</button>
      {ok && <div className="text-sm text-green-300">✅ Registered: {ok.name}</div>}
    </form>
  </section>); }
