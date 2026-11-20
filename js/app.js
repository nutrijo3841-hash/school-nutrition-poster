/**
 * 영양쏙쏙 (Nutri-Poster) 메인 애플리케이션 컨트롤러
 * - [신규] 영양교사용 커스텀 수정사항 자동 저장 (localStorage Auto-Save) 영구 보관
 * - [신규] 원클릭 원본 복원 (Reset) 기능
 * - 식재료 실물 고화질 사진 교체 및 즉시 붙여넣기 (Ctrl + V)
 * - 20pt 대형 폰트 & 5대 필수 정보 집중 포스터 렌더링 동기화
 */

import { INGREDIENTS_DATABASE, CATEGORIES, searchIngredients, getSeasonalIngredients } from './ingredients.js';
import { renderPoster } from './posterRenderer.js';
import { downloadPosterAsImage, printPoster, copyPosterToClipboard, showToast } from './posterExporter.js';
import { generateIngredientData, getStoredApiKey, saveApiKey } from './aiService.js';

// 로컬 스토리지 키 정의
const STORAGE_KEY_CUSTOM_EDITS = 'nutri_poster_custom_edits_v1';
const STORAGE_KEY_SCHOOL_NAME = 'nutri_school_name';

// 전역 앱 상태 (기본값: 토란 / 실물 사진 모드 / 자동 저장 병합)
const state = {
  ingredient: null,
  mode: 'elementary',                  // elementary | secondary
  formFactor: 'a4',                    // a4 | screen | square
  imageMode: 'photo',                  // photo | emoji
  theme: 'theme-green',                // theme-green, theme-orange, theme-purple, theme-blue, theme-pink
  schoolName: localStorage.getItem(STORAGE_KEY_SCHOOL_NAME) || '행복학교 급식실 · 영양상담실',
  category: '전체',
  searchQuery: '',
  currentMonth: new Date().getMonth() + 1
};

// DOM 요소 캐시
const elements = {
  posterContainer: document.getElementById('posterCanvas'),
  posterWrapper: document.getElementById('posterWrapper'),
  searchInput: document.getElementById('searchInput'),
  ingredientList: document.getElementById('ingredientList'),
  categoryPills: document.getElementById('categoryPills'),
  seasonalPills: document.getElementById('seasonalPills'),
  schoolNameInput: document.getElementById('schoolNameInput'),
  downloadBtn: document.getElementById('downloadBtn'),
  printBtn: document.getElementById('printBtn'),
  copyBtn: document.getElementById('copyBtn'),
  randomBtn: document.getElementById('randomBtn'),
  aiSearchBtn: document.getElementById('aiSearchBtn'),
  settingsModal: document.getElementById('settingsModal'),
  openSettingsBtn: document.getElementById('openSettingsBtn'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  apiKeyInput: document.getElementById('apiKeyInput'),
  saveApiKeyBtn: document.getElementById('saveApiKeyBtn'),
  // 사진 변경 모달
  imageModal: document.getElementById('imageModal'),
  closeImageModalBtn: document.getElementById('closeImageModalBtn'),
  localImageInput: document.getElementById('localImageInput'),
  customImageUrlInput: document.getElementById('customImageUrlInput'),
  applyImageBtn: document.getElementById('applyImageBtn'),
  searchNaverImgBtn: document.getElementById('searchNaverImgBtn'),
  searchGoogleImgBtn: document.getElementById('searchGoogleImgBtn'),
  // 자동 저장 상태 및 복원 버튼
  saveStatusBadge: document.getElementById('saveStatusBadge'),
  resetEditsBtn: document.getElementById('resetEditsBtn')
};

/* ==========================================================================
   자동 저장 (Auto-Save) 영구 보관 엔진
   ========================================================================== */

function getStoredCustomEdits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_EDITS);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error("저장소 불러오기 오류:", err);
    return {};
  }
}

function hasCustomEdits(ingredientId) {
  if (!ingredientId) return false;
  const all = getStoredCustomEdits();
  return !!all[ingredientId];
}

function saveIngredientCustomEdits(item) {
  if (!item || !item.id) return;
  const all = getStoredCustomEdits();
  
  all[item.id] = {
    imageUrl: item.imageUrl,
    name: item.name,
    englishName: item.englishName,
    category: item.category,
    originInfo: item.originInfo ? { ...item.originInfo } : undefined,
    elementary: item.elementary ? { ...item.elementary } : undefined,
    secondary: item.secondary ? { ...item.secondary } : undefined,
    nutrients: item.nutrients ? JSON.parse(JSON.stringify(item.nutrients)) : undefined,
    lastSaved: Date.now()
  };

  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_EDITS, JSON.stringify(all));
    updateSaveStatusUI(true);
  } catch (e) {
    console.warn("용량 초과 혹은 로컬스토리지 저장 실패:", e);
  }
}

function removeIngredientCustomEdits(ingredientId) {
  if (!ingredientId) return;
  const all = getStoredCustomEdits();
  delete all[ingredientId];
  localStorage.setItem(STORAGE_KEY_CUSTOM_EDITS, JSON.stringify(all));
}

function applyCustomEditsToIngredient(item) {
  if (!item) return item;
  const all = getStoredCustomEdits();
  const edits = all[item.id];
  if (!edits) return item;

  // 원본 객체 깊은 복사 후 커스텀 저장값 덮어쓰기
  const merged = JSON.parse(JSON.stringify(item));
  if (edits.imageUrl) merged.imageUrl = edits.imageUrl;
  if (edits.name) merged.name = edits.name;
  if (edits.englishName) merged.englishName = edits.englishName;
  if (edits.category) merged.category = edits.category;
  if (edits.originInfo) merged.originInfo = { ...(merged.originInfo || {}), ...edits.originInfo };
  if (edits.elementary) merged.elementary = { ...(merged.elementary || {}), ...edits.elementary };
  if (edits.secondary) merged.secondary = { ...(merged.secondary || {}), ...edits.secondary };
  if (edits.nutrients && Array.isArray(edits.nutrients)) merged.nutrients = edits.nutrients;
  merged._isCustomEdited = true;
  return merged;
}

let saveBadgeTimeout = null;
function updateSaveStatusUI(savedNow = false) {
  const isEdited = state.ingredient ? hasCustomEdits(state.ingredient.id) : false;

  if (elements.resetEditsBtn) {
    if (isEdited) {
      elements.resetEditsBtn.classList.remove('hidden');
    } else {
      elements.resetEditsBtn.classList.add('hidden');
    }
  }

  if (elements.saveStatusBadge) {
    if (savedNow) {
      elements.saveStatusBadge.innerHTML = `<span>✨</span> <span>방금 자동저장됨</span>`;
      elements.saveStatusBadge.className = 'text-[11px] bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm transition-all duration-300';
      
      clearTimeout(saveBadgeTimeout);
      saveBadgeTimeout = setTimeout(() => {
        elements.saveStatusBadge.innerHTML = `<span>💾</span> <span>${isEdited ? '수정본 유지중' : '자동저장 활성'}</span>`;
        elements.saveStatusBadge.className = 'text-[11px] bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1 transition-all duration-300';
      }, 2500);
    } else {
      elements.saveStatusBadge.innerHTML = `<span>💾</span> <span>${isEdited ? '수정본 유지중' : '자동저장 활성'}</span>`;
      elements.saveStatusBadge.className = 'text-[11px] bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1';
    }
  }
}

/* ==========================================================================
   앱 초기화 & 렌더링
   ========================================================================== */

function init() {
  // 첫 식재료(토란) 로드 시 자동 저장된 커스텀 데이터가 있다면 바로 복원
  state.ingredient = applyCustomEditsToIngredient(INGREDIENTS_DATABASE[0]);

  renderCategories();
  renderSeasonalBadges();
  renderIngredientList();
  renderAppTheme();
  renderCurrentPoster();
  setupEventListeners();

  if (elements.schoolNameInput) {
    elements.schoolNameInput.value = state.schoolName;
  }
  updateSaveStatusUI(false);
}

// 포스터 렌더링 갱신
function renderCurrentPoster() {
  if (!elements.posterContainer) return;
  renderPoster(elements.posterContainer, state);

  // 포스터 내 사진 클릭 시 사진 변경 모달 연결
  const heroBox = document.getElementById('heroVisualBox');
  if (heroBox) {
    heroBox.addEventListener('click', () => {
      openImageModal();
    });
  }

  updateSaveStatusUI(false);
}

// 카테고리 필터 버튼 렌더링
function renderCategories() {
  if (!elements.categoryPills) return;
  elements.categoryPills.innerHTML = CATEGORIES.map(cat => {
    const isSelected = state.category === cat;
    return `
      <button data-category="${cat}" class="category-btn px-3 py-1.5 rounded-full text-xs font-semibold transition shrink-0 ${
        isSelected 
          ? 'bg-slate-900 text-white shadow-sm' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }">
        ${cat}
      </button>
    `;
  }).join('');
}

// 이달의 제철 식재료 뱃지 렌더링
function renderSeasonalBadges() {
  if (!elements.seasonalPills) return;
  const seasonal = getSeasonalIngredients(state.currentMonth).slice(0, 8);
  
  elements.seasonalPills.innerHTML = `
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 w-full text-xs">
      <span class="font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-md shrink-0 flex items-center gap-1">
        <span>🍂</span> ${state.currentMonth}월 제철:
      </span>
      ${seasonal.map(item => `
        <button data-id="${item.id}" class="seasonal-item-btn bg-white border border-amber-200 hover:border-amber-400 text-slate-700 px-2.5 py-1 rounded-full font-medium shrink-0 flex items-center gap-1 shadow-2xs transition">
          <span>${item.emoji}</span> <span>${item.name}</span>
        </button>
      `).join('')}
    </div>
  `;
}

// 식재료 목록 렌더링 (커스텀 저장된 사진/정보 반영)
function renderIngredientList() {
  if (!elements.ingredientList) return;
  const filtered = searchIngredients(state.searchQuery, state.category);

  if (filtered.length === 0) {
    elements.ingredientList.innerHTML = `
      <div class="col-span-2 py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-4">
        <span class="text-3xl mb-2 block">🔍</span>
        <p class="text-xs font-bold text-slate-700 mb-1">'${state.searchQuery}' 등록 데이터가 없습니다.</p>
        <p class="text-[11px] text-slate-400 mb-3">AI가 실물 사진과 유래 정보를 자동으로 찾아 포스터를 만듭니다!</p>
        <button id="quickAiBtn" class="bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:opacity-90 transition shadow-sm">
          ✨ '${state.searchQuery}' AI로 실시간 생성하기
        </button>
      </div>
    `;

    const quickAi = document.getElementById('quickAiBtn');
    if (quickAi) {
      quickAi.addEventListener('click', () => handleAiGeneration(state.searchQuery));
    }
    return;
  }

  const customEdits = getStoredCustomEdits();

  elements.ingredientList.innerHTML = filtered.map(rawItem => {
    // 커스텀 수정본이 있으면 리스트 썸네일에도 즉시 반영
    const edits = customEdits[rawItem.id];
    const item = edits ? { ...rawItem, ...edits } : rawItem;
    const isSelected = state.ingredient?.id === item.id;
    const hasPhoto = item.imageUrl;
    const isCustomized = !!edits;

    return `
      <div data-id="${item.id}" class="ingredient-card p-2.5 rounded-2xl border transition cursor-pointer flex items-center gap-3 relative ${
        isSelected 
          ? 'bg-theme-light border-theme-primary shadow-sm ring-2 ring-theme-primary/20' 
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }">
        <div class="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200/80">
          ${hasPhoto ? `
            <img src="${item.imageUrl}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.outerHTML='<span class=\\'text-2xl\\'>${item.emoji}</span>';" />
          ` : `
            <span class="text-2xl">${item.emoji}</span>
          `}
        </div>
        <div class="overflow-hidden flex-1">
          <div class="flex items-center gap-1.5">
            <span class="font-bold text-xs text-slate-800 truncate">${item.name}</span>
            <span class="text-[10px] text-slate-400 shrink-0">${item.category}</span>
            ${isCustomized ? '<span class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded shrink-0">저장됨</span>' : ''}
          </div>
          <p class="text-[11px] text-slate-500 truncate mt-0.5">
            ${item.elementary.catchphrase}
          </p>
        </div>
      </div>
    `;
  }).join('');
}

// 테마 색상 클래스 적용
function renderAppTheme() {
  const root = document.getElementById('appRoot');
  if (root) {
    root.className = `min-h-screen ${state.theme}`;
  }
}

// 사진 변경 모달 열기
function openImageModal() {
  if (elements.customImageUrlInput) {
    elements.customImageUrlInput.value = state.ingredient?.imageUrl || '';
  }
  if (elements.localImageInput) {
    elements.localImageInput.value = '';
  }
  elements.imageModal?.classList.remove('hidden');
}

/* ==========================================================================
   실시간 텍스트 수정 및 이벤트 핸들러
   ========================================================================== */

function handleContentEditableInput(e) {
  const target = e.target.closest('[contenteditable][data-field]');
  if (!target || !state.ingredient) return;

  const field = target.dataset.field;
  const text = target.innerText.trim();
  const isElem = state.mode === 'elementary';

  // 학교명 변경 처리
  if (field === 'schoolName' || field === 'footerSchool') {
    state.schoolName = text;
    localStorage.setItem(STORAGE_KEY_SCHOOL_NAME, text);
    if (elements.schoolNameInput) elements.schoolNameInput.value = text;
    updateSaveStatusUI(true);
    return;
  }

  // 식재료 고유 정보 수정 처리
  if (field === 'name') {
    state.ingredient.name = text;
  } else if (field === 'englishName') {
    state.ingredient.englishName = text;
  } else if (field === 'subtitle') {
    if (isElem) state.ingredient.elementary.subtitle = text;
    else state.ingredient.secondary.subtitle = text;
  } else if (field === 'catchphrase') {
    if (isElem) state.ingredient.elementary.catchphrase = text;
    else state.ingredient.secondary.catchphrase = text;
  } else if (field === 'etymology') {
    if (!state.ingredient.originInfo) state.ingredient.originInfo = {};
    state.ingredient.originInfo.etymology = text;
  } else if (field === 'history') {
    if (!state.ingredient.originInfo) state.ingredient.originInfo = {};
    state.ingredient.originInfo.history = text;
  } else if (field === 'lunchTip') {
    if (!state.ingredient.originInfo) state.ingredient.originInfo = {};
    state.ingredient.originInfo.nature = text;
    if (isElem) state.ingredient.elementary.lunchTip = text;
    else state.ingredient.secondary.lunchTip = text;
  } else if (field.startsWith('nutrient_name_')) {
    const idx = parseInt(field.replace('nutrient_name_', ''), 10);
    if (state.ingredient.nutrients && state.ingredient.nutrients[idx]) {
      state.ingredient.nutrients[idx].name = text;
    }
  } else if (field.startsWith('nutrient_amount_')) {
    const idx = parseInt(field.replace('nutrient_amount_', ''), 10);
    if (state.ingredient.nutrients && state.ingredient.nutrients[idx]) {
      state.ingredient.nutrients[idx].amount = text;
    }
  }

  // 로컬 스토리지에 자동 저장
  saveIngredientCustomEdits(state.ingredient);
  renderIngredientList();
}

function applyNewPhoto(photoUrl) {
  if (!state.ingredient) return;
  state.ingredient.imageUrl = photoUrl;
  state.imageMode = 'photo';
  saveIngredientCustomEdits(state.ingredient);
  renderCurrentPoster();
  renderIngredientList();
  elements.imageModal?.classList.add('hidden');
  updateSaveStatusUI(true);
  showToast("💾 새 사진이 포스터에 적용되고 컴퓨터에 안전하게 자동저장되었습니다!");
}

function setupEventListeners() {
  let debounceTimer;
  elements.searchInput?.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.searchQuery = e.target.value;
      renderIngredientList();
    }, 200);
  });

  // 포스터 내 실시간 글자 수정 감지 (자동 저장)
  let textDebounce;
  elements.posterContainer?.addEventListener('input', (e) => {
    clearTimeout(textDebounce);
    textDebounce = setTimeout(() => {
      handleContentEditableInput(e);
    }, 300);
  });

  // 커스텀 수정본 원본 복원 버튼
  elements.resetEditsBtn?.addEventListener('click', () => {
    if (!state.ingredient) return;
    if (confirm(`[${state.ingredient.name}]의 직접 수정한 사진과 글자를 원래 기본값으로 되돌리시겠습니까?`)) {
      removeIngredientCustomEdits(state.ingredient.id);
      const original = INGREDIENTS_DATABASE.find(i => i.id === state.ingredient.id);
      if (original) {
        state.ingredient = JSON.parse(JSON.stringify(original));
      }
      renderCurrentPoster();
      renderIngredientList();
      showToast("🔄 원래 기본 데이터로 복원되었습니다.");
    }
  });

  elements.categoryPills?.addEventListener('click', (e) => {
    const btn = e.target.closest('.category-btn');
    if (btn) {
      state.category = btn.dataset.category;
      renderCategories();
      renderIngredientList();
    }
  });

  elements.seasonalPills?.addEventListener('click', (e) => {
    const btn = e.target.closest('.seasonal-item-btn');
    if (btn) {
      const found = INGREDIENTS_DATABASE.find(i => i.id === btn.dataset.id);
      if (found) selectIngredient(found);
    }
  });

  elements.ingredientList?.addEventListener('click', (e) => {
    const card = e.target.closest('.ingredient-card');
    if (card) {
      const found = INGREDIENTS_DATABASE.find(i => i.id === card.dataset.id);
      if (found) selectIngredient(found);
    }
  });

  // 학교급 토글 (유초등 vs 중고등)
  document.querySelectorAll('.mode-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      document.querySelectorAll('.mode-toggle-btn').forEach(b => {
        b.classList.remove('bg-white', 'shadow-xs', 'text-slate-900', 'font-bold');
        b.classList.add('text-slate-500');
      });
      btn.classList.add('bg-white', 'shadow-xs', 'text-slate-900', 'font-bold');
      btn.classList.remove('text-slate-500');
      renderCurrentPoster();
      showToast(state.mode === 'elementary' ? '🐥 유치원·초등학교 눈높이로 변경되었습니다.' : '🎓 중·고등학교 영양 지식 모드로 변경되었습니다.');
    });
  });

  // 실물 사진 vs 일러스트 토글
  document.querySelectorAll('.imagemode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.imageMode = btn.dataset.imagemode;
      document.querySelectorAll('.imagemode-btn').forEach(b => {
        b.classList.remove('bg-white', 'shadow-xs', 'text-slate-900', 'font-bold');
        b.classList.add('text-slate-500');
      });
      btn.classList.add('bg-white', 'shadow-xs', 'text-slate-900', 'font-bold');
      btn.classList.remove('text-slate-500');
      renderCurrentPoster();
      showToast(state.imageMode === 'photo' ? '📸 실물 고화질 사진으로 표시합니다.' : '🎨 캐릭터 일러스트로 표시합니다.');
    });
  });

  // 폼팩터 규격 변경
  document.querySelectorAll('.formfactor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.formFactor = btn.dataset.formfactor;
      document.querySelectorAll('.formfactor-btn').forEach(b => {
        b.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
        b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      });
      btn.classList.add('bg-slate-900', 'text-white', 'shadow-sm');
      btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
      renderCurrentPoster();
      showToast(`포스터 규격이 [${btn.innerText.trim()}] 형태로 변경되었습니다.`);
    });
  });

  // 테마 컬러
  document.querySelectorAll('.theme-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.theme = btn.dataset.theme;
      document.querySelectorAll('.theme-color-btn').forEach(b => b.classList.remove('ring-4', 'ring-slate-400'));
      btn.classList.add('ring-4', 'ring-slate-400');
      renderAppTheme();
      renderCurrentPoster();
      renderIngredientList();
    });
  });

  elements.schoolNameInput?.addEventListener('input', (e) => {
    state.schoolName = e.target.value.trim() || '행복학교 급식실';
    localStorage.setItem(STORAGE_KEY_SCHOOL_NAME, state.schoolName);
    renderCurrentPoster();
  });

  elements.randomBtn?.addEventListener('click', () => {
    const rand = INGREDIENTS_DATABASE[Math.floor(Math.random() * INGREDIENTS_DATABASE.length)];
    selectIngredient(rand);
    showToast(`🎲 오늘의 식재료: [${rand.name}] 포스터가 열렸습니다!`);
  });

  elements.aiSearchBtn?.addEventListener('click', () => {
    const term = elements.searchInput?.value?.trim() || prompt("분석할 식재료 이름을 입력하세요 (예: 토란, 우베, 샤인머스캣, 마라 등):");
    if (term) handleAiGeneration(term);
  });

  elements.downloadBtn?.addEventListener('click', () => {
    const posterEl = elements.posterContainer?.firstElementChild;
    const name = state.ingredient ? state.ingredient.name : "포스터";
    downloadPosterAsImage(posterEl, `${state.schoolName}_${name}_포스터`);
  });

  elements.printBtn?.addEventListener('click', () => printPoster());

  elements.copyBtn?.addEventListener('click', () => {
    const posterEl = elements.posterContainer?.firstElementChild;
    copyPosterToClipboard(posterEl);
  });

  // 사진 변경 모달 리스너
  elements.closeImageModalBtn?.addEventListener('click', () => {
    elements.imageModal?.classList.add('hidden');
  });

  elements.localImageInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        applyNewPhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });

  elements.applyImageBtn?.addEventListener('click', () => {
    const url = elements.customImageUrlInput?.value?.trim();
    if (url) {
      applyNewPhoto(url);
    } else {
      elements.imageModal?.classList.add('hidden');
    }
  });

  // 인터넷 고화질 검색 바로가기
  elements.searchNaverImgBtn?.addEventListener('click', () => {
    const name = state.ingredient ? state.ingredient.name.replace(/\(.*\)/, '').trim() : '식재료';
    window.open(`https://search.naver.com/search.naver?where=image&query=${encodeURIComponent(name + ' 고화질')}`, '_blank');
  });

  elements.searchGoogleImgBtn?.addEventListener('click', () => {
    const name = state.ingredient ? state.ingredient.name.replace(/\(.*\)/, '').trim() : '식재료';
    window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(name + ' 식재료 고화질')}`, '_blank');
  });

  // [초간편] 키보드 Ctrl + V 클립보드 이미지 즉시 붙여넣기 & 자동저장 지원
  window.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            applyNewPhoto(event.target.result);
          };
          reader.readAsDataURL(blob);
          break;
        }
      }
    }
  });

  // Gemini 설정 모달
  elements.openSettingsBtn?.addEventListener('click', () => {
    if (elements.apiKeyInput) elements.apiKeyInput.value = getStoredApiKey();
    elements.settingsModal?.classList.remove('hidden');
  });

  elements.closeSettingsBtn?.addEventListener('click', () => elements.settingsModal?.classList.add('hidden'));

  elements.saveApiKeyBtn?.addEventListener('click', () => {
    saveApiKey(elements.apiKeyInput?.value || "");
    elements.settingsModal?.classList.add('hidden');
    showToast("Gemini API 설정이 저장되었습니다. ✨");
  });
}

function selectIngredient(rawItem) {
  // 사용자가 수정한 내역이 있다면 자동으로 병합하여 불러옴
  state.ingredient = applyCustomEditsToIngredient(rawItem);
  renderIngredientList();
  renderCurrentPoster();
  if (window.innerWidth < 1024) {
    elements.posterWrapper?.scrollIntoView({ behavior: 'smooth' });
  }
}

async function handleAiGeneration(term) {
  if (!term) return;
  showToast(`🤖 AI가 [${term}]의 실물 사진과 유래 정보, 교육 포스터를 생성 중입니다...`);
  try {
    const newIngredient = await generateIngredientData(term);
    INGREDIENTS_DATABASE.unshift(newIngredient);
    state.searchQuery = '';
    if (elements.searchInput) elements.searchInput.value = '';
    selectIngredient(newIngredient);
    renderIngredientList();
    showToast(`🎉 [${term}]의 맞춤 교육 포스터가 완성되었습니다!`);
  } catch (err) {
    console.error(err);
    showToast("생성 중 오류가 발생했습니다. 다시 시도해 주세요.", "error");
  }
}

document.addEventListener('DOMContentLoaded', init);
