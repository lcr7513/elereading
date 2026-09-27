import React, { useState } from 'react';
import { 
  PieChart, 
  BarChart3, 
  Sparkles, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Compass, 
  BookOpen,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { BookEntry, GenreType, StudentProfile } from '../types';
import { GENRE_COLORS } from '../data/initialData';

interface ReadingAnalyticsProps {
  books: BookEntry[];
  profile: StudentProfile;
}

const ALL_GENRES: GenreType[] = [
  '동화·소설',
  '과학·수학',
  '위인·역사',
  '사회·문화',
  '시·동시',
  '예술·체육',
  '학습만화',
  '철학·인성',
  '기타'
];

export const ReadingAnalytics: React.FC<ReadingAnalyticsProps> = ({ books, profile }) => {
  // Self-diagnosis checklist state
  const [checklist, setChecklist] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: false,
    5: true,
  });

  const toggleChecklist = (id: number) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalBooks = books.length;
  const totalPages = books.reduce((acc, curr) => acc + (curr.pages || 0), 0);
  const avgPagesPerBook = totalBooks > 0 ? Math.round(totalPages / totalBooks) : 0;
  const highRatingCount = books.filter(b => b.rating === 5).length;
  const highRatingRatio = totalBooks > 0 ? Math.round((highRatingCount / totalBooks) * 100) : 0;

  // Genre distribution calculation
  const genreCounts: Record<string, number> = {};
  ALL_GENRES.forEach(g => { genreCounts[g] = 0; });
  books.forEach(b => {
    genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
  });

  // Most read genre
  const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
  const topGenre = sortedGenres[0]?.[1] > 0 ? sortedGenres[0][0] : '미정';

  // Monthly stats
  const monthlyCounts: Record<string, number> = {};
  books.forEach(b => {
    const monthKey = b.date.substring(0, 7); // YYYY-MM
    monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-black/20 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <PieChart className="w-3.5 h-3.5" />
              <span>에듀트랙 스마트 독서 진단</span>
              <span className="text-white/80">균형 잡힌 독서 포트폴리오</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-jua text-white tracking-wide">
              {profile.name} 어린이의 독서 습관 & 분야 분석 📊
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              어떤 분야의 책을 즐겨 읽었는지 살펴보고, 골고루 다양한 지식을 섭취할 수 있도록 안내합니다.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
            <span className="text-xs text-indigo-200 block font-medium">가장 좋아하는 분야</span>
            <div className="text-xl md:text-2xl font-jua text-yellow-300">
              {topGenre}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-2xs text-center space-y-1">
          <span className="text-xs font-bold text-stone-500 block">총 독서량</span>
          <div className="text-2xl font-jua text-indigo-600">{totalBooks}권</div>
          <span className="text-[11px] text-stone-400">목표 {profile.targetCount}권 중</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-2xs text-center space-y-1">
          <span className="text-xs font-bold text-stone-500 block">권당 평균 쪽수</span>
          <div className="text-2xl font-jua text-amber-600">{avgPagesPerBook}쪽</div>
          <span className="text-[11px] text-stone-400">총 {totalPages.toLocaleString()}쪽 독파</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-2xs text-center space-y-1">
          <span className="text-xs font-bold text-stone-500 block">인생 최고책(★5) 비율</span>
          <div className="text-2xl font-jua text-rose-600">{highRatingRatio}%</div>
          <span className="text-[11px] text-stone-400">{highRatingCount}권의 명작</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-stone-200 shadow-2xs text-center space-y-1">
          <span className="text-xs font-bold text-stone-500 block">예상 독서 누적시간</span>
          <div className="text-2xl font-jua text-teal-600">약 {Math.round(totalPages * 1.5 / 60)}시간</div>
          <span className="text-[11px] text-stone-400">쪽당 1.5분 기준</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Genre Balance Bar Charts (8 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs font-bold text-indigo-700">Genre Balance</span>
              <h3 className="text-xl font-jua text-stone-900">장르별 독서 균형도 🧭</h3>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              총 {totalBooks}권 분포
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {ALL_GENRES.map((g) => {
              const count = genreCounts[g] || 0;
              const percent = totalBooks > 0 ? Math.round((count / totalBooks) * 100) : 0;
              const colors = GENRE_COLORS[g] || { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' };

              return (
                <div key={g} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800 flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${colors.bg.replace('50', '500')}`} />
                      {g}
                    </span>
                    <span className="font-mono text-stone-600 font-bold">
                      {count}권 ({percent}%)
                    </span>
                  </div>

                  <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden p-0.5 border border-stone-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent > 0 ? colors.bg.replace('50', '500') : 'bg-transparent'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Teacher AI / Pedagogical Advice Box */}
          <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-200 flex items-start gap-3 mt-4">
            <Lightbulb className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-stone-700 space-y-1">
              <span className="font-bold text-indigo-900 block">선생님의 맞춤 독서 코칭</span>
              <p className="leading-relaxed">
                {profile.name} 어린이는 <b className="text-indigo-900">{topGenre}</b> 분야를 중심으로 매우 깊이 있는 독서 활동을 이어가고 있습니다! 
                앞으로 <b className="text-emerald-800">과학·수학</b>이나 <b className="text-blue-800">위인·역사</b> 관련 책도 함께 골고루 읽는다면 지식과 상상력이 더욱 균형 있게 자라날 것입니다 🌱
              </p>
            </div>
          </div>
        </div>

        {/* Right: Monthly Timeline & Self-Checklist (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Monthly Trend */}
          <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-xs font-bold text-purple-700">Monthly Trend</span>
                <h3 className="text-xl font-jua text-stone-900">월별 독서량 추이 📈</h3>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {Object.keys(monthlyCounts).length === 0 ? (
                <p className="text-xs text-stone-400 py-4 text-center">기록된 월별 데이터가 없습니다.</p>
              ) : (
                Object.entries(monthlyCounts).map(([month, count]) => (
                  <div key={month} className="flex items-center justify-between text-xs bg-stone-50 p-2.5 rounded-xl">
                    <span className="font-mono font-bold text-stone-700">{month}월</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 text-amber-500">
                        {'📚'.repeat(Math.min(count, 8))}
                      </div>
                      <span className="font-bold text-purple-700">{count}권</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Self-Diagnosis Checklist */}
          <div className="bg-white p-6 rounded-3xl border-2 border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-700">Self Diagnosis</span>
                <h3 className="text-xl font-jua text-stone-900">나의 바른 독서 습관 점검표 🌟</h3>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              {[
                { id: 1, text: '매일 일정한 시간(예: 잠들기 전 20분)에 책을 읽나요?' },
                { id: 2, text: '책을 읽고 난 뒤 마음에 드는 문장을 기록하거나 소감을 남기나요?' },
                { id: 3, text: '모르는 낱말이 나오면 뜻을 찾아보거나 어른께 여쭤보나요?' },
                { id: 4, text: '내가 좋아하는 분야뿐만 아니라 다양한 장르의 책에 도전하나요?' },
                { id: 5, text: '책을 소중히 다루고 제자리에 잘 정리정돈 하나요?' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklist(item.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 text-xs ${
                    checklist[item.id]
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-500'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    checklist[item.id] ? 'text-emerald-600' : 'text-stone-300'
                  }`} />
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
