import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth,onAuthStateChanged,signInWithEmailAndPassword,signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase,ref,onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getFunctions,httpsCallable } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-functions.js";
import { firebaseConfig } from "./firebase-config.js";
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getDatabase(app),functions=getFunctions(app);
const $=id=>document.getElementById(id);let stop=null;
$("loginBtn").onclick=async()=>{try{await signInWithEmailAndPassword(auth,$("email").value,$("password").value)}catch(e){$("msg").textContent=e.message}};
$("logoutBtn").onclick=()=>signOut(auth);
onAuthStateChanged(auth,async u=>{if(stop)stop();$("adminPanel").classList.add("hidden");$("logoutBtn").classList.toggle("hidden",!u);if(!u)return;
try{const token=await u.getIdTokenResult(true);if(token.claims.admin!==true)throw new Error("Akun ini belum memiliki hak admin.");$("msg").textContent="Admin terverifikasi.";$("adminPanel").classList.remove("hidden");
stop=onValue(ref(db,"pointRequests"),snap=>render(snap.val()||{}));
}catch(e){$("msg").textContent=e.message;}
});
function render(data){const list=[];for(const [uid,items] of Object.entries(data))for(const [id,r] of Object.entries(items||{}))if(r.status==="pending")list.push({uid,id,...r});
$("requests").innerHTML=list.length?list.map(r=>`<article class="p-4 bg-slate-800 rounded space-y-2"><div class="font-semibold">${r.amount} poin · User ${r.uid}</div><div class="text-xs text-slate-400">${new Date(r.createdAt).toLocaleString("id-ID")}</div><button data-uid="${r.uid}" data-id="${r.id}" class="approve bg-emerald-600 px-3 py-2 rounded">Setujui</button></article>`).join(""):"Tidak ada permintaan menunggu.";
document.querySelectorAll(".approve").forEach(b=>b.onclick=async()=>{b.disabled=true;try{const approve=httpsCallable(functions,"approvePointRequest");await approve({uid:b.dataset.uid,requestId:b.dataset.id});$("msg").textContent="Poin berhasil ditambahkan."; }catch(e){$("msg").textContent=e.message;b.disabled=false;}});}
