import { ActivityData, AiReviewFeedback } from '../types';

/**
 * Elementary school friendly AI feedback generator.
 * Analyzes the student's thoughts, checks grammar & spacing, provides warm encouragement and deeper inquiry questions.
 */
export function generateAiFeedback(activity: ActivityData): AiReviewFeedback {
  // Extract student text content
  const content = activity.content;
  const rawText = [
    content.impression,
    content.summary,
    content.letterBody,
    content.imaginedEnding,
    content.drawingExplanation,
    content.motivation
  ].filter(Boolean).join(' ');

  const textLength = rawText.trim().length;

  // 1. Spacing and common elementary grammar heuristics
  const grammarFixes: Array<{ original: string; correction: string; explanation: string }> = [];

  if (rawText.includes('됀다') || rawText.includes('됌')) {
    grammarFixes.push({
      original: '됀다 / 됌',
      correction: '된다 / 됨',
      explanation: "‘되다’의 어간 ‘되-’ 뒤에 ‘-ㄴ다’, ‘-ㅁ’이 바로 붙을 때는 ‘된다’, ‘됨’으로 적는 것이 바른 표현이에요!"
    });
  }

  if (rawText.includes('안되') && !rawText.includes('안 돼')) {
    grammarFixes.push({
      original: '안되',
      correction: '안 돼 / 안 되어',
      explanation: "문장의 끝이나 단독으로 쓸 때는 ‘되’ 대신 ‘돼(되어의 준말)’를 사용해요."
    });
  }

  if (rawText.includes('재밋') || rawText.includes('재밋다')) {
    grammarFixes.push({
      original: '재밋다',
      correction: '재미있다 / 재밌다',
      explanation: "‘재미있다’의 준말은 ‘재밌다’(ㅆ 받침)로 적어야 바른 맞춤법입니다."
    });
  }

  if (rawText.includes('않') && rawText.includes('않하고')) {
    grammarFixes.push({
      original: '않하고',
      correction: '안 하고',
      explanation: "‘아니하고’의 준말이 아닐 때는 ‘안’과 ‘하고’를 띄어 적어야 해요."
    });
  }

  if (rawText.includes('어떻해')) {
    grammarFixes.push({
      original: '어떻해',
      correction: '어떡해 (또는 어떻게 해)',
      explanation: "‘어떻게 해’의 준말은 ‘어떡해’로 적어요!"
    });
  }

  // If no common typos found, provide general spacing tip
  if (grammarFixes.length === 0) {
    grammarFixes.push({
      original: '전체적인 띄어쓰기와 문장 부호',
      correction: '아주 훌륭해요! ✨',
      explanation: '생각을 문장 부호(마침표, 쉼표)와 함께 또박또박 깔끔하게 잘 적었습니다.'
    });
  }

  // 2. Personalized Encouragement & Praise based on activity type and length
  let praise = '';
  let badge = '🌱 성장하는 독서가';

  if (textLength > 150) {
    praise = `책 속의 중요한 장면과 자신의 마음을 솔직하고 깊이 있게 표현한 점이 정말 인상적이에요! 특히 『${activity.bookTitle}』을 읽고 느낀 감정을 생생하게 글에 담아내어 읽는 사람의 마음까지 따뜻해집니다.`;
    badge = '👑 깊이 있는 독서왕';
  } else if (textLength > 50) {
    praise = `『${activity.bookTitle}』에 대한 핵심 생각과 느낌을 분명하게 잘 정리했어요! 문장이 막힘없이 자연스럽고 솔직해서 책을 재미있게 읽은 모습이 눈에 그려집니다.`;
    badge = '🌟 반짝이는 생각나무';
  } else {
    praise = `책을 끝까지 읽고 독후활동을 멋지게 완성한 노력이 참 기특해요! 다음에는 "왜 그런 마음이 들었는지" 까닭을 한 줄 더 보태어 적어보면 더 훌륭한 글이 될 거예요.`;
    badge = '💖 씩씩한 독서 꿈나무';
  }

  // 3. Deeper Thinking Inquiry Questions (발문 & 질문)
  const deepThinkingQuestions: string[] = [];
  if (activity.type === 'character_letter') {
    deepThinkingQuestions.push(`주인공이 이 편지를 읽는다면 어떤 답장을 보내올까요?`);
    deepThinkingQuestions.push(`내가 만약 주인공과 같은 상황이었다면 어떤 결정을 내렸을까요?`);
  } else if (activity.type === 'rewrite_ending') {
    deepThinkingQuestions.push(`바뀐 결말 이후 주인공들의 미래는 어떻게 달라졌을까요?`);
    deepThinkingQuestions.push(`원래 결말과 비교했을 때 내가 만든 결말이 더 좋은 까닭은 무엇인가요?`);
  } else if (activity.type === 'book_quiz') {
    deepThinkingQuestions.push(`친구들이 이 퀴즈를 풀면 가장 헷갈려할 문제는 몇 번일까요?`);
    deepThinkingQuestions.push(`책에서 가장 중요한 교훈을 담은 문제를 하나 더 만든다면 어떤 질문일까요?`);
  } else {
    deepThinkingQuestions.push(`책의 주인공에게서 본받고 싶은 점이나 아쉬웠던 점은 무엇인가요?`);
    deepThinkingQuestions.push(`이 책의 내용을 나의 생활이나 학교생활과 연결 짓는다면 어떤 일이 떠오르나요?`);
    deepThinkingQuestions.push(`이 책을 우리 반 친구에게 추천한다면 누구에게, 왜 추천하고 싶나요?`);
  }

  // 4. Recommended Keywords
  const recommendedKeywords = ['공감과 배려', '용기와 도전', '지혜로운 선택', '따뜻한 마음', '성장 이야기'];

  return {
    praise,
    grammarFixes,
    deepThinkingQuestions,
    recommendedKeywords,
    encouragementBadge: badge
  };
}
