import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  MessageSquareHeart, 
  BookmarkCheck, 
  Lightbulb, 
  AlertCircle,
  X,
  Crown
} from 'lucide-react';
import { ActivityData, AiReviewFeedback, MembershipStatus } from '../types';
import { generateAiFeedback } from '../services/aiTutorService';

interface AiReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: ActivityData;
  membership: MembershipStatus;
  onOpenUpgradeModal: () => void;
}

export const AiReviewModal: React.FC<AiReviewModalProps> = ({
  isOpen,
  onClose,
  activity,
  membership,
  onOpenUpgradeModal,
}) => {
  if (!isOpen) return null;

  const feedback: AiReviewFeedback = generateAiFeedback(activity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border-4 border-amber-300 max-h-[92vh] overflow-y-auto relative text-stone-800 space-y-4">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                AI 독서 첨삭 & 생각 돋보기
              </span>
              {membership.tier === 'free' && (
                <span className="text-[10px] font-bold bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
                  무료 체험 모드
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-black font-jua text-stone-900 mt-0.5">
              『{activity.bookTitle}』 맞춤형 독서 코칭 📖
            </h3>
          </div>
        </div>

        {/* 1. Warm Praise & Encouragement */}
        <div className="bg-amber-50/80 p-4 rounded-2xl border-2 border-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
              <MessageSquareHeart className="w-4 h-4 text-amber-600" />
              선생님 & AI 칭찬 피드백
            </span>
            <span className="text-xs font-bold px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded-full">
              {feedback.encouragementBadge}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
            {feedback.praise}
          </p>
        </div>

        {/* 2. Grammar & Spacing Check */}
        <div className="space-y-2">
          <h4 className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
            <BookmarkCheck className="w-4 h-4 text-teal-600" />
            맞춤법 & 띄어쓰기 돋보기
          </h4>
          <div className="space-y-2">
            {feedback.grammarFixes.map((fix, idx) => (
              <div key={idx} className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <span className="text-stone-500 line-through">{fix.original}</span>
                  <span className="text-stone-400">➜</span>
                  <span className="text-teal-700 font-extrabold">{fix.correction}</span>
                </div>
                <p className="text-stone-600 text-[11px]">{fix.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Thinking Questions for deeper growth */}
        <div className="space-y-2">
          <h4 className="font-bold text-stone-800 text-xs flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-orange-600" />
            생각을 넓히는 독서 질문 (생각 더하기)
          </h4>
          <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-200 space-y-2">
            {feedback.deepThinkingQuestions.map((q, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                <span className="w-4 h-4 rounded-full bg-orange-400 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="font-medium leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Banner for Free Users */}
        {membership.tier === 'free' && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-md">
            <div>
              <div className="flex items-center gap-1 text-xs font-black">
                <Crown className="w-3.5 h-3.5 text-yellow-300" />
                <span>AI 무제한 첨삭 & 학교 패키지</span>
              </div>
              <p className="text-[11px] text-amber-100">모든 독후활동에 실시간 AI 첨삭을 무제한으로 받아보세요!</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenUpgradeModal();
              }}
              className="px-3 py-1.5 bg-white text-orange-600 font-extrabold text-xs rounded-xl shadow-xs shrink-0 hover:bg-orange-50 active:scale-95"
            >
              업그레이드
            </button>
          </div>
        )}

        {/* Footer Close */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs transition-colors"
          >
            확인 및 닫기
          </button>
        </div>

      </div>
    </div>
  );
};
