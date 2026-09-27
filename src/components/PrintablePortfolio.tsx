import React, { useState } from 'react';
import { 
  Printer, 
  FileCheck, 
  Download, 
  Sparkles, 
  CheckSquare, 
  Square,
  BookOpen,
  Award,
  Calendar,
  GraduationCap
} from 'lucide-react';
import { BookEntry, ActivityData, StudentProfile } from '../types';
import { ACTIVITY_TYPES } from './ActivityEditorModal';

interface PrintablePortfolioProps {
  profile: StudentProfile;
  books: BookEntry[];
  activities: ActivityData[];
}

export const PrintablePortfolio: React.FC<PrintablePortfolioProps> = ({
  profile,
  books,
  activities
}) => {
  const [includeCover, setIncludeCover] = useState(true);
  const [includeBankbook, setIncludeBankbook] = useState(true);
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>(
    activities.map((a) => a.id)
  );

  const toggleActivitySelection = (id: string) => {
    if (selectedActivityIds.includes(id)) {
      setSelectedActivityIds(selectedActivityIds.filter(item => item !== id));
    } else {
      setSelectedActivityIds([...selectedActivityIds, id]);
    }
  };

  const handleSelectAllActivities = () => {
    if (selectedActivityIds.length === activities.length) {
      setSelectedActivityIds([]);
    } else {
      setSelectedActivityIds(activities.map(a => a.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedActivitiesList = activities.filter(a => selectedActivityIds.includes(a.id));
  const totalPages = books.reduce((acc, curr) => acc + (curr.pages || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner (No Print) */}
      <div className="bg-gradient-to-r from-stone-800 via-stone-900 to-stone-800 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden no-print">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <Printer className="w-3.5 h-3.5" />
              <span>에듀트랙 표준 제출 양식</span>
              <span className="text-white/80">A4 규격 인쇄 및 PDF 저장</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-jua text-white tracking-wide">
              학교 제출용 독서 포트폴리오 인쇄 🖨️
            </h2>
            <p className="text-stone-300 text-sm mt-1">
              방학 숙제 및 학기말 독서 기록장 제출에 최적화된 깔끔한 A4 서식으로 출력하거나 PDF로 저장할 수 있습니다.
            </p>
          </div>

          <button
            id="trigger-print-btn"
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-stone-950 font-extrabold px-6 py-3 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 text-base cursor-pointer whitespace-nowrap"
          >
            <Printer className="w-5 h-5" />
            <span>지금 A4 출력 / PDF 저장</span>
          </button>
        </div>

        {/* Options Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs font-medium">
          <span className="text-stone-400 font-bold">인쇄 항목 선택:</span>
          
          <label className="flex items-center gap-1.5 cursor-pointer bg-white/10 px-3 py-1.5 rounded-xl hover:bg-white/15">
            <input
              type="checkbox"
              checked={includeCover}
              onChange={(e) => setIncludeCover(e.target.checked)}
              className="accent-amber-400"
            />
            <span>1. 독서기록장 표지 & 서약서</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer bg-white/10 px-3 py-1.5 rounded-xl hover:bg-white/15">
            <input
              type="checkbox"
              checked={includeBankbook}
              onChange={(e) => setIncludeBankbook(e.target.checked)}
              className="accent-amber-400"
            />
            <span>2. 독서 통장 목록표 ({books.length}권)</span>
          </label>

          <button
            type="button"
            onClick={handleSelectAllActivities}
            className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl hover:bg-white/15 text-amber-300 font-bold"
          >
            <span>3. 독후 활동지 ({selectedActivityIds.length}/{activities.length}개 선택됨)</span>
          </button>
        </div>
      </div>

      {/* Activity checkboxes list (No Print) */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2 no-print">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-700">포함할 독후 활동지 체크:</span>
          <button
            type="button"
            onClick={handleSelectAllActivities}
            className="text-xs text-amber-700 font-bold hover:underline"
          >
            {selectedActivityIds.length === activities.length ? '전체 해제' : '전체 선택'}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
          {activities.map((a) => (
            <label
              key={a.id}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
                selectedActivityIds.includes(a.id)
                  ? 'bg-amber-50 border-amber-300 text-stone-900 font-bold'
                  : 'bg-stone-50 border-stone-200 text-stone-500'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedActivityIds.includes(a.id)}
                onChange={() => toggleActivitySelection(a.id)}
                className="accent-amber-500"
              />
              <span className="truncate">[{a.type}] {a.bookTitle}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ================= PRINT PREVIEW DOCUMENT CONTAINER ================= */}
      <div className="bg-white p-4 sm:p-10 rounded-3xl border-2 border-stone-300 shadow-xl space-y-12 print-shadow-none print-border-black">
        
        {/* 1. COVER PAGE (표지) */}
        {includeCover && (
          <div className="border-4 border-double border-stone-900 p-8 sm:p-14 rounded-3xl bg-amber-50/20 text-center space-y-8 page-break">
            {/* Header school tag */}
            <div className="inline-block border-b-2 border-stone-800 pb-1">
              <span className="text-xs font-bold tracking-widest uppercase text-stone-700">
                EDUTRACK ELEMENTARY READING PORTFOLIO
              </span>
            </div>

            <div className="py-4">
              <span className="text-4xl">📚</span>
              <h1 className="text-3xl sm:text-4xl font-jua text-stone-900 mt-3 tracking-wide">
                나의 독서 기록장
              </h1>
              <p className="text-base text-stone-600 font-bold mt-1">
                - 지혜의 씨앗을 심고 생각을 가꾸는 독서 포트폴리오 -
              </p>
            </div>

            {/* Student Info Table on Cover */}
            <div className="max-w-md mx-auto border-2 border-stone-800 rounded-2xl overflow-hidden bg-white text-sm">
              <div className="grid grid-cols-3 divide-x divide-stone-800 border-b border-stone-800">
                <div className="bg-stone-100 p-2.5 font-bold text-stone-800">학 교</div>
                <div className="col-span-2 p-2.5 font-semibold text-stone-900">{profile.school}</div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-stone-800 border-b border-stone-800">
                <div className="bg-stone-100 p-2.5 font-bold text-stone-800">학 년 / 반</div>
                <div className="col-span-2 p-2.5 font-semibold text-stone-900">
                  {profile.grade}학년 {profile.classRoom}반 {profile.studentNumber}번
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-stone-800 border-b border-stone-800">
                <div className="bg-stone-100 p-2.5 font-bold text-stone-800">성 명</div>
                <div className="col-span-2 p-2.5 font-bold text-lg text-stone-900">{profile.name}</div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-stone-800">
                <div className="bg-stone-100 p-2.5 font-bold text-stone-800">목표 권수</div>
                <div className="col-span-2 p-2.5 font-semibold text-stone-900">
                  {profile.targetCount}권 (총 {books.length}권 완독 / {totalPages.toLocaleString()}쪽)
                </div>
              </div>
            </div>

            {/* Pledge Card */}
            <div className="max-w-lg mx-auto bg-stone-50 border border-stone-300 rounded-2xl p-5 text-xs sm:text-sm text-stone-800 space-y-2">
              <span className="font-bold text-stone-900 block">나의 독서 다짐</span>
              <p className="italic leading-relaxed font-medium">"{profile.pledge}"</p>
            </div>

            {/* Teacher Seal Area */}
            <div className="pt-6 flex items-center justify-between max-w-md mx-auto text-xs text-stone-700">
              <div className="text-left">
                <p>기록 기간: {profile.startDate} ~ 2026-08-31</p>
                <p className="font-bold mt-1">지도 교사 확인: (인/서명)</p>
              </div>

              <div className="w-16 h-16 rounded-full border-2 border-rose-600 text-rose-600 flex flex-col items-center justify-center p-1 font-bold text-[9px] -rotate-12">
                <span>에듀트랙</span>
                <span className="text-xs font-black">참잘했어요</span>
                <span>★인증★</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. READING PASSBOOK TABLE (독서 통장 목록) */}
        {includeBankbook && (
          <div className="space-y-4 page-break">
            <div className="flex items-center justify-between border-b-2 border-stone-900 pb-2">
              <div>
                <span className="text-xs font-bold text-stone-500">EDUTRACK READING MILEAGE RECORD</span>
                <h2 className="text-xl font-jua text-stone-900">독서 통장 기록 목록 ({books.length}권)</h2>
              </div>
              <div className="text-xs text-stone-600 font-bold">
                {profile.school} {profile.grade}학년 {profile.classRoom}반 {profile.name}
              </div>
            </div>

            <table className="w-full text-left text-xs border-collapse border border-stone-800">
              <thead>
                <tr className="bg-stone-100 text-stone-800 font-bold text-center border-b border-stone-800">
                  <th className="py-2 px-1 border-r border-stone-800 w-8">No</th>
                  <th className="py-2 px-2 border-r border-stone-800 w-20">날짜</th>
                  <th className="py-2 px-3 border-r border-stone-800 text-left">도서명</th>
                  <th className="py-2 px-2 border-r border-stone-800 w-24">지은이</th>
                  <th className="py-2 px-2 border-r border-stone-800 w-20">출판사</th>
                  <th className="py-2 px-1 border-r border-stone-800 w-12">쪽수</th>
                  <th className="py-2 px-1 border-r border-stone-800 w-14">별점</th>
                  <th className="py-2 px-3 border-r border-stone-800 text-left">한 줄 생각</th>
                  <th className="py-2 px-2 w-16">확인</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-300 text-[11px]">
                {books.map((b, idx) => (
                  <tr key={b.id}>
                    <td className="py-2 px-1 text-center font-bold border-r border-stone-300">{idx + 1}</td>
                    <td className="py-2 px-2 font-mono text-center border-r border-stone-300">{b.date}</td>
                    <td className="py-2 px-3 font-bold border-r border-stone-300">{b.title}</td>
                    <td className="py-2 px-2 border-r border-stone-300">{b.author}</td>
                    <td className="py-2 px-2 border-r border-stone-300">{b.publisher}</td>
                    <td className="py-2 px-1 text-center font-mono border-r border-stone-300">{b.pages}p</td>
                    <td className="py-2 px-1 text-center border-r border-stone-300 text-amber-600 font-bold">
                      {'★'.repeat(b.rating)}
                    </td>
                    <td className="py-2 px-3 italic border-r border-stone-300">{b.oneLineReview}</td>
                    <td className="py-2 px-2 text-center text-rose-600 font-bold text-[10px]">
                      {b.stamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. SELECTED ACTIVITY WORKSHEETS (독후 활동지들) */}
        {selectedActivitiesList.map((activity, index) => {
          const typeMeta = ACTIVITY_TYPES.find(t => t.type === activity.type) || ACTIVITY_TYPES[0];
          return (
            <div key={activity.id} className="space-y-4 page-break pt-4">
              <div className="border-2 border-stone-900 rounded-2xl p-5 bg-white space-y-4">
                
                {/* Official Header */}
                <div className="text-center pb-3 border-b-2 border-stone-900">
                  <span className="text-[10px] font-bold text-stone-500">EDUTRACK WORKSHEET #{index + 1}</span>
                  <h3 className="text-xl font-jua text-stone-900">{typeMeta.title}</h3>
                </div>

                {/* Meta Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border border-stone-300 p-2 rounded-xl bg-stone-50">
                  <div><b>학교:</b> {profile.school}</div>
                  <div><b>학년/반:</b> {profile.grade}-{profile.classRoom}</div>
                  <div><b>이름:</b> {profile.name}</div>
                  <div><b>날짜:</b> {activity.date}</div>
                  <div className="sm:col-span-3"><b>도서명:</b> {activity.bookTitle}</div>
                  <div><b>지은이:</b> {activity.author}</div>
                </div>

                {/* Content Rendering based on type */}
                <div className="space-y-4 text-xs sm:text-sm text-stone-800 pt-2">
                  
                  {/* Summary & Impression */}
                  {activity.type === 'summary_impression' && (
                    <div className="space-y-3">
                      {activity.content.motivation && (
                        <div className="border border-stone-200 p-3 rounded-lg bg-stone-50">
                          <b>[읽게 된 동기]</b> <p className="mt-1">{activity.content.motivation}</p>
                        </div>
                      )}
                      <div className="border border-stone-200 p-3 rounded-lg notebook-lines">
                        <b>[줄거리 요약]</b> <p className="mt-1 leading-relaxed">{activity.content.summary}</p>
                      </div>
                      {activity.content.impressiveScene && (
                        <div className="border border-stone-200 p-3 rounded-lg bg-stone-50">
                          <b>[가장 인상 깊은 장면]</b> <p className="mt-1">{activity.content.impressiveScene}</p>
                        </div>
                      )}
                      <div className="border border-stone-200 p-3 rounded-lg notebook-lines">
                        <b>[느낀 점 & 다짐]</b> <p className="mt-1 leading-relaxed">{activity.content.impression}</p>
                      </div>
                    </div>
                  )}

                  {/* Character Letter */}
                  {activity.type === 'character_letter' && (
                    <div className="border border-stone-300 p-5 rounded-xl space-y-3">
                      <div className="font-bold text-sm">To. {activity.content.receiver}</div>
                      <div className="notebook-lines py-2 leading-relaxed whitespace-pre-wrap">
                        {activity.content.letterBody}
                      </div>
                      <div className="text-right font-bold pt-2">{activity.content.letterSender}</div>
                    </div>
                  )}

                  {/* Rewrite Ending */}
                  {activity.type === 'rewrite_ending' && (
                    <div className="space-y-3">
                      <div className="border border-stone-200 p-3 rounded-lg bg-stone-50">
                        <b>[원래 결말]</b> <p className="mt-1">{activity.content.originalEnding}</p>
                      </div>
                      <div className="border border-stone-300 p-4 rounded-lg notebook-lines">
                        <b>[내가 상상한 새로운 결말]</b> <p className="mt-1 leading-relaxed">{activity.content.imaginedEnding}</p>
                      </div>
                    </div>
                  )}

                  {/* Scene Drawing */}
                  {activity.type === 'scene_drawing' && (
                    <div className="space-y-3 text-center">
                      <div className="font-bold text-sm">🎨 {activity.content.drawingTitle || '독서 감상화'}</div>
                      <div className="border-2 border-stone-400 rounded-xl overflow-hidden max-h-[300px] flex items-center justify-center p-2">
                        {activity.content.drawingImageData ? (
                          <img src={activity.content.drawingImageData} alt="감상화" className="max-h-[280px] object-contain" />
                        ) : (
                          <div className="p-8 text-stone-400">그림 미등록</div>
                        )}
                      </div>
                      {activity.content.drawingExplanation && (
                        <p className="text-xs text-stone-600 italic">설명: {activity.content.drawingExplanation}</p>
                      )}
                    </div>
                  )}

                  {/* Quiz */}
                  {activity.type === 'book_quiz' && (
                    <div className="space-y-2">
                      {activity.content.quizzes?.map((q, qIdx) => (
                        <div key={qIdx} className="border border-stone-200 p-3 rounded-lg">
                          <b>문제 {qIdx + 1}:</b> {q.question}
                          {q.options && <div className="text-xs mt-1 pl-2">보기: {q.options.join(' / ')}</div>}
                          <div className="text-rose-700 font-bold mt-1 text-xs">정답: {q.answer}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Golden words */}
                  {activity.type === 'golden_words' && (
                    <div className="space-y-3">
                      {activity.content.favoriteQuotes?.map((q, idx) => (
                        <div key={idx} className="border border-stone-200 p-3 rounded-lg bg-stone-50">
                          <b>[명문장]</b> "{q.quote}"
                          <p className="text-xs text-stone-600 mt-1">선정 까닭: {q.reason}</p>
                        </div>
                      ))}
                      <div className="grid grid-cols-2 gap-2">
                        {activity.content.vocabularies?.map((v, idx) => (
                          <div key={idx} className="border border-stone-200 p-2.5 rounded-lg text-xs">
                            <b>단어: {v.word}</b>
                            <p className="text-stone-600">뜻: {v.meaning}</p>
                            <p className="text-stone-800 mt-0.5">예문: "{v.mySentence}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interview */}
                  {activity.type === 'character_interview' && (
                    <div className="space-y-2">
                      <div className="font-bold">인터뷰 대상: {activity.content.intervieweeName}</div>
                      {activity.content.qaList?.map((qa, idx) => (
                        <div key={idx} className="border border-stone-200 p-3 rounded-lg text-xs space-y-1">
                          <p className="font-bold text-stone-900">Q{idx + 1}. {qa.question}</p>
                          <p className="text-stone-700 pl-2">A. {qa.answer}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Book Ad */}
                  {activity.type === 'book_ad' && (
                    <div className="border border-stone-300 p-4 rounded-xl text-center space-y-2">
                      <h4 className="font-bold text-base">"{activity.content.catchphrase}"</h4>
                      <p className="text-xs text-stone-600">추천 대상: {activity.content.targetReader}</p>
                      <div className="text-left text-xs pt-2 space-y-1 max-w-sm mx-auto">
                        <b>추천 이유:</b>
                        {activity.content.reasonsToRead?.map((r, i) => (
                          <div key={i}>• {r}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mind Map */}
                  {activity.type === 'mind_map' && (
                    <div className="border border-stone-300 p-4 rounded-xl space-y-3">
                      <div className="text-center font-bold">중심 주제: {activity.content.coreTheme}</div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {activity.content.branches?.map((b, i) => (
                          <div key={i} className="border border-stone-200 p-2 rounded">
                            <b className="block border-b pb-1 mb-1">{b.title}</b>
                            {b.items?.map((it, idx) => (
                              <div key={idx}>• {it}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Teacher Stamp Area */}
                <div className="border border-dashed border-stone-400 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <b>선생님 평가:</b> {activity.teacherComment || '참 잘했습니다.'}
                  </div>
                  <div className="text-rose-600 font-bold border border-rose-600 px-2 py-1 rounded-md text-[10px]">
                    💮 {activity.teacherStamp || '참 잘했어요'}
                  </div>
                </div>

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};
