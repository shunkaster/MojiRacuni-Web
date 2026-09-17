import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
const firebaseConfig={apiKey:"AIzaSyDBy-z2gd1Mjpo7rkrJbh9OCZYnxR1dOkE",authDomain:"mojiracuni-63102.firebaseapp.com",projectId:"mojiracuni-63102",storageBucket:"mojiracuni-63102.firebasestorage.app",messagingSenderId:"832148284706",appId:"1:832148284706:web:b66b1d153c55a414f5717b"};
const app=initializeApp(firebaseConfig),db=getFirestore(app),cloudRef=doc(db,"mojiRacuni","shared");let applying=false,ready=false;
function status(t,e=false){let x=document.getElementById("cloudStatus");if(x){x.textContent=t;x.classList.toggle("cloudError",e)}}
function local(){try{return JSON.parse(localStorage.getItem("mojiRacuni.v1")||"[]")}catch{return[]}}
function apply(b){applying=true;localStorage.setItem("mojiRacuni.v1",JSON.stringify(b));window.dispatchEvent(new CustomEvent("cloud-data",{detail:b}));applying=false}
async function start(){try{let s=await getDoc(cloudRef);if(!s.exists())await setDoc(cloudRef,{bills:local(),schema:1,updatedAt:serverTimestamp()});else if(Array.isArray(s.data().bills))apply(s.data().bills);ready=true;status("☁ Cloud povezan");onSnapshot(cloudRef,s=>{if(!s.exists()||applying)return;let d=s.data();if(Array.isArray(d.bills))apply(d.bills);status("☁ Sinhronizovano")},e=>{console.error(e);status("☁ Cloud greška",true)})}catch(e){console.error(e);status("☁ Offline / greška",true)}}
window.MojiCloud={save:async b=>{if(!ready||applying)return;try{await setDoc(cloudRef,{bills:b,schema:1,updatedAt:serverTimestamp()});status("☁ Sinhronizovano")}catch(e){console.error(e);status("☁ Nije sinhronizovano",true)}}};start();
