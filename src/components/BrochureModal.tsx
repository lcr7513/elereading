import React from 'react';
import { 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  Sparkles, 
  School, 
  Award, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Share2,
  FileText
} from 'lucide-react';

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
}) => {
  if (!isOpen) return null;

  const handlePrintBrochure = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border-4 border-amber-300 overflow-hidden relative">
        
        {/* Top Floating Control Bar (No Print) */}
        <div className="bg-stone-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between no-print border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold text-stone-200">
              학교 제출 및 예산 품의용 1장 제품 소개서 (A4 브로슈어)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintBrochure}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>A4 브로슈어 인쇄 (PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Brochure Body (Form factor: Clean A4 Presentation) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-10 bg-amber-50/30 print:bg-white print:p-0">
          <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border-2 border-stone-200 shadow-sm print:border-none print:shadow-none print:p-4 space-y-6">
            
            {/* Header Ribbon */}
            <div className="border-b-4 border-orange-500 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 font-extrabold text-xs px-2.5 py-0.5 rounded-full mb-1">
                  <School className="w-3.5 h-3.5" />
                  <span>2026학년도 디지털 에듀테크 독서 교육 솔루션</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-jua text-stone-900 tracking-tight">
                  에듀트랙 초등학생 독서기록장 솔루션
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  "선생님의 독서 지도 업무는 1/10로, 학생들의 독서 흥미는 10배로!"
                </p>
              </div>

              <div className="text-right sm:border-l sm:border-stone-200 sm:pl-5 shrink-0">
                <span className="text-[11px] text-stone-400 block font-semibold">도입 문의 & 학교장터(S2B)</span>
                <span className="text-sm font-bold text-orange-600 font-mono">1544-READ (가칭)</span>
                <span className="text-[10px] text-stone-500 block">행정서류 일체 완비</span>
              </div>
            </div>

            {/* Value Proposition Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-center space-y-1">
                <div className="text-2xl">📒</div>
                <h4 className="font-bold text-stone-900 text-xs sm:text-sm">독서통장 마일리지</h4>
                <p className="text-[11px] text-stone-600">읽은 책과 쪽수를 저축하듯 기록하며 독서 성취감 극대화</p>
              </div>

              <div className="bg-teal-50/80 p-3.5 rounded-2xl border border-teal-200 text-center space-y-1">
                <div className="text-2xl">🎨</div>
                <h4 className="font-bold text-stone-900 text-xs sm:text-sm">9종 맞춤 독후활동</h4>
                <p className="text-[11px] text-stone-600">감상화, 만화, 퀴즈, 편지, 마인드맵 등 학년별 활동지 제공</p>
              </div>

              <div className="bg-purple-50/80 p-3.5 rounded-2xl border border-purple-200 text-center space-y-1">
                <div className="text-2xl">🤖</div>
                <h4 className="font-bold text-stone-900 text-xs sm:text-sm">AI 맞춤법 & 칭찬 코칭</h4>
                <p className="text-[11px] text-stone-600">아이의 글을 분석해 따뜻한 칭찬과 바른 맞춤법 돋보기 제공</p>
              </div>
            </div>

            {/* Core Features for Teachers & School Principal */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 border-l-4 border-amber-500 pl-2.5">
                🏫 학교 및 학급 도입 시 핵심 이점 (교직원 편의성)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>클릭 한 번으로 학급 포트폴리오 일괄 A4 인쇄</span>
                  </div>
                  <p className="text-stone-600 text-[11px] pl-5">
                    학기말이나 공개수업 때 전교생/학급 전체의 1년 독서 기록과 활동지를 정식 공문서 규격으로 원클릭 출력.
                  </p>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>원클릭 교사 확인 도장 & 일괄 피드백</span>
                  </div>
                  <p className="text-stone-600 text-[11px] pl-5">
                    종이 공책을 걷고 채점하는 수고 없이, 교사용 관리센터에서 학생별 활동지를 열람하고 도장과 코멘트 부여.
                  </p>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>모바일 & 태블릿 PWA 완벽 지원</span>
                  </div>
                  <p className="text-stone-600 text-[11px] pl-5">
                    학교 컴퓨터실(PC)뿐 아니라 집에서 태블릿/스마트폰으로 언제든 독서 기록 가능 (가정 연계 독서 교육).
                  </p>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>클라우드 영구 보관 & 데이터 유실 0%</span>
                  </div>
                  <p className="text-stone-600 text-[11px] pl-5">
                    종이 노트 분실 걱정 없이 안전한 클라우드 DB에 학년 진급 시까지 안전하게 누적 보관.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-stone-100 p-4 rounded-2xl border border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-stone-900 block text-sm">💡 도입 예산 및 라이선스 안내</span>
                <span className="text-stone-600">• 학급당 연간 30,000원 (학생 무제한 + 교사용 관리도구 + AI 첨삭 포함)</span>
                <span className="text-stone-500 block text-[11px]">• 학교 전체 패키지 도입 시 추가 할인 및 맞춤 학교 로고 적용</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs no-print active:scale-95 transition-transform"
              >
                라이선스 신청하기
              </button>
            </div>

            {/* Footer */}
            <div className="pt-2 text-center text-[10px] text-stone-400 border-t border-stone-200">
              초등학생 독서기록장 솔루션 • 에듀테크 기반 독서 교육 플랫폼 • 교육청 및 학교 예산 품의 적합 제품
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
