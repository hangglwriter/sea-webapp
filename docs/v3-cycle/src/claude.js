/**
 * Anthropic Claude API 호출
 * 4명 페르소나 한 번에 한국어 답장 JSON 반환
 *
 * 주의: 브라우저에서 직접 호출하려면 anthropic-dangerous-direct-browser-access 헤더 필요.
 * 사용자가 본인 API 키 입력 → localStorage. 운영자는 키 보지 못함.
 */

window.callClaude = async function (apiKey, message, personas) {
  if (!apiKey || !apiKey.startsWith('sk-ant')) {
    throw new Error('Anthropic API 키가 필요해요. ⚙ API 버튼에서 입력해주세요.');
  }
  if (!message || message.trim().length < 2) {
    throw new Error('메시지를 입력해주세요.');
  }

  // 페르소나 prompt 조립
  const personaSection = personas.map(p =>
    `## ${p.name} (key: "${p.id}")\n${p.promptStyle}`
  ).join('\n\n');

  const idList = personas.map(p => `"${p.id}"`).join(', ');

  const systemPrompt = `너는 한국 카톡 답장 시뮬레이터다. 사용자가 보내려는 카톡 메시지를 받았다고 가정하고, 아래 ${personas.length}명의 페르소나가 각자의 입장에서 어떻게 답장할지 카톡 문체로 작성한다.

# 페르소나 ${personas.length}명

${personaSection}

# 출력 규칙
1. 반드시 JSON 객체로만 응답. 다른 설명/마크다운 금지.
2. JSON 키는 정확히: ${idList}
3. 각 값은 해당 페르소나의 답장 (한국어, 카톡 자연체, 80-200자, 줄바꿈은 \\n)
4. 페르소나의 톤/말투/이모티콘/줄임말을 정확히 반영
5. 실제 카톡처럼 자연스럽게. 너무 길거나 격식 차리지 말 것.
6. 자해/혐오/폭력 내용은 절대 생성 X. 안전한 답장만.

# 출력 예시 형식
{
  "${personas[0].id}": "...",
  "${personas[1]?.id || 'x'}": "..."
}`;

  const userPrompt = `보내려는 카톡 메시지:\n"${message.trim()}"\n\n${personas.length}명의 답장 JSON으로:`;

  const body = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    system: systemPrompt,
    messages: [
      { role: 'user', content: userPrompt }
    ]
  };

  let response;
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(body)
    });
  } catch (e) {
    throw new Error('네트워크 오류. 잠시 후 다시 시도해주세요.');
  }

  if (!response.ok) {
    let detail = '';
    try {
      const errData = await response.json();
      detail = errData.error?.message || JSON.stringify(errData);
    } catch (_) {}
    if (response.status === 401) {
      throw new Error('API 키가 올바르지 않아요. 다시 확인해주세요.');
    }
    if (response.status === 429) {
      throw new Error('API 호출 한도를 초과했어요. 잠시 후 다시 시도해주세요.');
    }
    throw new Error(`API 오류 (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  // JSON 추출 (앞뒤 텍스트 방어)
  let jsonStr = text.trim();
  const firstBrace = jsonStr.indexOf('{');
  const lastBrace = jsonStr.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('AI 응답 파싱 실패. 다시 시도해주세요.');
  }

  // 페르소나 id 매핑 보장
  const result = {};
  for (const p of personas) {
    result[p.id] = parsed[p.id] || parsed[p.name] || '(답장 생성 실패)';
  }
  return result;
};
