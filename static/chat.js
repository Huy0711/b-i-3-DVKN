// chat.js
const messagesEl = document.getElementById("messages");
const input = document.getElementById("input");
const composer = document.getElementById("composer");
const resetBtn = document.getElementById("resetBtn");

function addMessage(text, who){
  const d = document.createElement("div");
  d.className = "msg " + (who === "user" ? "user" : "bot");
  // allow basic line breaks
  d.innerHTML = text.replace(/\n/g, "<br>");
  messagesEl.appendChild(d);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addTyping(){
  const d = document.createElement("div");
  d.className = "msg bot typing";
  d.innerHTML = "<em>Đang nhập...</em>";
  messagesEl.appendChild(d);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return d;
}

async function sendMessage(text){
  addMessage(text, "user");
  const typingEl = addTyping();

  try{
    const res = await fetch("/chat", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({message: text})
    });
    const data = await res.json();
    typingEl.remove();
    if(data.reply){
      addMessage(data.reply, "bot");
    } else {
      addMessage("[Lỗi] " + (data.error || "Không có phản hồi"), "bot");
    }
  } catch(err){
    typingEl.remove();
    addMessage("[Lỗi mạng] " + err.message, "bot");
  }
}

composer.addEventListener("submit", (e) => {
  e.preventDefault();
  const t = input.value.trim();
  if(!t) return;
  input.value = "";
  sendMessage(t);
});

input.addEventListener("keydown", (e) => {
  if(e.key === "Enter" && !e.shiftKey){
    e.preventDefault();
    composer.requestSubmit();
  }
});

resetBtn.addEventListener("click", async () => {
  await fetch("/reset", {method:"POST"});
  messagesEl.innerHTML = "";
  addMessage("Đã reset lịch sử hội thoại.", "bot");
});
