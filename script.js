const CORRECT = "2ปี1เดือน";
const choices = [CORRECT,"2ปี","2ปี2เดือน","1ปี1เดือน"];
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function renderOptions(){const form=document.getElementById("quiz-form");form.innerHTML="";shuffle([...choices]).forEach((t,i)=>{const id="opt-"+i;const label=document.createElement("label");label.className="option";label.setAttribute("for",id);const input=document.createElement("input");input.type="radio";input.name="answer";input.id=id;input.value=t;input.required=true;const span=document.createElement("span");span.textContent=t;label.appendChild(input);label.appendChild(span);form.appendChild(label);});}
function showVideo(){document.getElementById("quiz-card").classList.add("hidden");document.getElementById("video-card").classList.remove("hidden");}
function resetQuiz(){document.getElementById("video-card").classList.add("hidden");document.getElementById("quiz-card").classList.remove("hidden");renderOptions();}
function init(){renderOptions();document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("submit-btn").addEventListener("click",()=>{const sel=document.querySelector('input[name="answer"]:checked');const fb=document.getElementById("feedback");if(!sel){fb.textContent="กรุณาเลือกคำตอบก่อนนะ";fb.className="feedback bad";return;}if(sel.value===CORRECT){fb.textContent="ถูกต้อง! 💘";fb.className="feedback ok";showVideo();}else{fb.textContent="ยังไม่ใช่ค่าา 💗";fb.className="feedback bad";}});
document.getElementById("restart-btn").addEventListener("click",resetQuiz);}
document.addEventListener("DOMContentLoaded",init);
