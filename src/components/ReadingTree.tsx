import React, { useState } from 'react';
import { 
  TreePine, 
  Sparkles, 
  Award, 
  Star, 
  CheckCircle, 
  Lock, 
  Info,
  Calendar,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookEntry, ReadingMilestone, StudentProfile } from '../types';
import { readingMilestones } from '../data/initialData';

interface ReadingTreeProps {
  books: BookEntry[];
  profile: StudentProfile;
}

export const ReadingTree: React.FC<ReadingTreeProps> = ({ books, profile }) => {
  const [selectedBookIndex, setSelectedBookIndex] = useState<number | null>(null);
  const targetGoal = profile.targetCount || 50;
  const currentCount = books.length;
  const progressRate = Math.min(100, Math.round((currentCount / targetGoal) * 100));

  const handleCelebrateBadge = (milestone: ReadingMilestone) => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const selectedBook = selectedBookIndex !== null && selectedBookIndex < books.length ? books[selectedBookIndex] : null;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-black/20 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <TreePine className="w-3.5 h-3.5" />
              <span>에듀트랙 독서 칭찬 나무</span>
              <span className="text-white/80">목표 {targetGoal}권</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-jua text-white tracking-wide">
              쑥쑥 자라나는 나의 독서 나무 🌳
            </h2>
            <p className="text-emerald-100 text-sm mt-1">
              책을 한 권씩 읽을 때마다 탐스러운 지혜의 열매가 열리고, 특별한 칭찬 스티커 뱃지가 잠금 해제됩니다!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
            <span className="text-xs text-emerald-200 block font-medium">현재 달성률</span>
            <div className="text-2xl md:text-3xl font-jua text-yellow-300">
              {progressRate}% <span className="text-sm font-normal text-white">({currentCount}/{targetGoal}권)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Reading Tree Board */}
      <div className="bg-gradient-to-b from-sky-50 via-amber-50/40 to-emerald-50/60 p-6 md:p-10 rounded-3xl border-2 border-emerald-300 shadow-md relative overflow-hidden">
        {/* Background Clouds & Sun */}
        <div className="absolute top-4 right-8 text-4xl animate-pulse select-none">☀️</div>
        <div className="absolute top-8 left-12 text-3xl opacity-60 select-none">☁️</div>
        <div className="absolute top-16 right-36 text-2xl opacity-40 select-none">☁️</div>

        <div className="text-center max-w-xl mx-auto mb-6 relative z-10">
          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Reading Fruit Tree Board
          </span>
          <h3 className="text-2xl font-jua text-stone-900 mt-1">
            {profile.name} 어린이의 {targetGoal}권 독서 열매 동산
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            열매를 클릭하면 읽은 책의 정보를 확인할 수 있습니다.
          </p>
        </div>

        {/* Tree Canopy & Fruit Grid */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Tree Trunk Base Illustration */}
          <div className="w-16 h-28 bg-gradient-to-b from-amber-800 to-amber-950 mx-auto rounded-b-xl shadow-md -mb-4 relative z-0">
            <div className="w-24 h-5 bg-emerald-700/60 rounded-full mx-auto -bottom-2 absolute left-1/2 -translate-x-1/2 blur-xs" />
          </div>

          {/* Fruit Grid Canvas */}
          <div className="bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-green-600/20 backdrop-blur-xs p-6 sm:p-8 rounded-[40px] border-4 border-emerald-300 shadow-inner relative z-10">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 sm:gap-3">
              {Array.from({ length: targetGoal }).map((_, index) => {
                const bookNum = index + 1;
                const isRead = index < books.length;
                const currentBook = isRead ? books[index] : null;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      if (isRead) {
                        setSelectedBookIndex(index);
                      }
                    }}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center p-1 transition-all duration-300 group ${
                      isRead
                        ? 'bg-gradient-to-tr from-rose-500 via-red-500 to-amber-400 text-white shadow-md shadow-rose-200 hover:scale-115 hover:z-20 cursor-pointer'
                        : 'bg-emerald-100/60 border border-dashed border-emerald-300 text-emerald-700/60 hover:bg-emerald-100'
                    }`}
                  >
                    {isRead ? (
                      <>
                        {/* Leaf Stem */}
                        <span className="absolute -top-1.5 right-1.5 text-[10px] text-green-700">🍃</span>
                        <span className="font-jua text-sm sm:text-base leading-none font-bold text-white drop-shadow-xs">
                          {bookNum}
                        </span>
                        <span className="text-[9px] font-bold text-amber-100 leading-none mt-0.5 truncate max-w-full px-0.5">
                          {currentBook?.rating ? '★'.repeat(currentBook.rating) : '🍎'}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] text-emerald-600 font-bold opacity-60">
                          {bookNum}
                        </span>
                        <span className="text-xs opacity-40">🌱</span>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Book Quick Popover Modal */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-300 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍎</span>
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      독서 열매 NO. {(selectedBookIndex ?? 0) + 1}
                    </span>
                    <h4 className="font-jua text-lg text-stone-900 mt-0.5">{selectedBook.title}</h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBookIndex(null)}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs text-stone-700">
                <div className="flex items-center justify-between bg-stone-50 p-2 rounded-xl">
                  <span><b>글쓴이:</b> {selectedBook.author}</span>
                  <span><b>출판사:</b> {selectedBook.publisher}</span>
                </div>
                <div className="flex items-center justify-between bg-stone-50 p-2 rounded-xl">
                  <span><b>읽은 날짜:</b> {selectedBook.date}</span>
                  <span className="font-bold text-amber-600">★ {selectedBook.rating}.0 / 5.0</span>
                </div>
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-1">한 줄 소감</span>
                  <p className="italic text-stone-800">"{selectedBook.oneLineReview}"</p>
                </div>
                <div className="text-center pt-2">
                  <span className="inline-block px-3 py-1 bg-rose-50 border border-rose-300 text-rose-600 font-bold rounded-full text-xs">
                    💮 확인 도장: {selectedBook.stamp}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={() => setSelectedBookIndex(null)}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Milestone Badges & Praise Stickers Section */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-700">에듀트랙 독서 칭호 & 마일스톤</span>
            <h3 className="text-xl font-jua text-stone-900">영예의 독서 칭찬 뱃지 모음함 🏆</h3>
          </div>
          <span className="text-xs text-stone-500">
            목표 권수에 도달하면 화려한 뱃지가 획득됩니다!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
          {readingMilestones.map((milestone) => {
            const isUnlocked = currentCount >= milestone.requiredBooks;

            return (
              <div
                key={milestone.level}
                onClick={() => isUnlocked && handleCelebrateBadge(milestone)}
                className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden flex flex-col justify-between ${
                  isUnlocked
                    ? 'border-amber-300 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-md hover:scale-102 cursor-pointer'
                    : 'border-stone-200 bg-stone-50/70 opacity-60'
                }`}
              >
                {/* Top Badge Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs ${
                    isUnlocked ? `bg-gradient-to-tr ${milestone.color} text-white` : 'bg-stone-200 text-stone-400'
                  }`}>
                    {isUnlocked ? milestone.badge : <Lock className="w-5 h-5 text-stone-400" />}
                  </div>

                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    isUnlocked
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-stone-200 text-stone-500'
                  }`}>
                    {milestone.requiredBooks}권 달성
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <h4 className="font-jua text-base text-stone-900">
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>

                {/* Status bottom footer */}
                <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
                  {isUnlocked ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>달성 완료! (클릭 시 축하)</span>
                    </span>
                  ) : (
                    <span className="text-stone-400 font-medium">
                      앞으로 {milestone.requiredBooks - currentCount}권 남음
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
