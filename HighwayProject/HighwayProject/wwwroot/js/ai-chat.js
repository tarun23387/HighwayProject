// ==========================
// AI EMERGENCY CHATBOT
// ==========================

let chatOpen = false;
let chatAccidentLat = null;
let chatAccidentLng = null;

// Suggested quick questions
const quickQuestions = [
    "Nearest hospital kaun sa hai?",
    "Ambulance kab aayegi?",
    "Trauma center pe jaana chahiye ya CHC?",
    "Accident serious lag raha hai, kya karoon?",
    "Kya aas paas koi functional hospital hai?"
];

// ---- Open/Close chat panel ----
function toggleChat() {
    chatOpen = !chatOpen;
    const panel = document.getElementById('chatPanel');
    const btn   = document.getElementById('chatBtn');

    if (chatOpen) {
        panel.classList.add('visible');
        btn.classList.add('active');
        document.getElementById('chatInput').focus();

        // Agar accident location already set hai to use karo
        if (accidentMarker) {
            const ll = accidentMarker.getLatLng();
            chatAccidentLat = ll.lat;
            chatAccidentLng = ll.lng;
            addSystemMessage("📍 Accident location detect ho gayi. Seedha poochh sakte ho!");
        } else {
            addSystemMessage("Namaste! Main UP Highway Emergency Assistant hoon. Accident location select karo ya seedha poochho — main Hindi mein jawab dunga. 🚑");
        }
    } else {
        panel.classList.remove('visible');
        btn.classList.remove('active');
    }
}

// ---- Sync accident location when set ----
function syncChatLocation(lat, lng) {
    chatAccidentLat = lat;
    chatAccidentLng = lng;
    if (chatOpen) {
        addSystemMessage("📍 Location update ho gayi: " + lat.toFixed(4) + ", " + lng.toFixed(4));
    }
}

// ---- Collect nearest facility data (reuse accident-mode logic) ----
function getNearestFacilitiesForChat() {
    if (chatAccidentLat == null) return [];

    const facilities = getAllFacilities(); // accident-mode.js se
    facilities.forEach(function (f) {
        f.distKm = haversineDistance(chatAccidentLat, chatAccidentLng, f.lat, f.lng);
    });
    facilities.sort(function (a, b) { return a.distKm - b.distKm; });
    return facilities.slice(0, 5);
}

// ---- Add messages to chat ----
function addUserMessage(text) {
    const list = document.getElementById('chatMessages');
    const div  = document.createElement('div');
    div.className = 'chat-msg user-msg';
    div.textContent = text;
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
}

function addBotMessage(text) {
    const list = document.getElementById('chatMessages');
    const div  = document.createElement('div');
    div.className = 'chat-msg bot-msg';
    div.innerHTML  = text.replace(/\n/g, '<br>');
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
}

function addSystemMessage(text) {
    const list = document.getElementById('chatMessages');

    // Pehle system message already exist karta hai to dobara mat add karo
    const existing = list.querySelectorAll('.system-msg');
    if (existing.length > 0 && existing[existing.length - 1].textContent === text) return;

    const div = document.createElement('div');
    div.className = 'chat-msg system-msg';
    div.textContent = text;
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
}

function addTypingIndicator() {
    const list = document.getElementById('chatMessages');
    const div  = document.createElement('div');
    div.className = 'chat-msg bot-msg typing-indicator';
    div.id = 'typingIndicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
}

function removeTypingIndicator() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

// ---- Send message ----
async function sendChatMessage() {
    const input    = document.getElementById('chatInput');
    const sendBtn  = document.getElementById('chatSendBtn');
    const question = input.value.trim();

    if (!question) return;

    input.value = '';
    sendBtn.disabled = true;
    addUserMessage(question);

    // Location check
    if (chatAccidentLat == null) {
        addSystemMessage("⚠️ Pehle map pe accident location click karo (Accident Mode button), phir poochho.");
        sendBtn.disabled = false;
        return;
    }

    // Nearby hospitals collect karo
    const facilities = getNearestFacilitiesForChat();

    addTypingIndicator();

    try {
        const response = await fetch('/api/chat/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                lat: chatAccidentLat,
                lng: chatAccidentLng,
                facilities: facilities.map(function (f) {
                    return {
                        name:     f.name,
                        type:     f.type,
                        phone:    f.phone,
                        status:   f.status,
                        district: f.district,
                        distKm:   f.distKm
                    };
                })
            })
        });

        removeTypingIndicator();

        if (!response.ok) {
            addBotMessage("⚠️ Server se response nahi mila. Dobara try karo.");
            sendBtn.disabled = false;
            return;
        }

        const data = await response.json();
        addBotMessage(data.reply || "Koi jawab nahi mila.");

    } catch (err) {
        removeTypingIndicator();
        addBotMessage("⚠️ Network error. Internet connection check karo.");
        console.error(err);
    }

    sendBtn.disabled = false;
    input.focus();
}

// ---- Quick question chips ----
function askQuick(question) {
    document.getElementById('chatInput').value = question;
    sendChatMessage();
}

// ---- Enter key support ----
document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('chatInput');
    if (input) {
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }

    // Quick question chips render karo
    const chipsContainer = document.getElementById('quickChips');
    if (chipsContainer) {
        quickQuestions.forEach(function (q) {
            const btn = document.createElement('button');
            btn.className = 'quick-chip';
            btn.textContent = q;
            btn.onclick = function () { askQuick(q); };
            chipsContainer.appendChild(btn);
        });
    }
});
