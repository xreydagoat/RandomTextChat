const onlineCount = document.getElementById('onlineCount');
const countdown = document.getElementById('countdown');
const partnerName = document.getElementById('partnerName');
const connectionStatus = document.getElementById('connectionStatus');
const chatWindow = document.getElementById('chatWindow');
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const newMatchBtn = document.getElementById('newMatchBtn');
const connectingOverlay = document.getElementById('connectingOverlay');

const names = [
  'Nova', 'Luna', 'Echo', 'Kai', 'Aria', 'Rey', 'Mira', 'Zane', 'Veda', 'Juno', 'Atlas', 'Sage', 'Indie', 'Pixel'
];

const replies = [
  'That sounds awesome. Tell me more.',
  'Haha yes, I totally get that.',
  'Wow, really? I love hearing that.',
  'What made you decide that?',
  'I haven’t thought about it like that before.',
  'That is wild. How long have you been into it?',
  'I’m curious—what’s your favorite part?',
  'You seem like someone who loves adventure.',
  'Sometimes small moments are the best.',
  'The last chat I had said something similar.'
];

let timerSeconds = 120;
let countdownInterval = null;
let partnerTimer = null;
let partnerNameValue = '';
let isConnected = false;

function setOnlineCount() {
  onlineCount.textContent = Math.floor(Math.random() * 320) + 120;
}

function formatTime(seconds) {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainder = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function appendMessage(text, role) {
  const message = document.createElement('div');
  message.className = `message ${role}`;
  message.innerHTML = `${text}<small>${role === 'user' ? 'You' : partnerNameValue}</small>`;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showConnecting(show) {
  connectingOverlay.style.display = show ? 'flex' : 'none';
}

function findPartner() {
  isConnected = false;
  chatWindow.innerHTML = '';
  showConnecting(true);
  partnerName.textContent = 'finding someone...';
  connectionStatus.textContent = 'Searching for a stranger...';
  messageInput.disabled = true;
  messageInput.value = '';

  setTimeout(() => {
    partnerNameValue = names[Math.floor(Math.random() * names.length)];
    partnerName.textContent = partnerNameValue;
    connectionStatus.textContent = 'You are now connected. Say hi!';
    isConnected = true;
    showConnecting(false);
    startTimer();
    appendMessage('Hey! Nice to meet you. What are you up to today?', 'partner');
  }, 1200);
}

function startTimer() {
  clearInterval(countdownInterval);
  timerSeconds = 120;
  countdown.textContent = formatTime(timerSeconds);
  countdownInterval = setInterval(() => {
    timerSeconds -= 1;
    countdown.textContent = formatTime(timerSeconds);
    if (timerSeconds <= 0) {
      clearInterval(countdownInterval);
      endSession();
    }
  }, 1000);
}

function endSession() {
  isConnected = false;
  connectionStatus.textContent = 'Time is up. Connecting to a new person...';
  appendMessage('This chat has ended. Preparing a new connection.', 'partner');
  setTimeout(findPartner, 1800);
}

function scheduleAutoReply() {
  clearTimeout(partnerTimer);
  partnerTimer = setTimeout(() => {
    if (!isConnected) return;
    const reply = replies[Math.floor(Math.random() * replies.length)];
    appendMessage(reply, 'partner');
  }, Math.floor(Math.random() * 2200) + 900);
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text || !isConnected) return;
  appendMessage(text, 'user');
  messageInput.value = '';
  scheduleAutoReply();
});

newMatchBtn.addEventListener('click', () => {
  clearInterval(countdownInterval);
  clearTimeout(partnerTimer);
  findPartner();
});

messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    chatForm.dispatchEvent(new Event('submit'));
  }
});

setOnlineCount();
setInterval(setOnlineCount, 6000);
findPartner();
