const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const messagesDiv = document.getElementById("messages");
const sessionId = crypto.randomUUID();
const loadingDiv = document.getElementById("loading");

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = `message ${className}`;
  div.textContent = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  addMessage(`You: ${message}`, "user");
  input.value = "";
  input.disabled = true;
  loadingDiv.classList.remove("hidden");

  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        sessionId
      })
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

    const data = await response.json();
    addMessage(`AI: ${data.reply}`, "ai");
  } catch (err) {
    addMessage("AI: Sorry, something went wrong.", "ai");
  } finally {
    loadingDiv.classList.add("hidden");
    input.disabled = false;
    input.focus();
  }
});
