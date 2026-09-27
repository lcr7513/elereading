import React from 'react';
import { Cloud, CheckCircle2, RefreshCw, AlertCircle, Database, Lock } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

interface FirebaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  syncError: string | null;
  onManualSync?: () => void;
}

export const FirebaseStatusModal: React.FC<FirebaseStatusModalProps> = ({
  isOpen,
  onClose,
  isSyncing,
  lastSyncedAt,
  syncError,
  onManualSync
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-7 shadow-2xl border-2 border-emerald-400 space-y-5 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-jua text-xl text-stone-900">클라우드 DB (Firebase) 연동 현황</h3>
              <p className="text-xs text-stone-500 font-bold">Google Cloud Firestore 실시간 동기화</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl"
          >
            ✕
          </button>
        </div>

        {/* Status Card */}
        <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              클라우드 실시간 동기화 활성화됨
            </span>
            <span className="bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold text-[11px]">
              정상 연결
            </span>
          </div>
          <p className="text-stone-600 text-xs leading-relaxed">
            학생들이 어느 기기(스마트폰, 태블릿, PC)에서 독서 기록이나 활동지를 작성해도
            교사 관리 화면 및 모든 학생 화면에 <strong>실시간(Realtime)</strong>으로 즉시 반영됩니다.
          </p>
        </div>

        {/* Sync Info */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-stone-500 block mb-0.5">Firebase 프로젝트 ID</span>
            <span className="font-bold text-stone-800 truncate block">{firebaseConfig.projectId || '연결됨'}</span>
          </div>
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <span className="text-stone-500 block mb-0.5">최근 동기화 시간</span>
            <span className="font-bold text-emerald-700">
              {lastSyncedAt ? lastSyncedAt.toLocaleTimeString('ko-KR') : '방금 전'}
            </span>
          </div>
        </div>

        {syncError && (
          <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{syncError}</span>
          </div>
        )}

        {/* Guide for User */}
        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-xs text-stone-700 space-y-1.5">
          <p className="font-bold text-amber-900 flex items-center gap-1">
            <Cloud className="w-3.5 h-3.5" />
            다른 컴퓨터나 스마트폰에서 사용하려면?
          </p>
          <p className="text-[11px] leading-relaxed text-stone-600">
            상단의 <strong>공유용 링크</strong>로 접속하시면 기기 구분 없이 모든 학생과 선생님이 동일한 클라우드 데이터베이스를 공유하여 사용할 수 있습니다.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {onManualSync && (
            <button
              type="button"
              onClick={onManualSync}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
