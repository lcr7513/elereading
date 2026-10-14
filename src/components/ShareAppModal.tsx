import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode, Smartphone, X, ExternalLink, Globe } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  if (!isOpen) return null;

  // The official public shared URL
  const publicUrl = 'https://ais-pre-d7ieuz6mbigtuvrtbq7anj-657342148388.asia-northeast1.run.app';
  
  // Use public URL so students / teachers phones don't accidentally open internal iframe localhost ports
  const targetUrl = publicUrl;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(targetUrl);
      } else {
        const input = document.createElement('input');
        input.value = targetUrl;
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
          text: '핸드폰에 설치해서 사용하는 초등학생 맞춤형 독서기록장 어플입니다.',
          url: targetUrl,
        });
      } catch (e) {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-300 relative text-stone-800">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-3">
          <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
            <QrCode className="w-7 h-7" />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-stone-900 font-jua">
            핸드폰으로 앱 열기 & QR 접속
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            스마트폰 기본 카메라로 아래 QR 코드를 비추면 즉시 접속됩니다!
          </p>
        </div>

        {/* SVG Native High-Res QR Code Container */}
        <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 flex flex-col items-center justify-center mb-3 shadow-inner">
          <div className="bg-white p-3.5 rounded-2xl shadow-sm border-2 border-stone-100 flex items-center justify-center">
            <QRCodeSVG
              value={targetUrl}
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-stone-700 font-bold">
            <Smartphone className="w-4 h-4 text-orange-600" />
            <span>기본 카메라로 비추면 노란색 링크 창이 뜹니다</span>
          </div>
        </div>

        {/* URL Link Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-600 flex items-center justify-between">
            <span>공유 접속 주소</span>
            <span className="text-[10px] text-emerald-600 font-normal">공개 서버 정상 작동 중</span>
          </label>
          <div className="flex items-center gap-2 bg-stone-100 p-2 rounded-xl border border-stone-200">
            <input
              type="text"
              readOnly
              value={targetUrl}
              className="bg-transparent text-[11px] font-mono text-stone-700 flex-1 outline-none px-1 select-all overflow-hidden text-ellipsis"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer ${
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
            className="py-2.5 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>카톡/문자로 공유</span>
          </button>

          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors text-center"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>새 탭에서 직접 열기</span>
          </a>
        </div>

        {/* Tip for School Wi-Fi */}
        <p className="text-[10px] text-stone-400 text-center mt-2.5">
          💡 학교 Wi-Fi에서 접속이 막힐 경우, 스마트폰 LTE/5G 데이터로 접속해 보세요.
        </p>

      </div>
    </div>
  );
};
