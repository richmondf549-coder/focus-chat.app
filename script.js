const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");
const recordBtn = document.getElementById("record");
const focusToggle = document.getElementById("focusToggle");

let focusMode = false;
let cooldown = false;

/* ===== ENCRYPTION ===== */
const encoder = new TextEncoder();
const decoder = new TextDecoder();
let key;

(async () => {
  key = await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
          true,
              ["encrypt", "decrypt"]
                );
                })();

                async function encrypt(text) {
                  const iv = crypto.getRandomValues(new Uint8Array(12));
                    const data = await crypto.subtle.encrypt(
                        { name: "AES-GCM", iv },
                            key,
                                encoder.encode(text)
                                  );
                                    return { iv: [...iv], data: [...new Uint8Array(data)] };
                                    }

                                    async function decrypt(payload) {
                                      const iv = new Uint8Array(payload.iv);
                                        const data = new Uint8Array(payload.data);
                                          const decrypted = await crypto.subtle.decrypt(
                                              { name: "AES-GCM", iv },
                                                  key,
                                                      data
                                                        );
                                                          return decoder.decode(decrypted);
                                                          }

                                                          /* ===== CHAT ===== */
                                                          async function addMessage(text, type) {
                                                            const encrypted = await encrypt(text);
                                                              const decrypted = await decrypt(encrypted);

                                                                const msg = document.createElement("div");
                                                                  msg.className = `msg ${type}`;
                                                                    msg.textContent = decrypted;
                                                                      chat.appendChild(msg);
                                                                        chat.scrollTop = chat.scrollHeight;
                                                                        }

                                                                        send.onclick = async () => {
                                                                          if (!input.value || cooldown) return;

                                                                            if (focusMode) {
                                                                                cooldown = true;
                                                                                    setTimeout(() => cooldown = false, 3000);
                                                                                      }

                                                                                        await addMessage(input.value, "sent");
                                                                                          input.value = "";
                                                                                          };

                                                                                          /* ===== FOCUS MODE ===== */
                                                                                          focusToggle.onclick = () => {
                                                                                            focusMode = !focusMode;
                                                                                              focusToggle.textContent = focusMode ? "🧘 ON" : "🧘";
                                                                                              };

                                                                                              /* ===== VOICE NOTES ===== */
                                                                                              let recorder, chunks = [];

                                                                                              recordBtn.onclick = async () => {
                                                                                                if (!recorder) {
                                                                                                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                                                                                                        recorder = new MediaRecorder(stream);

                                                                                                            recorder.ondataavailable = e => chunks.push(e.data);

                                                                                                                recorder.onstop = () => {
                                                                                                                      const blob = new Blob(chunks, { type: "audio/webm" });
                                                                                                                            chunks = [];

                                                                                                                                  const audio = document.createElement("audio");
                                                                                                                                        audio.controls = true;
                                                                                                                                              audio.src = URL.createObjectURL(blob);

                                                                                                                                                    const msg = document.createElement("div");
                                                                                                                                                          msg.className = "msg sent";
                                                                                                                                                                msg.appendChild(audio);

                                                                                                                                                                      chat.appendChild(msg);
                                                                                                                                                                            chat.scrollTop = chat.scrollHeight;
                                                                                                                                                                                };

                                                                                                                                                                                    recorder.start();
                                                                                                                                                                                        recordBtn.textContent = "⏹️";
                                                                                                                                                                                          } else {
                                                                                                                                                                                              recorder.stop();
                                                                                                                                                                                                  recorder = null;
                                                                                                                                                                                                      recordBtn.textContent = "🎙️";
                                                                                                                                                                                                        }
                                                                                                                                                                                                        };const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");
const recordBtn = document.getElementById("record");
const focusToggle = document.getElementById("focusToggle");

let focusMode = false;
let cooldown = false;

/* ===== ENCRYPTION ===== */
const encoder = new TextEncoder();
const decoder = new TextDecoder();
let key;

(async () => {
  key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
})();

async function encrypt(text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(text)
  );
  return { iv: [...iv], data: [...new Uint8Array(data)] };
}

async function decrypt(payload) {
  const iv = new Uint8Array(payload.iv);
  const data = new Uint8Array(payload.data);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  return decoder.decode(decrypted);
}

/* ===== CHAT ===== */
async function addMessage(text, type) {
  const encrypted = await encrypt(text);
  const decrypted = await decrypt(encrypted);

  const msg = document.createElement("div");
  msg.className = `msg ${type}`;
  msg.textContent = decrypted;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

send.onclick = async () => {
  if (!input.value || cooldown) return;

  if (focusMode) {
    cooldown = true;
    setTimeout(() => cooldown = false, 3000);
  }

  await addMessage(input.value, "sent");
  input.value = "";
};

/* ===== FOCUS MODE ===== */
focusToggle.onclick = () => {
  focusMode = !focusMode;
  focusToggle.textContent = focusMode ? "🧘 ON" : "🧘";
};

/* ===== VOICE NOTES ===== */
let recorder, chunks = [];

recordBtn.onclick = async () => {
  if (!recorder) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e => chunks.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      chunks = [];

      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = URL.createObjectURL(blob);

      const msg = document.createElement("div");
      msg.className = "msg sent";
      msg.appendChild(audio);

      chat.appendChild(msg)