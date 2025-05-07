const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// 대화 히스토리를 저장하는 배열
const messages = [];

// GPT 응답 요청 함수
async function fetchGPTResponse() {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

// 줄바꿈 처리를 위한 포맷 함수
function formatGPTReply(text) {
  // 두 줄 이상의 빈 줄이나 문단 구분을 <br><br>로 치환
  return text
    .trim()
    .replace(/\n{2,}/g, '<br><br>')   // 두 줄 이상 연속된 줄바꿈 → 문단 구분
    .replace(/\n/g, '<br>');          // 단일 줄바꿈은 일반 줄바꿈
}

// 메시지 전송 처리 함수
async function handleSend() {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  // 사용자 메시지를 화면과 히스토리에 추가
  messages.push({ role: "user", content: prompt });
  chatbox.innerHTML += `<div class="text-right mb-2 text-blue-600">나: ${prompt}</div>`;
  userInput.value = '';
  chatbox.scrollTop = chatbox.scrollHeight;

  // GPT 응답 받아오기
  const reply = await fetchGPTResponse();
  messages.push({ role: "assistant", content: reply });

  // 응답을 줄바꿈 포맷 처리 후 출력
  const formattedReply = formatGPTReply(reply);
  chatbox.innerHTML += `<div class="text-left mb-2 text-gray-800">GPT: ${formattedReply}</div>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}

// 버튼 클릭 시 메시지 전송
sendBtn.addEventListener('click', handleSend);

// Enter 키로 메시지 전송
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleSend();
  }
});
