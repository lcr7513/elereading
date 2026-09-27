import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode, Smartphone, X, ExternalLink } from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-d7ieuz6mbigtuvrtbq7anj-657342148388.asia-northeast1.run.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(currentUrl)}&margin=10`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const input = document.createElement('input');
        input.value = currentUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: '초등학생 독서기록장',
          text: '핸드폰에 설치해서 사용하는 초등학생 맞춤형 독서기록장 앱입니다.',
          url: currentUrl,
        });
      } catch (e) {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-200 relative text-stone-800">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
            <QrCode className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-stone-900 font-jua">
            핸드폰으로 앱 열기 & 공유
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            스마트폰 카메라로 아래 QR 코드를 비추면 즉시 접속됩니다!
          </p>
        </div>

        {/* QR Code Container */}
        <div className="bg-amber-50/60 rounded-2xl p-3 sm:p-4 border border-amber-200 flex flex-col items-center justify-center mb-3">
          <div className="bg-white p-2.5 rounded-2xl shadow-xs border border-stone-200">
            <img
              src={qrCodeUrl}
              alt="독서기록장 접속 QR코드"
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-lg object-contain"
            />
          </div>
          <p className="text-[11px] text-stone-600 font-semibold mt-2 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5 text-orange-600" />
            스마트폰 기본 카메라로 비추면 바로 열려요
          </p>
        </div>

        {/* URL Link Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-600">앱 접속 주소 (URL)</label>
          <div className="flex items-center gap-2 bg-stone-100 p-2 rounded-xl border border-stone-200">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="bg-transparent text-xs font-mono text-stone-700 flex-1 outline-none px-2 select-all overflow-hidden text-ellipsis"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>복사됨!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>복사</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleNativeShare}
            className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>카톡/문자로 보내기</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-3 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-xl transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
