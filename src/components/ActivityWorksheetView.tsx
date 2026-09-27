import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Send, 
  Palette, 
  HelpCircle, 
  Quote, 
  MessageSquare, 
  Megaphone, 
  GitFork, 
  Plus, 
  Edit3, 
  Trash2, 
  Printer, 
  BookOpen,
  Award,
  ChevronRight,
  CheckCircle,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { ActivityData, ActivityType, BookEntry, StudentProfile } from '../types';
import { ACTIVITY_TYPES } from './ActivityEditorModal';

interface ActivityWorksheetViewProps {
  activities: ActivityData[];
  books: BookEntry[];
  profile: StudentProfile;
  onOpenCreate: (book?: BookEntry) => void;
  onEditActivity: (activity: ActivityData) => void;
  onDeleteActivity: (id: string) => void;
}

export const ActivityWorksheetView: React.FC<ActivityWorksheetViewProps> = ({
  activities,
  books,
  profile,
  onOpenCreate,
  onEditActivity,
  onDeleteActivity
}) => {
  const [selectedActivityId, setSelectedActivityId] = useState<string>(
    activities.length > 0 ? activities[0].id : ''
  );
  const [mobileTab, setMobileTab] = useState<'list' | 'detail'>('list');
  const [filterType, setFilterType] = useState<string>('all');
  const [showQuizAnswers, setShowQuizAnswers] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<ActivityData | null>(null);

  const selectedActivity = activities.find((a) => a.id === selectedActivityId) || activities[0];

  const filteredActivities = activities.filter((a) => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  const printSingleWorksheet = () => {
    window.print();
  };

  const getActivityTypeMeta = (type: ActivityType) => {
    return ACTIVITY_TYPES.find((t) => t.type === type) || ACTIVITY_TYPES[0];
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-black/20 text-teal-200 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>에듀트랙 창의 독서 워크시트</span>
              <span className="text-white/80">9가지 맞춤 양식</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-jua text-white tracking-wide">
              다채로운 독서 활동 포트폴리오 🎨
            </h2>
            <p className="text-teal-100 text-sm mt-1">
              독서 감상문부터 편지 쓰기, 4컷 만화, 독서 퀴즈까지 원하는 양식으로 나만의 생각을 표현해보세요!
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenCreate()}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-extrabold px-5 py-2.5 rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 text-sm cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>새 독후 활동지 작성</span>
          </button>
        </div>

        {/* 9 Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-2 border-t border-white/20 scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterType === 'all'
                ? 'bg-white text-teal-900 shadow-sm'
                : 'bg-black/20 text-white/90 hover:bg-black/30'
            }`}
          >
            전체 활동 ({activities.length})
          </button>
          {ACTIVITY_TYPES.map((t) => {
            const count = activities.filter((a) => a.type === t.type).length;
            return (
              <button
                key={t.type}
                type="button"
                onClick={() => setFilterType(t.type)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  filterType === t.type
                    ? 'bg-white text-teal-900 shadow-sm'
                    : 'bg-black/20 text-white/90 hover:bg-black/30'
                }`}
              >
                <span>{t.title.split('.')[1] || t.title}</span>
                {count > 0 && <span className="bg-teal-200 text-teal-900 px-1.5 py-0.2 rounded-full text-[10px]">{count}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-stone-200 space-y-4">
          <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-xl font-jua text-stone-800">아직 작성된 독후 활동지가 없습니다</h3>
          <p className="text-sm text-stone-500 max-w-md mx-auto">
            읽은 책을 선택하고 9가지 에듀트랙 독후 활동 양식 중 마음에 드는 양식을 골라 나만의 멋진 기록을 남겨보세요!
          </p>
          <button
            type="button"
            onClick={() => onOpenCreate()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-bold rounded-2xl shadow-md hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>첫 독후 활동지 작성하기</span>
          </button>
        </div>
      ) : (
        <div>
          {/* Mobile Tab Switcher */}
          <div className="lg:hidden flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 mb-4 no-print">
            <button
              type="button"
              onClick={() => setMobileTab('list')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                mobileTab === 'list'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              📋 활동지 목록 ({filteredActivities.length})
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('detail')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                mobileTab === 'detail'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              📄 선택한 활동지 내용 보기
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
            {/* Left: Activity Selection List */}
            <div className={`lg:col-span-4 space-y-3 no-print ${mobileTab === 'detail' ? 'hidden lg:block' : 'block'}`}>
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">작성된 활동지 목록</span>
                <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full">
                  {filteredActivities.length}개
                </span>
              </div>

              <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
                {filteredActivities.map((act) => {
                  const meta = getActivityTypeMeta(act.type);
                  const isSelected = act.id === selectedActivity?.id;
                  const Icon = meta.icon;

                  return (
                    <div
                      key={act.id}
                      onClick={() => {
                        setSelectedActivityId(act.id);
                        setMobileTab('detail');
                      }}
                      className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer text-left relative active:scale-98 ${
                        isSelected
                          ? 'bg-amber-50/90 border-amber-400 shadow-sm'
                          : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                          <Icon className="w-3.5 h-3.5 text-amber-600" />
                          <span>{meta.title}</span>
                        </span>
                        <span className="text-[11px] text-stone-400 font-mono">{act.date}</span>
                      </div>

                      <h4 className="font-bold text-stone-900 text-sm line-clamp-1 mb-1">
                        {act.bookTitle}
                      </h4>

                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span>{act.author}</span>
                        {act.teacherStamp && (
                          <span className="text-[10px] text-rose-600 font-bold bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-full">
                            💮 {act.teacherStamp}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Authentic EduTrack School Worksheet Sheet Preview */}
            <div className={`lg:col-span-8 space-y-4 ${mobileTab === 'list' ? 'hidden lg:block' : 'block'}`}>
              {/* Mobile Back Button to list */}
              <div className="lg:hidden no-print mb-2">
                <button
                  type="button"
                  onClick={() => setMobileTab('list')}
                  className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                >
                  <span>← 활동지 목록으로 돌아가기</span>
                </button>
              </div>

              {selectedActivity ? (
                <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-stone-300 shadow-md sm:shadow-xl overflow-hidden print-shadow-none print-border-black">
                  
                  {/* Worksheet Control Bar (No Print) */}
                  <div className="bg-stone-100 p-3 sm:p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 no-print">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-600">활동지 미리보기</span>
                    {selectedActivity.type === 'book_quiz' && (
                      <button
                        type="button"
                        onClick={() => setShowQuizAnswers(!showQuizAnswers)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50"
                      >
                        {showQuizAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{showQuizAnswers ? '정답 숨기기' : '정답 보기'}</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditActivity(selectedActivity)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white text-stone-700 border border-stone-300 rounded-xl hover:bg-stone-50 font-bold"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                      <span>수정</span>
                    </button>
                    <button
                      type="button"
                      onClick={printSingleWorksheet}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-bold shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>이 활동지만 인쇄</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivityToDelete(selectedActivity)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Printable Worksheet A4 Container */}
                <div id="single-worksheet-printable" className="p-6 sm:p-10 bg-white space-y-6">
                  
                  {/* Official EduTrack Header Frame */}
                  <div className="border-2 border-stone-800 rounded-2xl p-4 sm:p-5 bg-amber-50/30">
                    <div className="text-center pb-3 border-b-2 border-stone-800">
                      <span className="text-[11px] font-bold text-amber-800 tracking-wider">EDUTRACK READING PORTFOLIO WORKSHEET</span>
                      <h3 className="text-xl sm:text-2xl font-jua text-stone-900 mt-0.5">
                        {getActivityTypeMeta(selectedActivity.type).title}
                      </h3>
                    </div>

                    {/* School / Student Info Box Table */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-3 text-stone-800">
                      <div className="border border-stone-300 p-1.5 rounded-lg bg-white">
                        <span className="text-stone-500 font-bold block text-[10px]">학교</span>
                        <span className="font-semibold">{profile.school}</span>
                      </div>
                      <div className="border border-stone-300 p-1.5 rounded-lg bg-white">
                        <span className="text-stone-500 font-bold block text-[10px]">학년 / 반 / 번호</span>
                        <span className="font-semibold">{profile.grade}학년 {profile.classRoom}반 {profile.studentNumber}번</span>
                      </div>
                      <div className="border border-stone-300 p-1.5 rounded-lg bg-white">
                        <span className="text-stone-500 font-bold block text-[10px]">이름</span>
                        <span className="font-bold text-stone-900">{profile.name}</span>
                      </div>
                      <div className="border border-stone-300 p-1.5 rounded-lg bg-white">
                        <span className="text-stone-500 font-bold block text-[10px]">작성일</span>
                        <span className="font-mono">{selectedActivity.date}</span>
                      </div>

                      <div className="sm:col-span-3 border border-stone-300 p-1.5 rounded-lg bg-white">
                        <span className="text-stone-500 font-bold block text-[10px]">도서명</span>
                        <span className="font-bold text-stone-900">{selectedActivity.bookTitle}</span>
                      </div>
                      <div className="border border-stone-300 p-1.5 rounded-lg bg-white">
                        <span className="text-stone-500 font-bold block text-[10px]">글쓴이</span>
                        <span className="font-medium">{selectedActivity.author}</span>
                      </div>
                    </div>
                  </div>

                  {/* Worksheet Content Body */}
                  <div className="space-y-5 text-stone-800 text-sm">
                    
                    {/* 1. Summary & Impression */}
                    {selectedActivity.type === 'summary_impression' && (
                      <div className="space-y-4">
                        {selectedActivity.content.motivation && (
                          <div className="border border-stone-300 rounded-xl p-4 bg-stone-50/50">
                            <h4 className="font-bold text-stone-900 text-xs text-amber-800 mb-1 flex items-center gap-1.5">
                              <span>🌱</span> <span>이 책을 읽게 된 동기</span>
                            </h4>
                            <p className="text-stone-800">{selectedActivity.content.motivation}</p>
                          </div>
                        )}

                        <div className="border border-stone-300 rounded-xl p-4 bg-white notebook-lines">
                          <h4 className="font-bold text-stone-900 text-xs text-amber-800 mb-1 flex items-center gap-1.5">
                            <span>📖</span> <span>줄거리 요약</span>
                          </h4>
                          <p className="text-stone-800 leading-relaxed">{selectedActivity.content.summary}</p>
                        </div>

                        {selectedActivity.content.impressiveScene && (
                          <div className="border border-stone-300 rounded-xl p-4 bg-stone-50/50">
                            <h4 className="font-bold text-stone-900 text-xs text-amber-800 mb-1 flex items-center gap-1.5">
                              <span>⭐</span> <span>가장 인상 깊은 장면</span>
                            </h4>
                            <p className="text-stone-800">{selectedActivity.content.impressiveScene}</p>
                          </div>
                        )}

                        <div className="border border-stone-300 rounded-xl p-4 bg-amber-50/30 notebook-lines">
                          <h4 className="font-bold text-stone-900 text-xs text-amber-800 mb-1 flex items-center gap-1.5">
                            <span>💡</span> <span>느낀 점 & 본받을 점</span>
                          </h4>
                          <p className="text-stone-800 leading-relaxed font-medium">{selectedActivity.content.impression}</p>
                        </div>
                      </div>
                    )}

                    {/* 2. Character Letter */}
                    {selectedActivity.type === 'character_letter' && (
                      <div className="border-2 border-pink-200 rounded-2xl p-6 bg-pink-50/20 relative space-y-4">
                        <div className="flex items-center justify-between border-b border-pink-200 pb-3">
                          <span className="font-jua text-lg text-pink-900">
                            To. {selectedActivity.content.receiver}
                          </span>
                          {/* Stamp graphic */}
                          <div className="w-12 h-14 border border-dashed border-pink-400 bg-white rounded-md p-1 flex flex-col items-center justify-center text-[9px] text-pink-600 font-bold">
                            <span>우표</span>
                            <span className="text-xs">📮</span>
                          </div>
                        </div>

                        {selectedActivity.content.letterGreeting && (
                          <p className="text-stone-700 italic font-medium">{selectedActivity.content.letterGreeting}</p>
                        )}

                        <div className="notebook-lines py-2 leading-relaxed text-stone-900">
                          {selectedActivity.content.letterBody}
                        </div>

                        <div className="text-right pt-4 border-t border-pink-200 font-bold text-stone-800">
                          {selectedActivity.content.letterSender}
                        </div>
                      </div>
                    )}

                    {/* 3. Rewrite Ending */}
                    {selectedActivity.type === 'rewrite_ending' && (
                      <div className="space-y-4">
                        <div className="border border-stone-300 rounded-xl p-4 bg-stone-50/50">
                          <h4 className="font-bold text-stone-700 text-xs mb-1">📖 원래 책의 결말</h4>
                          <p className="text-stone-700">{selectedActivity.content.originalEnding}</p>
                        </div>

                        <div className="border-2 border-purple-300 rounded-xl p-5 bg-purple-50/20 notebook-lines">
                          <h4 className="font-bold text-purple-900 text-sm mb-2 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span>내가 상상한 새로운 결말 이야기</span>
                          </h4>
                          <p className="text-stone-900 leading-relaxed">{selectedActivity.content.imaginedEnding}</p>
                        </div>

                        {selectedActivity.content.reasonForChange && (
                          <div className="border border-purple-200 rounded-xl p-3.5 bg-white text-xs text-stone-600">
                            <b>결말을 이렇게 바꾼 까닭:</b> {selectedActivity.content.reasonForChange}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 4. Scene Drawing */}
                    {selectedActivity.type === 'scene_drawing' && (
                      <div className="space-y-4">
                        <div className="text-center font-bold text-stone-800 text-base">
                          🎨 {selectedActivity.content.drawingTitle || '독서 감상화'}
                        </div>

                        <div className="border-2 border-stone-800 rounded-2xl overflow-hidden bg-white p-2 flex items-center justify-center min-h-[300px]">
                          {selectedActivity.content.drawingImageData ? (
                            <img
                              src={selectedActivity.content.drawingImageData}
                              alt="독서 감상화"
                              className="max-h-[360px] w-auto object-contain rounded-xl"
                            />
                          ) : (
                            <div className="text-stone-400 text-xs italic p-12 text-center">
                              등록된 그림이 없습니다. [수정]을 눌러 그림을 그려보세요!
                            </div>
                          )}
                        </div>

                        {selectedActivity.content.drawingExplanation && (
                          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700">
                            <b>장면 설명:</b> {selectedActivity.content.drawingExplanation}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 5. Book Quiz */}
                    {selectedActivity.type === 'book_quiz' && (
                      <div className="space-y-4">
                        {selectedActivity.content.quizzes?.map((quiz, i) => (
                          <div key={i} className="border border-blue-200 rounded-xl p-4 bg-blue-50/20 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                문제 {i + 1}
                              </span>
                              <span className="text-xs text-blue-800 font-bold">
                                {quiz.type === 'ox' && '(OX 퀴즈)'}
                                {quiz.type === 'choice' && '(객관식)'}
                                {quiz.type === 'short' && '(단답형/빈칸)'}
                              </span>
                            </div>

                            <p className="font-bold text-stone-900 text-sm pl-1">{quiz.question}</p>

                            {quiz.options && quiz.options.length > 0 && (
                              <div className="grid grid-cols-2 gap-1.5 pl-3 py-1 text-xs text-stone-700">
                                {quiz.options.map((opt, idx) => (
                                  <div key={idx}>• {opt}</div>
                                ))}
                              </div>
                            )}

                            {quiz.hint && (
                              <p className="text-[11px] text-stone-500 pl-1">💡 힌트: {quiz.hint}</p>
                            )}

                            {showQuizAnswers && (
                              <div className="pt-2 border-t border-blue-200 text-xs font-bold text-rose-600 flex items-center gap-1">
                                <span>🎯 정답:</span> <span>{quiz.answer}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 6. Golden Words & Vocab */}
                    {selectedActivity.type === 'golden_words' && (
                      <div className="space-y-5">
                        {/* Quotes */}
                        {selectedActivity.content.favoriteQuotes && selectedActivity.content.favoriteQuotes.length > 0 && (
                          <div className="border-2 border-amber-300 rounded-2xl p-5 bg-amber-50/40 space-y-3">
                            <h4 className="font-jua text-amber-900 text-base flex items-center gap-1.5">
                              <Quote className="w-4 h-4 text-amber-600" />
                              <span>마음을 울린 명문장</span>
                            </h4>
                            {selectedActivity.content.favoriteQuotes.map((q, idx) => (
                              <div key={idx} className="bg-white p-3.5 rounded-xl border border-amber-200">
                                <p className="font-semibold text-stone-900 italic text-sm mb-1">"{q.quote}"</p>
                                <p className="text-xs text-stone-600"><b>선정한 까닭:</b> {q.reason}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Vocabularies */}
                        {selectedActivity.content.vocabularies && selectedActivity.content.vocabularies.length > 0 && (
                          <div className="border-2 border-stone-300 rounded-2xl p-5 bg-stone-50 space-y-3">
                            <h4 className="font-jua text-stone-900 text-base flex items-center gap-1.5">
                              <BookOpen className="w-4 h-4 text-amber-600" />
                              <span>새로 배운 낱말 사전</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {selectedActivity.content.vocabularies.map((v, idx) => (
                                <div key={idx} className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                                  <div className="font-bold text-amber-900 text-sm">📖 {v.word}</div>
                                  <div className="text-xs text-stone-600"><b>뜻:</b> {v.meaning}</div>
                                  <div className="text-xs text-stone-800 bg-stone-50 p-2 rounded-lg mt-1 font-medium">
                                    <b>예문:</b> "{v.mySentence}"
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 7. Character Interview */}
                    {selectedActivity.type === 'character_interview' && (
                      <div className="border-2 border-teal-200 rounded-2xl p-5 bg-teal-50/20 space-y-4">
                        <div className="text-center pb-2 border-b border-teal-200">
                          <span className="text-xs font-bold text-teal-800">🎙️ 독서 가상 인터뷰</span>
                          <h4 className="font-jua text-lg text-teal-950 mt-0.5">
                            [{selectedActivity.content.intervieweeName}] 주인공을 만나다
                          </h4>
                        </div>

                        <div className="space-y-3">
                          {selectedActivity.content.qaList?.map((qa, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-teal-200 space-y-2 shadow-2xs">
                              <div className="font-bold text-teal-900 text-xs flex items-start gap-2">
                                <span className="bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-sm flex-shrink-0">질문 {i + 1}</span>
                                <span>{qa.question}</span>
                              </div>
                              <div className="text-stone-800 text-xs bg-stone-50 p-2.5 rounded-lg leading-relaxed border-l-2 border-teal-500 pl-3">
                                <b>답변:</b> {qa.answer}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 8. Book Ad */}
                    {selectedActivity.type === 'book_ad' && (
                      <div className="border-2 border-rose-300 rounded-2xl p-6 bg-gradient-to-br from-rose-50 via-white to-amber-50 space-y-5 text-center">
                        <span className="inline-block bg-rose-500 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          추천 도서 광고 포스터
                        </span>

                        <h4 className="font-jua text-xl sm:text-2xl text-stone-900 leading-snug">
                          "{selectedActivity.content.catchphrase}"
                        </h4>

                        {selectedActivity.content.targetReader && (
                          <div className="text-xs text-stone-700 bg-white/80 border border-stone-200 p-2.5 rounded-xl inline-block max-w-md">
                            🎯 <b>이런 친구들에게 추천해요:</b> {selectedActivity.content.targetReader}
                          </div>
                        )}

                        <div className="bg-white p-4 rounded-2xl border border-rose-200 text-left space-y-2 max-w-lg mx-auto shadow-xs">
                          <span className="text-xs font-bold text-rose-900 block border-b border-rose-100 pb-1">
                            ✨ 놓칠 수 없는 3가지 추천 포인트!
                          </span>
                          {selectedActivity.content.reasonsToRead?.map((r, i) => (
                            <div key={i} className="text-xs text-stone-800 flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                                {i + 1}
                              </span>
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 9. Mind Map */}
                    {selectedActivity.type === 'mind_map' && (
                      <div className="border-2 border-indigo-200 rounded-2xl p-6 bg-indigo-50/20 space-y-4">
                        <div className="text-center pb-3">
                          <span className="text-xs font-bold text-indigo-700">생각 그물 & 인물 관계도</span>
                          <h4 className="font-jua text-xl text-indigo-950 mt-1 bg-white inline-block px-4 py-1.5 rounded-2xl border border-indigo-300 shadow-xs">
                            🎯 {selectedActivity.content.coreTheme || '중심 생각'}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                          {selectedActivity.content.branches?.map((branch, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-indigo-200 space-y-2 shadow-2xs">
                              <h5 className="font-bold text-indigo-900 text-xs border-b border-indigo-100 pb-1">
                                🌿 {branch.title}
                              </h5>
                              <div className="space-y-1 text-xs text-stone-700">
                                {branch.items?.map((it, idx) => (
                                  <div key={idx} className="bg-stone-50 px-2 py-1 rounded">
                                    • {it}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Teacher Feedback Frame (EduTrack Signature Stamp Area) */}
                  <div className="border-2 border-dashed border-amber-400 bg-amber-50/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex-1 text-left space-y-1">
                      <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>선생님 칭찬 한마디 & 확인</span>
                      </span>
                      <p className="text-xs text-stone-700 italic">
                        "{selectedActivity.teacherComment || '창의적이고 정성스러운 독후 활동입니다. 참 잘했어요!'}"
                      </p>
                    </div>

                    {/* Teacher Stamp */}
                    <div className="flex-shrink-0 w-20 h-20 rounded-full border-2 border-rose-600 text-rose-600 flex flex-col items-center justify-center p-1 transform -rotate-6 select-none bg-white shadow-xs font-bold">
                      <span className="text-[9px] tracking-tighter">에듀트랙</span>
                      <span className="text-xs font-extrabold">{selectedActivity.teacherStamp || '참 잘했어요'}</span>
                      <span className="text-[8px]">★확인완료★</span>
                    </div>
                  </div>

                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )}

      {/* Activity Delete Confirmation Modal */}
      {activityToDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-rose-300 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-jua text-lg text-stone-900">활동지 삭제</h4>
                <p className="text-xs text-rose-600 font-bold">이 독후 활동지를 삭제하시겠습니까?</p>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1">
              <p className="font-bold text-stone-900 text-sm">📝 {activityToDelete.bookTitle}</p>
              <p className="text-stone-600">유형: {ACTIVITY_TYPES.find(t => t.type === activityToDelete.type)?.title || activityToDelete.type}</p>
              <p className="text-stone-500 text-[11px]">작성일: {activityToDelete.date}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActivityToDelete(null)}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteActivity(activityToDelete.id);
                  setActivityToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
