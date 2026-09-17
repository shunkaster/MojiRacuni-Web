import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig={apiKey:"AIzaSyDBy-z2gd1Mjpo7rkrJbh9OCZYnxR1dOkE",authDomain:"mojiracuni-63102.firebaseapp.com",projectId:"mojiracuni-63102",storageBucket:"mojiracuni-63102.firebasestorage.app",messagingSenderId:"832148284706",appId:"1:832148284706:web:b66b1d153c55a414f5717b"};
const OWNER_EMAIL="shunkaster@gmail.com";
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),ref=doc(db,"mojiRacuni","shared");
let applying=false,ready=false,unsubscribe=null;

function status(t,e=false){let x=document.getElementById("cloudStatus");if(x){x.textContent=t;x.classList.toggle("cloudError",e)}}
function gate(show,msg=""){let g=document.getElementById("loginGate"),m=document.getElementById("loginMsg");if(g)g.classList.toggle("hidden",!show);if(m)m.textContent=msg}
function apply(b){applying=true;localStorage.setItem("mojiRacuni.v1",JSON.stringify(b));window.dispatchEvent(new CustomEvent("cloud-data",{detail:b}));applying=false}
async function connect(user){
  if((user.email||"").toLowerCase()!==OWNER_EMAIL){ready=false;gate(true,"Ovaj Google nalog nema pristup aplikaciji.");status("☁ Nema pristupa",true);return}
  gate(false); status("☁ Povezivanje…");
  try{
    let s=await getDoc(ref);
    if(s.exists()&&Array.isArray(s.data().bills))apply(s.data().bills);
    else await setDoc(ref,{bills:JSON.parse(localStorage.getItem("mojiRacuni.v1")||"[]"),schema:1,updatedAt:serverTimestamp()});
    ready=true;status("☁ Cloud povezan");
    if(unsubscribe)unsubscribe();
    unsubscribe=onSnapshot(ref,s=>{if(!s.exists()||applying)return;let d=s.data();if(Array.isArray(d.bills))apply(d.bills);status("☁ Sinhronizovano")},e=>{console.error(e);status("☁ Cloud greška",true)});
  }catch(e){console.error(e);status("☁ Cloud greška",true);gate(true,"Prijava je uspela, ali Firestore pravila još ne dozvoljavaju pristup.")}
}
await setPersistence(auth,browserLocalPersistence);
document.getElementById("googleLoginBtn").addEventListener("click",async()=>{try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){console.error(e);gate(true,"Prijava nije uspela. Pokušaj ponovo.")}});
onAuthStateChanged(auth,u=>u?connect(u):gate(true));
window.MojiCloud={save:async b=>{if(!ready||applying||!auth.currentUser)return;try{await setDoc(ref,{bills:b,schema:1,updatedAt:serverTimestamp()});status("☁ Sinhronizovano")}catch(e){console.error(e);status("☁ Nije sinhronizovano",true)}}};
