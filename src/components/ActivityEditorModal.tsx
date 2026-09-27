import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  Send, 
  Palette, 
  HelpCircle, 
  Quote, 
  MessageSquare, 
  Megaphone, 
  GitFork, 
  FileText,
  Check,
  Plus,
  Trash2
} from 'lucide-react';
import { ActivityData, ActivityType, BookEntry, StudentProfile } from '../types';
import { DrawingCanvas } from './DrawingCanvas';

interface ActivityEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: ActivityData) => void;
  book?: BookEntry;
  existingActivity?: ActivityData | null;
  books: BookEntry[];
  profile: StudentProfile;
}

export const ACTIVITY_TYPES: Array<{
  type: ActivityType;
  title: string;
  desc: string;
  icon: any;
  color: string;
}> = [
  {
    type: 'summary_impression',
    title: '1. 기본 독서 감상문',
    desc: '줄거리 요약과 기억에 남는 장면, 느낀 점',
    icon: FileText,
    color: 'from-amber-500 to-orange-500'
  },
  {
    type: 'character_letter',
    title: '2. 주인공에게 편지 쓰기',
    desc: '책 속 인물에게 내 마음과 응원의 편지 보내기',
    icon: Send,
    color: 'from-rose-400 to-pink-500'
  },
  {
    type: 'rewrite_ending',
    title: '3. 만약 내가 작가라면 (결말 바꾸기)',
    desc: '원래 결말과 다르게 새로운 결말 상상해보기',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    type: 'scene_drawing',
    title: '4. 독서 감상화 & 그림 그리기',
    desc: '가장 인상적인 장면을 직접 그림으로 표현하기',
    icon: Palette,
    color: 'from-emerald-400 to-teal-500'
  },
  {
    type: 'book_quiz',
    title: '5. 내가 만드는 독서 퀴즈 3선',
    desc: 'OX퀴즈, 객관식, 단답형 문제와 정답 내기',
    icon: HelpCircle,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    type: 'golden_words',
    title: '6. 명문장 & 새 낱말 사전',
    desc: '마음을 울린 한마디와 새로 알게 된 낱말 3개',
    icon: Quote,
    color: 'from-yellow-500 to-amber-600'
  },
  {
    type: 'character_interview',
    title: '7. 등장인물 가상 인터뷰',
    desc: '기자가 되어 주인공과 1:1 질문과 답변 나누기',
    icon: MessageSquare,
    color: 'from-teal-500 to-emerald-600'
  },
  {
    type: 'book_ad',
    title: '8. 책 추천 광고지 만들기',
    desc: '친구들에게 책을 홍보하는 멋진 한 줄 카피와 추천 이유',
    icon: Megaphone,
    color: 'from-orange-500 to-red-500'
  },
  {
    type: 'mind_map',
    title: '9. 생각 그물 & 인물 관계도',
    desc: '책의 중심 주제와 인물들의 관계를 정리하기',
    icon: GitFork,
    color: 'from-indigo-500 to-blue-600'
  }
];

export const ActivityEditorModal: React.FC<ActivityEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  book,
  existingActivity,
  books,
  profile
}) => {
  if (!isOpen) return null;

  const [selectedBookId, setSelectedBookId] = useState<string>(
    existingActivity?.bookId || book?.id || (books.length > 0 ? books[0].id : '')
  );
  const [selectedType, setSelectedType] = useState<ActivityType>(
    existingActivity?.type || 'summary_impression'
  );
  const [date, setDate] = useState<string>(
    existingActivity?.date || new Date().toISOString().split('T')[0]
  );

  // Form states for various activity types
  // 1. Summary & Impression
  const [motivation, setMotivation] = useState(existingActivity?.content.motivation || '');
  const [summary, setSummary] = useState(existingActivity?.content.summary || '');
  const [impressiveScene, setImpressiveScene] = useState(existingActivity?.content.impressiveScene || '');
  const [impression, setImpression] = useState(existingActivity?.content.impression || '');

  // 2. Character Letter
  const [receiver, setReceiver] = useState(existingActivity?.content.receiver || '');
  const [letterGreeting, setLetterGreeting] = useState(existingActivity?.content.letterGreeting || '');
  const [letterBody, setLetterBody] = useState(existingActivity?.content.letterBody || '');
  const [letterSender, setLetterSender] = useState(existingActivity?.content.letterSender || `${profile.name} 올림 💌`);

  // 3. Rewrite Ending
  const [originalEnding, setOriginalEnding] = useState(existingActivity?.content.originalEnding || '');
  const [imaginedEnding, setImaginedEnding] = useState(existingActivity?.content.imaginedEnding || '');
  const [reasonForChange, setReasonForChange] = useState(existingActivity?.content.reasonForChange || '');

  // 4. Drawing Canvas
  const [drawingImageData, setDrawingImageData] = useState(existingActivity?.content.drawingImageData || '');
  const [drawingTitle, setDrawingTitle] = useState(existingActivity?.content.drawingTitle || '');
  const [drawingExplanation, setDrawingExplanation] = useState(existingActivity?.content.drawingExplanation || '');

  // 5. Book Quiz
  const [q1, setQ1] = useState(existingActivity?.content.quizzes?.[0]?.question || '');
  const [a1, setA1] = useState(existingActivity?.content.quizzes?.[0]?.answer || 'O');
  const [h1, setH1] = useState(existingActivity?.content.quizzes?.[0]?.hint || '');

  const [q2, setQ2] = useState(existingActivity?.content.quizzes?.[1]?.question || '');
  const [q2Options, setQ2Options] = useState(existingActivity?.content.quizzes?.[1]?.options?.join(', ') || '1. 보기1, 2. 보기2, 3. 보기3, 4. 보기4');
  const [a2, setA2] = useState(existingActivity?.content.quizzes?.[1]?.answer || '');

  const [q3, setQ3] = useState(existingActivity?.content.quizzes?.[2]?.question || '');
  const [a3, setA3] = useState(existingActivity?.content.quizzes?.[2]?.answer || '');
  const [h3, setH3] = useState(existingActivity?.content.quizzes?.[2]?.hint || '');

  // 6. Golden Words & Vocab
  const [quote1, setQuote1] = useState(existingActivity?.content.favoriteQuotes?.[0]?.quote || '');
  const [quoteReason1, setQuoteReason1] = useState(existingActivity?.content.favoriteQuotes?.[0]?.reason || '');
  const [w1, setW1] = useState(existingActivity?.content.vocabularies?.[0]?.word || '');
  const [m1, setM1] = useState(existingActivity?.content.vocabularies?.[0]?.meaning || '');
  const [s1, setS1] = useState(existingActivity?.content.vocabularies?.[0]?.mySentence || '');

  const [w2, setW2] = useState(existingActivity?.content.vocabularies?.[1]?.word || '');
  const [m2, setM2] = useState(existingActivity?.content.vocabularies?.[1]?.meaning || '');
  const [s2, setS2] = useState(existingActivity?.content.vocabularies?.[1]?.mySentence || '');

  // 7. Character Interview
  const [interviewee, setInterviewee] = useState(existingActivity?.content.intervieweeName || '');
  const [iq1, setIq1] = useState(existingActivity?.content.qaList?.[0]?.question || '');
  const [ia1, setIa1] = useState(existingActivity?.content.qaList?.[0]?.answer || '');
  const [iq2, setIq2] = useState(existingActivity?.content.qaList?.[1]?.question || '');
  const [ia2, setIa2] = useState(existingActivity?.content.qaList?.[1]?.answer || '');

  // 8. Book Ad
  const [catchphrase, setCatchphrase] = useState(existingActivity?.content.catchphrase || '');
  const [targetReader, setTargetReader] = useState(existingActivity?.content.targetReader || '');
  const [reason1, setReason1] = useState(existingActivity?.content.reasonsToRead?.[0] || '');
  const [reason2, setReason2] = useState(existingActivity?.content.reasonsToRead?.[1] || '');
  const [reason3, setReason3] = useState(existingActivity?.content.reasonsToRead?.[2] || '');

  // 9. Mind Map
  const [coreTheme, setCoreTheme] = useState(existingActivity?.content.coreTheme || '');
  const [branch1Title, setBranch1Title] = useState(existingActivity?.content.branches?.[0]?.title || '등장인물');
  const [branch1Items, setBranch1Items] = useState(existingActivity?.content.branches?.[0]?.items?.join(', ') || '');
  const [branch2Title, setBranch2Title] = useState(existingActivity?.content.branches?.[1]?.title || '주요 사건');
  const [branch2Items, setBranch2Items] = useState(existingActivity?.content.branches?.[1]?.items?.join(', ') || '');
  const [branch3Title, setBranch3Title] = useState(existingActivity?.content.branches?.[2]?.title || '배운 교훈');
  const [branch3Items, setBranch3Items] = useState(existingActivity?.content.branches?.[2]?.items?.join(', ') || '');

  const currentSelectedBook = books.find((b) => b.id === selectedBookId) || books[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedBook) return;

    let contentPayload: ActivityData['content'] = {};

    if (selectedType === 'summary_impression') {
      contentPayload = { motivation, summary, impressiveScene, impression };
    } else if (selectedType === 'character_letter') {
      contentPayload = { receiver, letterGreeting, letterBody, letterSender };
    } else if (selectedType === 'rewrite_ending') {
      contentPayload = { originalEnding, imaginedEnding, reasonForChange };
    } else if (selectedType === 'scene_drawing') {
      contentPayload = { drawingImageData, drawingTitle, drawingExplanation };
    } else if (selectedType === 'book_quiz') {
      contentPayload = {
        quizzes: [
          { question: q1, type: 'ox', answer: a1, hint: h1 },
          { question: q2, type: 'choice', options: q2Options.split(',').map(s => s.trim()), answer: a2 },
          { question: q3, type: 'short', answer: a3, hint: h3 }
        ]
      };
    } else if (selectedType === 'golden_words') {
      contentPayload = {
        favoriteQuotes: [{ quote: quote1, reason: quoteReason1 }],
        vocabularies: [
          { word: w1, meaning: m1, mySentence: s1 },
          { word: w2, meaning: m2, mySentence: s2 }
        ].filter(v => v.word.trim())
      };
    } else if (selectedType === 'character_interview') {
      contentPayload = {
        intervieweeName: interviewee,
        qaList: [
          { question: iq1, answer: ia1 },
          { question: iq2, answer: ia2 }
        ].filter(qa => qa.question.trim())
      };
    } else if (selectedType === 'book_ad') {
      contentPayload = {
        catchphrase,
        targetReader,
        reasonsToRead: [reason1, reason2, reason3].filter(Boolean)
      };
    } else if (selectedType === 'mind_map') {
      contentPayload = {
        coreTheme,
        branches: [
          { title: branch1Title, items: branch1Items.split(',').map(s => s.trim()) },
          { title: branch2Title, items: branch2Items.split(',').map(s => s.trim()) },
          { title: branch3Title, items: branch3Items.split(',').map(s => s.trim()) }
        ]
      };
    }

    const activityData: ActivityData = {
      id: existingActivity?.id || `act-${Date.now()}`,
      bookId: currentSelectedBook.id,
      bookTitle: currentSelectedBook.title,
      author: currentSelectedBook.author,
      type: selectedType,
      date,
      content: contentPayload,
      teacherStamp: existingActivity?.teacherStamp || '참 잘했어요',
      teacherComment: existingActivity?.teacherComment || '창의적인 생각과 정성스러운 표현이 돋보이는 독후활동입니다!'
    };

    onSave(activityData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-7 shadow-2xl border-2 border-amber-300 max-h-[94vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-jua text-stone-900">
                {existingActivity ? '독후 활동지 수정하기' : '새로운 독후 활동지 작성하기'}
              </h3>
              <p className="text-xs text-stone-500">에듀트랙 9가지 창의 독서 워크시트</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-1 py-4 space-y-5 text-sm">
          
          {/* Target Book and Date Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">대상 도서 선택</label>
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none font-bold text-stone-800"
              >
                {books.map((b) => (
                  <option key={b.id} value={b.id}>
                    📖 {b.title} ({b.author})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">작성 날짜</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Activity Type Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              독후 활동 양식 선택 (9가지 에듀트랙 템플릿)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ACTIVITY_TYPES.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedType === t.type;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setSelectedType(t.type)}
                    className={`text-left p-2.5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/80 shadow-xs scale-[1.02]'
                        : 'border-stone-200 bg-stone-50/60 hover:bg-stone-100/80 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-600 font-bold' : 'text-stone-500'}`} />
                      <span className={`text-xs font-bold ${isSelected ? 'text-amber-950' : 'text-stone-800'}`}>
                        {t.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 line-clamp-1">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4">
            {/* Dynamic Template Fields */}

            {/* 1. Summary & Impression */}
            {selectedType === 'summary_impression' && (
              <div className="space-y-4 bg-orange-50/40 p-4 rounded-2xl border border-orange-200">
                <div className="flex items-center gap-2 text-orange-900 font-jua text-base mb-1">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span>기본 독서 감상문 작성</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">이 책을 읽게 된 까닭 (동기)</label>
                  <input
                    type="text"
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="예: 선생님의 추천 도서 목록을 보고 제목이 흥미로워 읽게 되었습니다."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">전체 줄거리 요약</label>
                  <textarea
                    rows={4}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="책의 처음, 중간, 끝 흐름을 3~4문장으로 요약해보세요."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">가장 기억에 남거나 인상 깊은 장면</label>
                  <input
                    type="text"
                    value={impressiveScene}
                    onChange={(e) => setImpressiveScene(e.target.value)}
                    placeholder="가장 마음에 와닿은 한 장면을 적어보세요."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">느낀 점과 앞으로의 다짐</label>
                  <textarea
                    rows={3}
                    value={impression}
                    onChange={(e) => setImpression(e.target.value)}
                    placeholder="책을 통해 새롭게 깨달은 점이나 본받고 싶은 마음을 적어보세요."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 2. Character Letter */}
            {selectedType === 'character_letter' && (
              <div className="space-y-4 bg-pink-50/40 p-4 rounded-2xl border border-pink-200">
                <div className="flex items-center gap-2 text-pink-900 font-jua text-base mb-1">
                  <Send className="w-4 h-4 text-pink-600" />
                  <span>주인공에게 보내는 편지</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">받는 주인공 이름</label>
                    <input
                      type="text"
                      value={receiver}
                      onChange={(e) => setReceiver(e.target.value)}
                      placeholder="예: 용기 있는 잎싹에게"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">첫인사</label>
                    <input
                      type="text"
                      value={letterGreeting}
                      onChange={(e) => setLetterGreeting(e.target.value)}
                      placeholder="예: 안녕 잎싹아! 나는 너의 이야기를 감명 깊게 읽은 지우라고 해."
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">편지 본문 내용</label>
                  <textarea
                    rows={5}
                    value={letterBody}
                    onChange={(e) => setLetterBody(e.target.value)}
                    placeholder="주인공에게 하고 싶은 말, 응원의 메시지, 궁금한 점을 진심을 담아 써보세요."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">보내는 사람</label>
                  <input
                    type="text"
                    value={letterSender}
                    onChange={(e) => setLetterSender(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none font-bold text-stone-800"
                  />
                </div>
              </div>
            )}

            {/* 3. Rewrite Ending */}
            {selectedType === 'rewrite_ending' && (
              <div className="space-y-4 bg-purple-50/40 p-4 rounded-2xl border border-purple-200">
                <div className="flex items-center gap-2 text-purple-900 font-jua text-base mb-1">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>만약 내가 작가라면 (결말 바꾸기)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">원래 책의 결말은 어떠했나요?</label>
                  <textarea
                    rows={2}
                    value={originalEnding}
                    onChange={(e) => setOriginalEnding(e.target.value)}
                    placeholder="책의 원래 결말을 간단히 적어보세요."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">내가 상상한 새로운 결말 이야기</label>
                  <textarea
                    rows={4}
                    value={imaginedEnding}
                    onChange={(e) => setImaginedEnding(e.target.value)}
                    placeholder="만약 주인공이 다른 선택을 했다면? 내가 원하는 흥미진진하고 따뜻한 결말을 상상해보세요."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">결말을 이렇게 바꾼 이유</label>
                  <input
                    type="text"
                    value={reasonForChange}
                    onChange={(e) => setReasonForChange(e.target.value)}
                    placeholder="새로운 결말을 지은 까닭을 적어보세요."
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 4. Scene Drawing */}
            {selectedType === 'scene_drawing' && (
              <div className="space-y-4 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-900 font-jua text-base mb-1">
                  <Palette className="w-4 h-4 text-emerald-600" />
                  <span>독서 감상화 & 그림 그리기 캔버스</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">그림 제목</label>
                    <input
                      type="text"
                      value={drawingTitle}
                      onChange={(e) => setDrawingTitle(e.target.value)}
                      placeholder="예: 하늘을 나는 잎싹과 초록머리"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">장면 설명 한 줄</label>
                    <input
                      type="text"
                      value={drawingExplanation}
                      onChange={(e) => setDrawingExplanation(e.target.value)}
                      placeholder="예: 족제비를 피해 날아오르는 감동적인 순간"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Integrated Drawing Canvas */}
                <DrawingCanvas
                  initialData={drawingImageData}
                  onSave={(img) => setDrawingImageData(img)}
                  width={640}
                  height={340}
                  title="책 속 명장면을 자유롭게 스케치해보세요!"
                />
              </div>
            )}

            {/* 5. Book Quiz */}
            {selectedType === 'book_quiz' && (
              <div className="space-y-4 bg-blue-50/40 p-4 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-2 text-blue-900 font-jua text-base mb-1">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>내가 만드는 독서 퀴즈 3선</span>
                </div>

                {/* Q1: OX Quiz */}
                <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-2">
                  <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                    문제 1 (OX 퀴즈)
                  </span>
                  <input
                    type="text"
                    value={q1}
                    onChange={(e) => setQ1(e.target.value)}
                    placeholder="OX 퀴즈 문제를 적어보세요."
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-stone-600">정답:</span>
                    <label className="flex items-center gap-1 text-xs font-bold text-blue-700">
                      <input
                        type="radio"
                        name="ox-answer"
                        value="O"
                        checked={a1 === 'O'}
                        onChange={() => setA1('O')}
                      />
                      O
                    </label>
                    <label className="flex items-center gap-1 text-xs font-bold text-rose-700">
                      <input
                        type="radio"
                        name="ox-answer"
                        value="X"
                        checked={a1 === 'X'}
                        onChange={() => setA1('X')}
                      />
                      X
                    </label>
                    <input
                      type="text"
                      value={h1}
                      onChange={(e) => setH1(e.target.value)}
                      placeholder="힌트 (선택)"
                      className="flex-1 px-2 py-1 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Q2: Multiple Choice */}
                <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-2">
                  <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                    문제 2 (객관식 퀴즈)
                  </span>
                  <input
                    type="text"
                    value={q2}
                    onChange={(e) => setQ2(e.target.value)}
                    placeholder="객관식 문제를 적어보세요."
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={q2Options}
                    onChange={(e) => setQ2Options(e.target.value)}
                    placeholder="보기들 (쉼표로 구분 예: 1.수성, 2.금성, 3.화성)"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    value={a2}
                    onChange={(e) => setA2(e.target.value)}
                    placeholder="정답 번호나 단어"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-bold"
                  />
                </div>

                {/* Q3: Short Answer */}
                <div className="p-3 bg-white rounded-xl border border-blue-200 space-y-2">
                  <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                    문제 3 (단답형 / 빈칸 퀴즈)
                  </span>
                  <input
                    type="text"
                    value={q3}
                    onChange={(e) => setQ3(e.target.value)}
                    placeholder="단답형 문제나 빈칸 문제를 적어보세요."
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={a3}
                      onChange={(e) => setA3(e.target.value)}
                      placeholder="정답 낱말"
                      className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs font-bold text-blue-900"
                    />
                    <input
                      type="text"
                      value={h3}
                      onChange={(e) => setH3(e.target.value)}
                      placeholder="힌트"
                      className="px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 6. Golden Words & Vocab */}
            {selectedType === 'golden_words' && (
              <div className="space-y-4 bg-amber-50/40 p-4 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900 font-jua text-base mb-1">
                  <Quote className="w-4 h-4 text-amber-600" />
                  <span>마음을 울린 명문장 & 새 낱말 사전</span>
                </div>

                {/* Favorite Quote */}
                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2">
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    📖 책 속 감동 명문장
                  </span>
                  <textarea
                    rows={2}
                    value={quote1}
                    onChange={(e) => setQuote1(e.target.value)}
                    placeholder="책에서 가장 기억에 남는 문장을 그대로 옮겨 적어보세요."
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs italic"
                  />
                  <input
                    type="text"
                    value={quoteReason1}
                    onChange={(e) => setQuoteReason1(e.target.value)}
                    placeholder="이 문장이 마음에 남은 까닭"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                {/* New Vocabularies */}
                <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-3">
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    📚 새로 알게 된 낱말과 뜻
                  </span>
                  
                  {/* Vocab 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-b border-stone-100 pb-2">
                    <input
                      type="text"
                      value={w1}
                      onChange={(e) => setW1(e.target.value)}
                      placeholder="낱말 1 (예: 너그럽다)"
                      className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-bold text-amber-950"
                    />
                    <input
                      type="text"
                      value={m1}
                      onChange={(e) => setM1(e.target.value)}
                      placeholder="사전적 뜻 풀이"
                      className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      value={s1}
                      onChange={(e) => setS1(e.target.value)}
                      placeholder="내가 만든 문장"
                      className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  {/* Vocab 2 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={w2}
                      onChange={(e) => setW2(e.target.value)}
                      placeholder="낱말 2 (예: 벅차다)"
                      className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs font-bold text-amber-950"
                    />
                    <input
                      type="text"
                      value={m2}
                      onChange={(e) => setM2(e.target.value)}
                      placeholder="사전적 뜻 풀이"
                      className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      value={s2}
                      onChange={(e) => setS2(e.target.value)}
                      placeholder="내가 만든 문장"
                      className="px-2.5 py-1.5 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 7. Character Interview */}
            {selectedType === 'character_interview' && (
              <div className="space-y-4 bg-teal-50/40 p-4 rounded-2xl border border-teal-200">
                <div className="flex items-center gap-2 text-teal-900 font-jua text-base mb-1">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  <span>등장인물 가상 인터뷰 (기자 vs 주인공)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">인터뷰 대상 인물</label>
                  <input
                    type="text"
                    value={interviewee}
                    onChange={(e) => setInterviewee(e.target.value)}
                    placeholder="예: 조선 4대 임금 세종대왕"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:outline-none font-bold"
                  />
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-teal-200 space-y-2">
                    <input
                      type="text"
                      value={iq1}
                      onChange={(e) => setIq1(e.target.value)}
                      placeholder="🎤 질문 1: 가장 힘들었던 순간은 언제이셨나요?"
                      className="w-full px-3 py-1.5 border border-teal-200 rounded-lg text-xs font-bold text-teal-900"
                    />
                    <textarea
                      rows={2}
                      value={ia1}
                      onChange={(e) => setIa1(e.target.value)}
                      placeholder="🗣️ 답변 1: 주인공의 말투로 생생하게 적어보세요."
                      className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-teal-200 space-y-2">
                    <input
                      type="text"
                      value={iq2}
                      onChange={(e) => setIq2(e.target.value)}
                      placeholder="🎤 질문 2: 앞으로 꼭 이루고 싶은 꿈은 무엇인가요?"
                      className="w-full px-3 py-1.5 border border-teal-200 rounded-lg text-xs font-bold text-teal-900"
                    />
                    <textarea
                      rows={2}
                      value={ia2}
                      onChange={(e) => setIa2(e.target.value)}
                      placeholder="🗣️ 답변 2: 주인공의 답변을 상상해서 적어보세요."
                      className="w-full px-3 py-1.5 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. Book Ad */}
            {selectedType === 'book_ad' && (
              <div className="space-y-4 bg-rose-50/40 p-4 rounded-2xl border border-rose-200">
                <div className="flex items-center gap-2 text-rose-900 font-jua text-base mb-1">
                  <Megaphone className="w-4 h-4 text-rose-600" />
                  <span>친구에게 추천하는 책 광고지 만들기</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">눈길을 사로잡는 한 줄 광고 카피</label>
                  <input
                    type="text"
                    value={catchphrase}
                    onChange={(e) => setCatchphrase(e.target.value)}
                    placeholder="예: 작고 연약하다고 기죽지 마! 내 안의 용기를 깨우는 아프리카 초원의 대모험!"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none font-bold text-rose-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">이 책을 꼭 읽어야 할 추천 대상 친구</label>
                  <input
                    type="text"
                    value={targetReader}
                    onChange={(e) => setTargetReader(e.target.value)}
                    placeholder="예: 자신감이 부족하거나 새로운 도전을 두려워하는 친구들"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-stone-700">추천하는 강력한 이유 3가지</label>
                  <input
                    type="text"
                    value={reason1}
                    onChange={(e) => setReason1(e.target.value)}
                    placeholder="이유 1: 포기하지 않는 주인공의 감동적인 용기"
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={reason2}
                    onChange={(e) => setReason2(e.target.value)}
                    placeholder="이유 2: 흥미진진하고 박진감 넘치는 스토리 전개"
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs"
                  />
                  <input
                    type="text"
                    value={reason3}
                    onChange={(e) => setReason3(e.target.value)}
                    placeholder="이유 3: 따뜻한 우정과 성장의 교훈"
                    className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            {/* 9. Mind Map */}
            {selectedType === 'mind_map' && (
              <div className="space-y-4 bg-indigo-50/40 p-4 rounded-2xl border border-indigo-200">
                <div className="flex items-center gap-2 text-indigo-900 font-jua text-base mb-1">
                  <GitFork className="w-4 h-4 text-indigo-600" />
                  <span>생각 그물 & 인물 관계도</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">중심 핵심 키워드 / 주제</label>
                  <input
                    type="text"
                    value={coreTheme}
                    onChange={(e) => setCoreTheme(e.target.value)}
                    placeholder="예: 마당을 나온 암탉 - 자유와 모성애"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none font-bold text-indigo-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-indigo-200 space-y-2">
                    <input
                      type="text"
                      value={branch1Title}
                      onChange={(e) => setBranch1Title(e.target.value)}
                      placeholder="가지 1 주제"
                      className="w-full px-2 py-1 border border-indigo-200 rounded font-bold text-xs"
                    />
                    <textarea
                      rows={3}
                      value={branch1Items}
                      onChange={(e) => setBranch1Items(e.target.value)}
                      placeholder="세부 내용 (쉼표 구분)"
                      className="w-full px-2 py-1 border border-stone-300 rounded text-xs"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-indigo-200 space-y-2">
                    <input
                      type="text"
                      value={branch2Title}
                      onChange={(e) => setBranch2Title(e.target.value)}
                      placeholder="가지 2 주제"
                      className="w-full px-2 py-1 border border-indigo-200 rounded font-bold text-xs"
                    />
                    <textarea
                      rows={3}
                      value={branch2Items}
                      onChange={(e) => setBranch2Items(e.target.value)}
                      placeholder="세부 내용 (쉼표 구분)"
                      className="w-full px-2 py-1 border border-stone-300 rounded text-xs"
                    />
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-indigo-200 space-y-2">
                    <input
                      type="text"
                      value={branch3Title}
                      onChange={(e) => setBranch3Title(e.target.value)}
                      placeholder="가지 3 주제"
                      className="w-full px-2 py-1 border border-indigo-200 rounded font-bold text-xs"
                    />
                    <textarea
                      rows={3}
                      value={branch3Items}
                      onChange={(e) => setBranch3Items(e.target.value)}
                      placeholder="세부 내용 (쉼표 구분)"
                      className="w-full px-2 py-1 border border-stone-300 rounded text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md shadow-amber-200 transition-all hover:scale-105"
            >
              활동지 저장하기 📝
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
