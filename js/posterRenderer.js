/**
 * 포스터 레이아웃 렌더러 (v5.3 - 샐러드 사진 완전 퇴출 & 100% 식재료 실물 매칭)
 * - 샐러드 기본값/대체이미지 완전 제거: 실물 식재료 전용 뷰 및 이모지 안전 대체
 * - 상단 [실물 사진] ↔ [일러스트] 모드 완벽 연동
 * - 4번 파스텔 컬러 코딩 (허니 앰버, 3색 멀티 파스텔, 민트 에메랄드)
 * - 여백 최소화 & 본문 20pt+ 초대형 폰트
 */

import { ALLERGENS_19 } from './allergyData.js';

export function renderPoster(container, state) {
  const { ingredient, mode, formFactor } = state;
  if (!ingredient) return;

  const content = mode === 'elementary' ? ingredient.elementary : ingredient.secondary;
  const allergenList = (ingredient.allergens || []).map(id => {
    const item = ALLERGENS_19.find(a => a.id === id);
    return item ? `${item.id}.${item.name}` : null;
  }).filter(Boolean);

  let html = '';

  if (formFactor === 'a4') {
    html = renderA4Layout(ingredient, content, allergenList, state);
  } else if (formFactor === 'screen') {
    html = renderScreenLayout(ingredient, content, allergenList, state);
  } else if (formFactor === 'square') {
    html = renderSquareLayout(ingredient, content, allergenList, state);
  }

  container.innerHTML = html;
}

/**
 * 식재료 비주얼 렌더링 헬퍼 (실물 사진 vs 일러스트 모드 완벽 분리 & 샐러드 대체 이미지 완전 제거)
 */
function renderIngredientPhoto(item, state, sizeClasses = "w-52 h-52 sm:w-64 sm:h-64") {
  const isEmojiMode = state && state.imageMode === 'emoji';
  const imgUrl = item.imageUrl || `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(item.name)}.jpg`;

  if (isEmojiMode) {
    return `
      <div class="relative group cursor-pointer shrink-0" id="heroVisualBox" title="클릭하여 사진 변경 (또는 Ctrl+V로 이미지 붙여넣기)">
        <div class="${sizeClasses} rounded-3xl bg-gradient-to-br from-amber-50 to-orange-100/60 border-4 border-theme-border flex flex-col items-center justify-center shadow-lg overflow-hidden relative">
          <span class="text-8xl sm:text-9xl select-none transition duration-300 group-hover:scale-110 drop-shadow-sm">${item.emoji}</span>
          <span class="text-xs sm:text-sm font-black text-theme-dark mt-2 bg-white/95 px-3 py-0.5 rounded-full border border-theme-border shadow-2xs">${item.name}</span>
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-sm font-black gap-1 no-print p-2 text-center">
            <span>🎨 일러스트 모드</span>
            <span class="text-[11px] font-normal text-slate-200">클릭 시 사진으로 변경</span>
          </div>
        </div>
        <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full border-2 border-slate-300 text-xs sm:text-sm font-black text-slate-800 shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <span>🎨 일러스트</span>
          <span class="text-slate-300">•</span>
          <span class="text-theme-dark font-extrabold">${item.category}</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="relative group cursor-pointer shrink-0" id="heroVisualBox" title="클릭하여 사진 변경 (또는 Ctrl+V로 이미지 붙여넣기)">
      <div class="${sizeClasses} rounded-3xl bg-theme-light border-4 border-theme-border flex items-center justify-center shadow-lg overflow-hidden relative">
        <img 
          src="${imgUrl}" 
          alt="${item.name}" 
          class="w-full h-full object-cover transition duration-300 group-hover:scale-105" 
          onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 text-slate-800 p-4 text-center\\'><span class=\\'text-7xl sm:text-8xl select-none mb-1\\'>${item.emoji}</span><span class=\\'text-base font-black text-slate-900\\'>${item.name}</span><span class=\\'text-xs text-slate-500 font-bold mt-1\\'>📸 사진 클릭 / Ctrl+V 붙여넣기</span></div>';" 
        />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-sm font-black gap-1 no-print p-2 text-center">
          <span>📷 사진 변경</span>
          <span class="text-[11px] font-normal text-slate-200">클릭 또는 [Ctrl+V] 붙여넣기</span>
        </div>
      </div>
      <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full border-2 border-slate-300 text-xs sm:text-sm font-black text-slate-800 shadow-md flex items-center gap-1.5 whitespace-nowrap">
        <span>📸 실물 사진</span>
        <span class="text-slate-300">•</span>
        <span class="text-theme-dark font-extrabold">${item.category}</span>
      </div>
    </div>
  `;
}

/**
 * 알레르기 안내 뱃지 헬퍼
 */
function renderAllergyNotice(allergenList) {
  if (allergenList && allergenList.length > 0) {
    return `
      <div class="inline-flex items-center gap-2 bg-rose-50 border-2 border-rose-300 text-rose-900 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-bold shadow-2xs">
        <span class="bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-black shrink-0">⚠️</span>
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="font-black text-rose-950">알레르기 유발물질:</span>
          ${allergenList.map(a => `<span class="bg-white border border-rose-400 text-rose-900 px-2 py-0.5 rounded-lg text-xs font-black">${a}</span>`).join('')}
          <span class="text-xs text-rose-600 font-semibold">(해당 학생 섭취 유의)</span>
        </div>
      </div>
    `;
  }
  return `
    <div class="inline-flex items-center gap-1.5 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-bold shadow-2xs">
      <span class="text-emerald-600 font-black">✅ 안심 식재료</span>
      <span class="text-slate-600 font-semibold">• 19종 주요 알레르기 비해당</span>
    </div>
  `;
}

/**
 * 1. A4 세로형 포스터 레이아웃 (파스텔 컬러 코딩 & 20pt+ 초대형 가독성)
 */
function renderA4Layout(item, content, allergenList, state) {
  const isElem = state.mode === 'elementary';
  const origin = item.originInfo || {};
  
  // 고유 텍스트 매핑 (더미 텍스트 완전 배제)
  const etymologyText = origin.etymology || content.story;
  const historyText = origin.history || content.funFact;
  const tipText = content.lunchTip || origin.nature || item.selectionTip || "급식실에서 신선하게 조리하여 균형 잡힌 영양을 제공합니다.";

  // 영양성분 3색 파스텔 스타일 정의
  const pastelStyles = [
    { bg: "bg-sky-50/90", border: "border-sky-300", badgeBg: "bg-sky-100", titleColor: "text-sky-950", accent: "text-sky-600" },
    { bg: "bg-amber-50/90", border: "border-amber-300", badgeBg: "bg-amber-100", titleColor: "text-amber-950", accent: "text-amber-600" },
    { bg: "bg-rose-50/90", border: "border-rose-300", badgeBg: "bg-rose-100", titleColor: "text-rose-950", accent: "text-rose-600" }
  ];

  return `
    <div class="aspect-a4 bg-white rounded-3xl p-5 sm:p-6 flex flex-col justify-between border-4 border-theme-border poster-shadow relative overflow-hidden text-slate-800">
      
      <!-- 상단 리본 장식 데코 -->
      <div class="absolute -top-24 -right-24 w-56 h-56 bg-theme-light rounded-full opacity-60 pointer-events-none"></div>
      <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-theme-light rounded-full opacity-60 pointer-events-none"></div>

      <!-- [상단 헤더] 학교명 & 포스터 타이틀 -->
      <div class="relative z-10 border-b-2 border-slate-200 pb-2 mb-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black bg-theme-light text-theme-dark border-2 border-theme-border">
            ${isElem ? '🌱 초등 식생활 교실' : '🎓 스마트 영양 가이드'}
          </span>
          <span class="text-xs sm:text-sm text-slate-500 font-bold">| 이달의 식재료 탐구</span>
        </div>
        <div data-field="schoolName" contenteditable="true" class="text-xs sm:text-sm font-extrabold text-slate-700 hover:bg-amber-100 px-3 py-1 rounded-xl cursor-pointer transition border border-transparent hover:border-amber-300" title="클릭하여 학교명을 수정할 수 있습니다">
          ${state.schoolName || '행복학교 급식실 · 영양상담실'}
        </div>
      </div>

      <!-- ========================================================
           구역 1: [식재료명] & [식재료 사진] (히어로 섹션)
           ======================================================== -->
      <div class="relative z-10 bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-3xl p-5 border-3 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6 my-1">
        <!-- 2. 식재료 사진 (state 전달하여 일러스트/실물사진 전환 반영) -->
        ${renderIngredientPhoto(item, state, "w-48 h-48 sm:w-56 sm:h-56")}

        <!-- 1. 식재료명 및 캐치프레이즈 -->
        <div class="flex-1 text-center sm:text-left flex flex-col justify-center gap-2">
          <div data-field="subtitle" contenteditable="true" class="inline-block self-center sm:self-start text-xs sm:text-sm font-black text-theme-primary bg-theme-light px-4 py-1.5 rounded-full border-2 border-theme-border shadow-2xs">
            ${content.subtitle}
          </div>
          
          <div>
            <h1 data-field="name" contenteditable="true" class="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-none my-1">
              ${item.name}
            </h1>
            <p data-field="englishName" contenteditable="true" class="text-base sm:text-lg font-bold text-slate-400 italic">
              ${item.englishName}
            </p>
          </div>

          <div data-field="catchphrase" contenteditable="true" class="text-lg sm:text-xl font-black text-slate-900 leading-snug break-keep bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-2xs">
            ${content.catchphrase}
          </div>

          <div>
            ${renderAllergyNotice(allergenList)}
          </div>
        </div>
      </div>

      <!-- ========================================================
           구역 2: [식재료의 유래 및 이야기] 🍯 (따뜻한 허니 앰버 파스텔)
           ======================================================== -->
      <div class="relative z-10 bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-100/40 border-3 border-amber-300 rounded-3xl p-5 shadow-sm my-1">
        <div class="flex items-center gap-2 mb-3 pb-2 border-b-2 border-amber-200">
          <span class="text-3xl">📜</span>
          <h2 class="text-xl sm:text-2xl font-black text-amber-950">
            [${item.name}]의 유래와 식재료 이야기
          </h2>
          <span class="text-xs bg-amber-300 text-amber-950 font-black px-3 py-1 rounded-full ml-auto">식재료 탐구</span>
        </div>

        <div class="flex flex-col gap-2.5">
          <div class="bg-white/95 p-3.5 rounded-2xl border-2 border-amber-200 shadow-2xs">
            <span class="text-sm sm:text-base font-black text-amber-950 flex items-center gap-1.5 mb-1">
              <span>🏷️</span> ${origin.etymology ? '이름의 유래 (어원):' : '식재료 이야기:'}
            </span>
            <p data-field="etymology" contenteditable="true" class="text-base sm:text-lg lg:text-xl text-slate-900 leading-relaxed font-bold break-keep">
              ${etymologyText}
            </p>
          </div>

          <div class="bg-white/95 p-3.5 rounded-2xl border-2 border-amber-200 shadow-2xs">
            <span class="text-sm sm:text-base font-black text-amber-950 flex items-center gap-1.5 mb-1">
              <span>🌾</span> ${origin.history ? '역사와 전통 식문화:' : '알아두면 유익한 상식:'}
            </span>
            <p data-field="history" contenteditable="true" class="text-base sm:text-lg lg:text-xl text-slate-900 leading-relaxed font-bold break-keep">
              ${historyText}
            </p>
          </div>
        </div>
      </div>

      <!-- ========================================================
           구역 3: [핵심 영양성분 3종과 효능] 🌈 (3색 멀티 파스텔 카드)
           ======================================================== -->
      <div class="relative z-10 my-1">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-3xl">✨</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900">
            핵심 영양성분과 우리 몸에 주는 이로움
          </h2>
          <span class="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full ml-auto">건강 지킴이</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          ${item.nutrients.map((n, idx) => {
            const style = pastelStyles[idx % pastelStyles.length];
            return `
              <div class="${style.bg} p-4 rounded-3xl border-3 ${style.border} shadow-sm flex flex-col justify-between transition hover:-translate-y-0.5">
                <div class="flex items-center gap-2.5 mb-2">
                  <span class="text-3xl p-2 rounded-2xl ${style.badgeBg} shrink-0">${n.icon}</span>
                  <span data-field="nutrient_name_${idx}" contenteditable="true" class="text-lg sm:text-xl font-black ${style.titleColor} leading-tight">
                    ${n.name}
                  </span>
                </div>
                <p data-field="nutrient_amount_${idx}" contenteditable="true" class="text-sm sm:text-base font-bold text-slate-800 bg-white/90 p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
                  ${n.amount}
                </p>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ========================================================
           구역 4: [영양선생님의 꿀팁] 🌿 (싱그런 민트 에메랄드 말풍선)
           ======================================================== -->
      <div class="relative z-10 bg-gradient-to-r from-emerald-50 via-teal-50/80 to-emerald-50 border-3 border-emerald-400 rounded-3xl p-5 shadow-sm my-1">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-3xl">👩‍🍳</span>
          <h2 class="text-xl sm:text-2xl font-black text-emerald-950">
            영양선생님의 급식실 한마디 & 조리 꿀팁!
          </h2>
          <span class="text-xs bg-emerald-600 text-white font-black px-3 py-1 rounded-full ml-auto">영양 Talk</span>
        </div>
        <p data-field="lunchTip" contenteditable="true" class="text-base sm:text-lg lg:text-xl text-emerald-950 leading-relaxed font-black break-keep bg-white/95 p-4 rounded-2xl border-2 border-emerald-200 shadow-2xs">
          ${tipText}
        </p>
      </div>

      <!-- 하단 푸터 -->
      <div class="relative z-10 pt-2 border-t-2 border-slate-200 flex items-center justify-between text-xs sm:text-sm text-slate-500 font-bold">
        <div>🍎 영양쏙쏙 식생활 교육 포스터 • 균형 잡힌 학교 급식은 건강한 성장의 힘이 됩니다.</div>
        <div data-field="footerSchool" contenteditable="true" class="font-black text-slate-700">
          ${state.schoolName || '학교 급식실'}
        </div>
      </div>

    </div>
  `;
}

/**
 * 2. 16:9 가로형 슬라이드 레이아웃 (파스텔 컬러 코딩 & TV 화면 최적화)
 */
function renderScreenLayout(item, content, allergenList, state) {
  const isElem = state.mode === 'elementary';
  const origin = item.originInfo || {};
  const etymologyText = origin.etymology || content.story;
  const historyText = origin.history || content.funFact;
  const tipText = content.lunchTip || origin.nature || item.selectionTip || "급식실에서 정성껏 조리하여 맛과 영양을 전합니다.";

  const pastelStyles = [
    { bg: "bg-sky-50/90", border: "border-sky-300", badgeBg: "bg-sky-100", titleColor: "text-sky-950" },
    { bg: "bg-amber-50/90", border: "border-amber-300", badgeBg: "bg-amber-100", titleColor: "text-amber-950" },
    { bg: "bg-rose-50/90", border: "border-rose-300", badgeBg: "bg-rose-100", titleColor: "text-rose-950" }
  ];

  return `
    <div class="aspect-screen bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-4 border-theme-border poster-shadow relative overflow-hidden text-slate-800">
      
      <!-- 상단 헤더 -->
      <div class="flex items-center justify-between border-b-2 border-slate-200 pb-2 mb-2">
        <div class="flex items-center gap-2">
          <span class="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black bg-theme-light text-theme-dark border-2 border-theme-border">
            📺 급식실 스마트 영양 모니터
          </span>
          <span data-field="schoolName" contenteditable="true" class="text-sm sm:text-base font-black text-slate-700">
            ${state.schoolName || '우리 학교 급식실'}
          </span>
        </div>
        <div class="text-xs sm:text-sm text-slate-500 font-bold">
          오늘의 식재료 탐구 • 16:9 와이드 DID 모니터 송출 규격
        </div>
      </div>

      <!-- 메인 2단 그리드 (좌측: 사진/명칭, 우측: 유래/영양/팁) -->
      <div class="grid grid-cols-12 gap-6 items-center flex-1 my-auto">
        <!-- 좌측: [1. 식재료명] & [2. 식재료 사진] (5칸) -->
        <div class="col-span-12 sm:col-span-5 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-50 to-white p-6 rounded-3xl border-3 border-slate-200 shadow-sm h-full">
          ${renderIngredientPhoto(item, state, "w-48 h-48 sm:w-56 sm:h-56")}

          <h1 data-field="name" contenteditable="true" class="text-4xl sm:text-5xl font-black text-slate-900 mt-4 mb-1 tracking-tight">
            ${item.name}
          </h1>
          <p data-field="englishName" contenteditable="true" class="text-base sm:text-lg font-bold text-slate-400 italic mb-3">
            ${item.englishName}
          </p>

          <div class="w-full">
            ${renderAllergyNotice(allergenList)}
          </div>
        </div>

        <!-- 우측: [3. 유래정보] & [4. 영양성분] & [5. 영양팁] (7칸) -->
        <div class="col-span-12 sm:col-span-7 flex flex-col justify-between gap-3 h-full">
          <!-- 3. 유래 및 정보 (허니 앰버 파스텔) -->
          <div class="bg-amber-50/90 border-3 border-amber-300 p-4 rounded-3xl shadow-xs">
            <div class="flex items-center gap-1.5 mb-1.5 text-amber-950 font-black text-base sm:text-lg">
              <span>📜</span> <span>식재료 유래 이야기</span>
            </div>
            <p data-field="etymology" contenteditable="true" class="text-sm sm:text-base text-slate-900 leading-snug font-bold mb-1 break-keep">
              • <strong>유래:</strong> ${etymologyText}
            </p>
            <p data-field="history" contenteditable="true" class="text-sm sm:text-base text-slate-900 leading-snug font-bold break-keep">
              • <strong>역사:</strong> ${historyText}
            </p>
          </div>

          <!-- 4. 영양성분 3종 (3색 파스텔) -->
          <div>
            <div class="text-sm sm:text-base font-black text-slate-900 mb-1.5 flex items-center gap-1.5">
              <span>✨</span> <span>핵심 영양성분과 인체 효능</span>
            </div>
            <div class="grid grid-cols-3 gap-2.5">
              ${item.nutrients.map((n, idx) => {
                const style = pastelStyles[idx % pastelStyles.length];
                return `
                  <div class="${style.bg} p-3 rounded-2xl border-2 ${style.border} shadow-2xs text-center flex flex-col justify-center">
                    <span class="text-2xl mb-1">${n.icon}</span>
                    <span data-field="nutrient_name_${idx}" contenteditable="true" class="text-sm sm:text-base font-black ${style.titleColor} leading-tight">${n.name}</span>
                    <span data-field="nutrient_amount_${idx}" contenteditable="true" class="text-xs sm:text-sm font-bold text-slate-700 mt-1 leading-tight">${n.amount}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 5. 영양 팁 (민트 에메랄드) -->
          <div class="bg-emerald-50 border-3 border-emerald-300 p-3.5 rounded-2xl shadow-xs">
            <div class="text-sm sm:text-base font-black text-emerald-950 flex items-center gap-1 mb-1">
              <span>👩‍🍳</span> <span>영양선생님의 급식실 한마디:</span>
            </div>
            <p data-field="lunchTip" contenteditable="true" class="text-sm sm:text-base text-emerald-950 leading-normal font-black break-keep">
              ${tipText}
            </p>
          </div>
        </div>
      </div>

      <!-- 하단 푸터 -->
      <div class="pt-2 border-t-2 border-slate-200 flex items-center justify-between text-xs sm:text-sm text-slate-500 font-bold">
        <div>균형 잡힌 학교 급식은 건강한 몸과 맑은 마음을 만듭니다.</div>
        <div data-field="footerSchool" contenteditable="true" class="font-black text-slate-700">${state.schoolName || '학교 급식실'}</div>
      </div>

    </div>
  `;
}

/**
 * 3. 1:1 정사각 카드뉴스 레이아웃 (파스텔 컬러 코딩 & 스마트폰/가정통신문)
 */
function renderSquareLayout(item, content, allergenList, state) {
  const isElem = state.mode === 'elementary';
  const origin = item.originInfo || {};
  const etymologyText = origin.etymology || content.story;
  const historyText = origin.history || content.funFact;
  const tipText = content.lunchTip || origin.nature || item.selectionTip || "급식실에서 정성껏 조리하여 영양을 전합니다.";

  const pastelStyles = [
    { bg: "bg-sky-50/90", border: "border-sky-300", titleColor: "text-sky-950" },
    { bg: "bg-amber-50/90", border: "border-amber-300", titleColor: "text-amber-950" },
    { bg: "bg-rose-50/90", border: "border-rose-300", titleColor: "text-rose-950" }
  ];

  return `
    <div class="aspect-square bg-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-4 border-theme-border poster-shadow relative overflow-hidden text-slate-800">
      
      <!-- 상단 바 -->
      <div class="flex items-center justify-between border-b-2 border-slate-200 pb-2 mb-2">
        <span class="text-xs sm:text-sm font-black text-theme-primary bg-theme-light px-3.5 py-1 rounded-full border-2 border-theme-border">
          📱 가정통신 영양 카드뉴스
        </span>
        <span data-field="schoolName" contenteditable="true" class="text-xs sm:text-sm font-extrabold text-slate-600">
          ${state.schoolName || '행복학교 영양소식'}
        </span>
      </div>

      <!-- 1 & 2. 식재료명 및 사진 -->
      <div class="flex items-center gap-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-4 rounded-3xl border-3 border-slate-200 my-1 shadow-xs">
        ${renderIngredientPhoto(item, state, "w-36 h-36 sm:w-44 sm:h-44")}

        <div class="flex-1">
          <div data-field="subtitle" contenteditable="true" class="text-xs sm:text-sm font-black text-theme-primary mb-0.5">
            ${content.subtitle}
          </div>
          <h1 data-field="name" contenteditable="true" class="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
            ${item.name}
          </h1>
          <p data-field="englishName" contenteditable="true" class="text-sm sm:text-base font-bold text-slate-400 italic mb-2">
            ${item.englishName}
          </p>
          <div>
            ${renderAllergyNotice(allergenList)}
          </div>
        </div>
      </div>

      <!-- 3. 유래 및 정보 (허니 앰버 파스텔) -->
      <div class="bg-amber-50 border-3 border-amber-300 p-4 rounded-2xl my-1 shadow-xs">
        <span class="text-sm sm:text-base font-black text-amber-950 flex items-center gap-1 mb-1">
          <span>📜</span> 식재료 유래 이야기:
        </span>
        <p data-field="etymology" contenteditable="true" class="text-sm sm:text-base text-slate-900 leading-snug font-bold break-keep">
          ${etymologyText} ${historyText}
        </p>
      </div>

      <!-- 4. 영양성분 3종 (3색 파스텔) -->
      <div class="grid grid-cols-3 gap-2 my-1">
        ${item.nutrients.map((n, idx) => {
          const style = pastelStyles[idx % pastelStyles.length];
          return `
            <div class="${style.bg} p-3 rounded-2xl border-2 ${style.border} text-center shadow-2xs">
              <span class="text-2xl mb-0.5 block">${n.icon}</span>
              <span data-field="nutrient_name_${idx}" contenteditable="true" class="text-sm sm:text-base font-black ${style.titleColor} block leading-tight">${n.name}</span>
              <span data-field="nutrient_amount_${idx}" contenteditable="true" class="text-xs sm:text-sm font-bold text-slate-700 block mt-1 leading-tight">${n.amount}</span>
            </div>
          `;
        }).join('')}
      </div>

      <!-- 5. 영양 팁 (민트 에메랄드) -->
      <div class="bg-emerald-50 border-3 border-emerald-300 p-3.5 rounded-2xl my-1 shadow-xs">
        <span class="text-sm sm:text-base font-black text-emerald-950 flex items-center gap-1 mb-0.5">
          <span>👩‍🍳</span> 영양선생님의 한마디:
        </span>
        <p data-field="lunchTip" contenteditable="true" class="text-sm sm:text-base text-emerald-950 font-black leading-snug break-keep">
          ${tipText}
        </p>
      </div>

      <!-- 푸터 -->
      <div class="pt-2 border-t-2 border-slate-200 flex items-center justify-between text-xs sm:text-sm text-slate-500 font-bold">
        <div>스마트폰 및 가정통신문 카드뉴스 규격</div>
        <div data-field="footerSchool" contenteditable="true" class="font-black text-slate-700">${state.schoolName || '학교 영양상담실'}</div>
      </div>

    </div>
  `;
}
