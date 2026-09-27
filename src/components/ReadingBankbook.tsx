import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  PlusCircle, 
  Sparkles, 
  Award, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  FileText,
  Flame,
  ArrowUpDown,
  BookMarked,
  LayoutGrid,
  List
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BookEntry, GenreType, StampType, StudentProfile } from '../types';
import { GENRE_COLORS } from '../data/initialData';

interface ReadingBankbookProps {
  books: BookEntry[];
  profile: StudentProfile;
  onAddBook: (book: Omit<BookEntry, 'id' | 'hasActivity'>) => void;
  onUpdateBook: (book: BookEntry) => void;
  onDeleteBook: (id: string) => void;
  onOpenActivityForBook: (book: BookEntry) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

const STAMPS: StampType[] = [
  '참 잘했어요',
  '독서왕',
  '대단해요!',
  '최고예요!',
  '노력상',
  '반짝별',
  '하트뿜뿜',
  '미확인'
];

const GENRES: GenreType[] = [
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

export const ReadingBankbook: React.FC<ReadingBankbookProps> = ({
  books,
  profile,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onOpenActivityForBook,
  isAddModalOpen,
  setIsAddModalOpen
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'rating' | 'pages'>('date_asc');
  const [viewStyle, setViewStyle] = useState<'cards' | 'table'>('cards');
  const [editingBook, setEditingBook] = useState<BookEntry | null>(null);
  const [bookToDelete, setBookToDelete] = useState<BookEntry | null>(null);

  // Form State for Add / Edit Modal
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [illustrator, setIllustrator] = useState('');
  const [publisher, setPublisher] = useState('');
  const [pages, setPages] = useState(100);
  const [genre, setGenre] = useState<GenreType>('동화·소설');
  const [rating, setRating] = useState(5);
  const [oneLineReview, setOneLineReview] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [stamp, setStamp] = useState<StampType>('참 잘했어요');

  const totalPages = books.reduce((acc, curr) => acc + (curr.pages || 0), 0);
  const averageRating = books.length ? (books.reduce((acc, curr) => acc + curr.rating, 0) / books.length).toFixed(1) : '0.0';
  const totalPoints = totalPages + books.length * 10;

  const handleOpenAdd = () => {
    setEditingBook(null);
    setTitle('');
    setAuthor('');
    setIllustrator('');
    setPublisher('');
    setPages(120);
    setGenre('동화·소설');
    setRating(5);
    setOneLineReview('');
    setDate(new Date().toISOString().split('T')[0]);
    setStamp('참 잘했어요');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (b: BookEntry) => {
    setEditingBook(b);
    setTitle(b.title);
    setAuthor(b.author);
    setIllustrator(b.illustrator || '');
    setPublisher(b.publisher);
    setPages(b.pages);
    setGenre(b.genre);
    setRating(b.rating);
    setOneLineReview(b.oneLineReview);
    setDate(b.date);
    setStamp(b.stamp);
    setIsAddModalOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingBook) {
      onUpdateBook({
        ...editingBook,
        title,
        author,
        illustrator,
        publisher,
        pages,
        genre,
        rating,
        oneLineReview,
        date,
        stamp,
      });
    } else {
      onAddBook({
        title,
        author,
        illustrator,
        publisher,
        pages,
        genre,
        rating,
        oneLineReview,
        date,
        stamp,
      });
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }
    setIsAddModalOpen(false);
  };

  const handleCycleStamp = (b: BookEntry) => {
    const currentIndex = STAMPS.indexOf(b.stamp);
    const nextStamp = STAMPS[(currentIndex + 1) % (STAMPS.length - 1)];
    onUpdateBook({
      ...b,
      stamp: nextStamp
    });
  };

  // Filter & Sort books
  const filteredBooks = books.filter((b) => {
    const matchSearch = 
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.oneLineReview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGenre = selectedGenre === 'all' || b.genre === selectedGenre;
    return matchSearch && matchGenre;
  }).sort((a, b) => {
    if (sortBy === 'date_asc') return a.date.localeCompare(b.date);
    if (sortBy === 'date_desc') return b.date.localeCompare(a.date);
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'pages') return b.pages - a.pages;
    return 0;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* EduTrack Passbook Header Card */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-black/20 text-amber-200 text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full mb-1.5">
              <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>에듀트랙 독서 마일리지 통장</span>
              <span className="font-mono text-white/80">NO. ET-{profile.grade}0{profile.classRoom}-{profile.studentNumber}</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-jua text-white tracking-wide">
              {profile.name} 어린이의 독서 통장 📒
            </h2>
            <p className="text-amber-100 text-xs sm:text-sm mt-0.5">
              읽은 책을 차곡차곡 기록하고 마일리지를 모아 독서왕에 도전해보세요!
            </p>
          </div>

          <button
            id="bankbook-add-entry-btn"
            type="button"
            onClick={handleOpenAdd}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-stone-900 font-extrabold px-4 sm:px-5 py-2.5 rounded-xl sm:rounded-2xl shadow-md transition-all active:scale-95 text-sm cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>새 책 기록하기</span>
          </button>
        </div>

        {/* Mileage Summary Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/20 relative z-10">
          <div className="bg-black/20 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center backdrop-blur-xs">
            <span className="text-[11px] sm:text-xs text-amber-200 block font-medium">누적 권수</span>
            <div className="text-lg sm:text-2xl font-jua text-white mt-0.5">
              {books.length} <span className="text-xs font-normal">권</span>
            </div>
          </div>

          <div className="bg-black/20 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center backdrop-blur-xs">
            <span className="text-[11px] sm:text-xs text-amber-200 block font-medium">총 읽은 쪽수</span>
            <div className="text-lg sm:text-2xl font-jua text-white mt-0.5">
              {totalPages.toLocaleString()} <span className="text-xs font-normal">쪽</span>
            </div>
          </div>

          <div className="bg-black/20 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center backdrop-blur-xs">
            <span className="text-[11px] sm:text-xs text-amber-200 block font-medium">독서 마일리지</span>
            <div className="text-lg sm:text-2xl font-jua text-yellow-300 mt-0.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{totalPoints.toLocaleString()}</span> <span className="text-xs font-normal text-white">P</span>
            </div>
          </div>

          <div className="bg-black/20 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 text-center backdrop-blur-xs">
            <span className="text-[11px] sm:text-xs text-amber-200 block font-medium">평균 만족도</span>
            <div className="text-lg sm:text-2xl font-jua text-white mt-0.5 flex items-center justify-center gap-1 text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>{averageRating}</span> <span className="text-xs font-normal text-white">/ 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter, Search & View Mode Switcher */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto flex-1">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="책 제목, 지은이, 출판사 검색..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:bg-white focus:outline-none font-medium text-stone-700"
          >
            <option value="all">전체 분야 ({books.length})</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g} ({books.filter((b) => b.genre === g).length})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
          {/* Card / Table View Toggle */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setViewStyle('cards')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewStyle === 'cards'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="카드형 목록"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>카드형</span>
            </button>
            <button
              type="button"
              onClick={() => setViewStyle('table')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewStyle === 'table'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="표 형식"
            >
              <List className="w-3.5 h-3.5" />
              <span>표로 보기</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs font-bold bg-stone-100 border border-stone-200 rounded-xl focus:outline-none text-stone-700"
            >
              <option value="date_asc">읽은 순</option>
              <option value="date_desc">최신 순</option>
              <option value="rating">별점 순</option>
              <option value="pages">쪽수 순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book List Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-stone-200 shadow-sm overflow-hidden">
        <div className="p-3.5 sm:p-4 bg-amber-50/70 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
            <h3 className="font-jua text-stone-900 text-base sm:text-lg">
              나의 독서 기록 목록 ({filteredBooks.length}권)
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">
            💡 확인 도장을 누르면 스탬프 종류를 변경할 수 있습니다.
          </span>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-stone-500 space-y-3">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
            <p className="font-bold text-stone-700 text-sm sm:text-base">해당하는 독서 기록이 없습니다.</p>
            <p className="text-xs text-stone-400">새 책을 등록하거나 검색어를 변경해보세요.</p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-amber-600 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>새 책 기록하기</span>
            </button>
          </div>
        ) : viewStyle === 'cards' ? (
          /* Mobile-First Card View */
          <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredBooks.map((book, index) => {
              const genreColor = GENRE_COLORS[book.genre] || { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' };

              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    {/* Header: Number, Date, Genre */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-xs text-stone-400 font-mono">{book.date}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${genreColor.bg} ${genreColor.text} ${genreColor.border}`}>
                        {book.genre}
                      </span>
                    </div>

                    {/* Title & Author */}
                    <div>
                      <h4 className="text-base font-bold text-stone-900 line-clamp-1 leading-snug">
                        {book.title}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                        {book.author}
                        {book.illustrator && ` (그림: ${book.illustrator})`} · {book.publisher} · <span className="font-mono text-stone-700 font-semibold">{book.pages}p</span>
                      </p>
                    </div>

                    {/* Star Rating & Stamp */}
                    <div className="flex items-center justify-between bg-stone-50/80 p-2 rounded-xl border border-stone-100">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < book.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCycleStamp(book)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-rose-400 text-rose-600 font-extrabold text-[11px] bg-rose-50 shadow-2xs active:scale-95 transition-transform"
                        title="터치하여 도장 변경"
                      >
                        <span>💮</span>
                        <span>{book.stamp}</span>
                      </button>
                    </div>

                    {/* One Line Thought */}
                    {book.oneLineReview && (
                      <p className="text-xs text-stone-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 italic line-clamp-2">
                        "{book.oneLineReview}"
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                    {book.hasActivity ? (
                      <button
                        type="button"
                        onClick={() => onOpenActivityForBook(book)}
                        className="flex-1 py-2 px-3 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>활동지 보기</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenActivityForBook(book)}
                        className="flex-1 py-2 px-3 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>활동지 쓰기</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(book)}
                      className="p-2 text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors active:scale-95"
                      title="수정"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookToDelete(book)}
                      className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors active:scale-95 cursor-pointer"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Desktop / Spreadsheet Table View */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-stone-100 text-stone-700 text-xs font-bold uppercase tracking-wider border-b border-stone-200">
                  <th className="py-2.5 px-3 text-center w-12">번호</th>
                  <th className="py-2.5 px-3 w-24">읽은 날짜</th>
                  <th className="py-2.5 px-4">도서명</th>
                  <th className="py-2.5 px-3 w-28">지은이</th>
                  <th className="py-2.5 px-3 w-24">출판사</th>
                  <th className="py-2.5 px-3 text-center w-20">분야</th>
                  <th className="py-2.5 px-2 text-center w-16">쪽수</th>
                  <th className="py-2.5 px-3 text-center w-24">별점</th>
                  <th className="py-2.5 px-4">한 줄 생각</th>
                  <th className="py-2.5 px-3 text-center w-24">도장</th>
                  <th className="py-2.5 px-3 text-center w-24">활동지</th>
                  <th className="py-2.5 px-2 text-center w-16">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800 text-xs">
                {filteredBooks.map((book, index) => {
                  const genreColor = GENRE_COLORS[book.genre] || { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200' };
                  return (
                    <tr key={book.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-stone-500">{index + 1}</td>
                      <td className="py-2.5 px-3 text-stone-600 font-mono whitespace-nowrap">{book.date}</td>
                      <td className="py-2.5 px-4 font-bold text-stone-900">{book.title}</td>
                      <td className="py-2.5 px-3 text-stone-600">{book.author}</td>
                      <td className="py-2.5 px-3 text-stone-600">{book.publisher}</td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${genreColor.bg} ${genreColor.text} ${genreColor.border}`}>
                          {book.genre}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-semibold">{book.pages}p</td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-0.5 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < book.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-stone-700 max-w-xs truncate italic">
                        "{book.oneLineReview || '한 줄 소감 없음'}"
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleCycleStamp(book)}
                          className="inline-flex items-center justify-center px-2 py-0.5 rounded-full border border-rose-500 text-rose-600 font-bold text-[10px] bg-rose-50 active:scale-95 transition-transform"
                        >
                          💮 {book.stamp}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onOpenActivityForBook(book)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold ${
                            book.hasActivity
                              ? 'bg-teal-50 text-teal-700 border border-teal-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {book.hasActivity ? '보기' : '쓰기'}
                        </button>
                      </td>
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(book)}
                            className="p-1 text-stone-400 hover:text-stone-700 rounded"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setBookToDelete(book)}
                            className="p-1 text-stone-400 hover:text-rose-600 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Book Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border-2 border-amber-300 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
              <h3 className="text-lg sm:text-xl font-jua text-stone-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <span>{editingBook ? '독서 기록 수정하기' : '새 책 독서통장 기록하기'}</span>
              </h3>
              <span className="text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full font-bold">
                에듀트랙 양식
              </span>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    도서명 (책 제목) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none font-semibold text-stone-900 text-base"
                    placeholder="예: 마당을 나온 암탉"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    글쓴이 (지은이) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-base"
                    placeholder="예: 황선미"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">그린이 (선택)</label>
                  <input
                    type="text"
                    value={illustrator}
                    onChange={(e) => setIllustrator(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-base"
                    placeholder="예: 김환영"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    출판사 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-base"
                    placeholder="예: 사계절"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">읽은 날짜</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">독서 분야 (장르)</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value as GenreType)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none text-base"
                  >
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">읽은 쪽수 (페이지)</label>
                  <input
                    type="number"
                    min="1"
                    max="2000"
                    required
                    value={pages}
                    onChange={(e) => setPages(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono text-base"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">나의 별점 평가</label>
                <div className="flex items-center gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 hover:scale-125 active:scale-95 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-700 ml-1">
                    {rating === 5 && '🌟 최고예요!'}
                    {rating === 4 && '👍 재미있어요!'}
                    {rating === 3 && '🙂 보통이에요'}
                    {rating === 2 && '🤔 조금 아쉬워요'}
                    {rating === 1 && '😅 어려웠어요'}
                  </span>
                </div>
              </div>

              {/* One line review */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  한 줄 생각 / 인상 깊은 한마디 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={oneLineReview}
                  onChange={(e) => setOneLineReview(e.target.value)}
                  placeholder="책을 읽고 마음에 와닿은 생각이나 느낌을 짧게 적어보세요."
                  className="w-full px-3.5 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none text-base"
                />
              </div>

              {/* Stamp Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">확인 도장 스탬프</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {STAMPS.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStamp(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all ${
                        stamp === st
                          ? 'border-rose-500 bg-rose-50 text-rose-600 scale-105 shadow-xs'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      💮 {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-sm"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-200 transition-all active:scale-95"
                >
                  {editingBook ? '수정 완료' : '독서통장에 기록 ✍️'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Delete Confirmation Modal */}
      {bookToDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-rose-300 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-jua text-lg text-stone-900">독서 기록 삭제</h4>
                <p className="text-xs text-rose-600 font-bold">기록을 통장에서 삭제하시겠습니까?</p>
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs space-y-1">
              <p className="font-bold text-stone-900 text-sm">📖 {bookToDelete.title}</p>
              <p className="text-stone-600">지은이: {bookToDelete.author} • {bookToDelete.pages}쪽</p>
              <p className="text-stone-500 text-[11px]">읽은 날: {bookToDelete.date}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBookToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-bold text-xs"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteBook(bookToDelete.id);
                  setBookToDelete(null);
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
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
