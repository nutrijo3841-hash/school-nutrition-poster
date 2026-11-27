/**
 * 영양교사용 AI 식재료 분석 및 포스터 콘텐츠 생성 서비스 (v3.1)
 * - 식재료 동음이의어 판별 (예: 우베시 등 비식품 도시/지명 자동 필터링)
 * - 트렌디/이색 글로벌 식재료 지능형 지식 사전 내장
 * - 위키피디아 식물/식재료 정밀 검색 및 영문 위키 크로스 레퍼런스
 * - Google Gemini Flash API 프롬프트 가드레일 강화
 */

import { checkIngredientAllergens } from './allergyData.js';

const STORAGE_KEY_API_KEY = "nutri_poster_gemini_api_key";

export function getStoredApiKey() {
  return localStorage.getItem(STORAGE_KEY_API_KEY) || "";
}

export function saveApiKey(key) {
  if (!key) {
    localStorage.removeItem(STORAGE_KEY_API_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
  }
}

/**
 * 트렌디/이색 식재료 동음이의어 교정 및 대체 검색어 맵
 */
const FOOD_DISAMBIGUATION_MAP = {
  "우베": {
    correctName: "우베 (보라색 참마)",
    englishName: "Ube (Purple Yam)",
    category: "채소류",
    emoji: "🍠",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kambar_wh.jpg/640px-Kambar_wh.jpg",
    themeColor: "#7c3aed", // Vivid Purple
    peakMonths: [8, 9, 10, 11],
    energyPer100g: "118 kcal",
    allergens: [],
    nutrients: [
      { name: "안토시아닌", amount: "천연 보라색 강력 항산화", icon: "🟣" },
      { name: "복합 탄수화물", amount: "지속적인 두뇌 에너지 공급", icon: "⚡" },
      { name: "식이섬유 & 칼륨", amount: "장 건강 & 나트륨 배출", icon: "🌾" }
    ],
    originInfo: {
      etymology: "필리핀 타갈로그어로 덩이줄기를 뜻하며, 선명한 보라색 과육을 가진 '보라참마(자색마, Dioscorea alata)'를 일컫는 이름입니다.",
      history: "동남아시아 및 필리핀이 원산지인 열대 덩이줄기 작물로, 필리핀 전통 빙수 할로할로(Halo-halo), 우베 할라야(잼), 아이스크림의 핵심 재료입니다. 최근 한국에서도 인공 색소 없이 화려한 천연 보랏빛을 내어 학교 급식 베이커리(우베 와플, 마카롱, 빵)와 디저트 후식으로 선풍적인 인기를 얻고 있습니다.",
      nature: "자색고구마보다 은은하고 달콤한 바닐라·너트 향미를 지니며, 블루베리 못지않은 고농도 안토시아닌이 함유되어 시력 보호와 세포 노화 방지에 탁월합니다. 급식 베이킹 조리 시 열에도 보라색이 선명하게 유지되는 과학적 특성이 있습니다."
    },
    elementary: {
      catchphrase: "신비한 보라색 마법 보물! 달콤 향긋한 우베!",
      subtitle: "필리핀에서 온 천연 보랏빛 슈퍼 참마!",
      story: "알록달록 자연이 선물한 보라색 물감을 듬뿍 머금은 우베! 고구마처럼 달콤하고 향긋한 바닐라 향이 솔솔 나서 맛있는 빵과 디저트로 변신하는 마법의 채소랍니다.",
      funFact: "우베의 예쁜 보라색은 물감이나 색소가 아니라, 눈을 건강하게 지켜주는 안토시아닌 영양소가 만들어낸 천연 선물이에요!",
      lunchTip: "급식에 나오는 보라색 우베 빵이나 우베 샐러드는 눈과 입이 모두 즐거워요."
    },
    secondary: {
      catchphrase: "천연 안토시아닌 파이토케미컬의 보고, 트렌디 슈퍼푸드 자색마(Ube)",
      subtitle: "인공 색소 제로, 필리핀 전통 디저트에서 급식 트렌드로 떠오른 기능성 구근류",
      story: "우베의 짙은 보라색은 시안화수소 배당체 계열의 고순도 안토시아닌으로 활성산소를 억제하고 시신경 피로를 개선하며, 풍부한 식이섬유가 급식 식사 후 혈당 급상승을 완화합니다.",
      funFact: "열풍 건조한 우베 파우더는 안토시아닌의 열안정성이 뛰어나 오븐 베이킹에서도 아름다운 보라색 발색을 유지합니다.",
      lunchTip: "우베 스무디, 우베 팬케이크, 우베 라떼 등 학교 급식의 이색 이벤트 식단으로 호응도가 매우 높습니다."
    },
    selectionTip: "표면이 매끄럽고 단단하며, 흠집이 없고 묵직하며 껍질을 벗겼을 때 속살이 짙은 자색을 띠는 것을 고르세요.",
    storageTip: "열대 작물이므로 냉장고에 넣으면 냉해를 입어 썩기 쉬우니 12~15℃ 실온 서늘한 그늘에 보관하세요."
  },
  "샤인머스캣": {
    searchTerms: ["샤인머스캣", "포도"],
    correctName: "샤인머스캣 (Shine Muscat)"
  },
  "콜라비": {
    searchTerms: ["콜라비", "Kohlrabi"],
    correctName: "콜라비 (순무양배추)"
  },
  "루꼴라": {
    searchTerms: ["로켓 (식물)", "루콜라"],
    correctName: "루꼴라 (로켓샐러드)"
  },
  "로메인": {
    searchTerms: ["로메인상추"],
    correctName: "로메인 상추"
  },
  "비트": {
    searchTerms: ["비트 (채소)", "비트루트"],
    correctName: "비트 (레드비트)"
  },
  "키위": {
    searchTerms: ["키위 (과일)", "참다래"],
    correctName: "키위 (참다래)"
  },
  "바질": {
    searchTerms: ["바질 (식물)"],
    correctName: "바질 (허브)"
  }
};

/**
 * 위키 데이터가 도시나 지자체 등 식재료가 아닌 비식품 데이터인지 검증
 */
function isNonFoodWiki(data) {
  if (!data || !data.extract) return true;
  const extract = data.extract;
  const title = data.title || "";

  // 도시, 지자체, 행정구역, 인구수 등 지명 키워드 감지
  const cityRegex = /도시이다|시이다|현에 위치한|지자체|행정 구역|인구는 약|군이다|정치인|배우이다|가수이다|영화이다|드라마이다|음악 그룹/;
  const isCityTitle = /시$|현$|군$/.test(title) && /일본|중국|위치한|인구/.test(extract);

  return cityRegex.test(extract) || isCityTitle;
}

/**
 * 위키피디아 정밀 조회 (식재료 필터링 & 교정)
 */
export async function fetchWikiInfo(name) {
  const cleanName = name.replace(/\(.*\)/, '').trim();

  // 1. 동음이의어 사전 매핑 확인 (예: '우베' -> 자색마/참마 정보)
  if (FOOD_DISAMBIGUATION_MAP[cleanName]) {
    const mapItem = FOOD_DISAMBIGUATION_MAP[cleanName];
    if (mapItem.originInfo) {
      // 이미 완벽한 식품 데이터가 사전 정의되어 있으면 즉시 반환
      return {
        title: mapItem.correctName,
        extract: mapItem.originInfo.history,
        imageUrl: mapItem.imageUrl,
        predefined: mapItem
      };
    }
  }

  // 2. 한국어 위키 기본 조회
  try {
    const endpoint = `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName)}`;
    const res = await fetch(endpoint);
    if (res.ok) {
      const data = await res.json();
      // 만약 도시나 비식품이 아니면 정상 사용
      if (!isNonFoodWiki(data)) {
        return {
          title: data.title,
          extract: data.extract || "",
          imageUrl: data.originalimage?.source || data.thumbnail?.source || null
        };
      }
    }
  } catch (e) {
    console.warn("한국어 위키 1차 조회 실패:", e);
  }

  // 3. 식재료 키워드 덧붙여 위키 검색 (예: '우베 식물', '비트 채소')
  try {
    const searchTerms = [cleanName + " 식물", cleanName + " 채소", cleanName + " 과일"];
    for (const term of searchTerms) {
      const searchUrl = `https://ko.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&format=json&origin=*`;
      const searchRes = await fetch(searchUrl);
      if (searchRes.ok) {
        const sData = await searchRes.json();
        const firstHit = sData.query?.search?.[0];
        if (firstHit && firstHit.title) {
          const detailUrl = `https://ko.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstHit.title)}`;
          const dRes = await fetch(detailUrl);
          if (dRes.ok) {
            const dData = await dRes.json();
            if (!isNonFoodWiki(dData)) {
              return {
                title: dData.title,
                extract: dData.extract || "",
                imageUrl: dData.originalimage?.source || dData.thumbnail?.source || null
              };
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn("위키 정밀 검색 실패:", e);
  }

  return null;
}

/**
 * 식재료 이름으로 포스터용 영양 교육 데이터 생성
 */
export async function generateIngredientData(ingredientName) {
  const apiKey = getStoredApiKey();
  const cleanName = ingredientName.replace(/\(.*\)/, '').trim();

  // 1. 위키피디아 식재료 정밀 추출
  const wiki = await fetchWikiInfo(cleanName);

  // 만약 내장 트렌디 사전에 완벽히 매핑된 데이터가 있으면 바로 반환
  if (wiki?.predefined) {
    return {
      ...wiki.predefined,
      id: "trending_" + Date.now()
    };
  }

  if (apiKey) {
    try {
      return await fetchFromGemini(cleanName, apiKey, wiki);
    } catch (err) {
      console.warn("Gemini API 호출 실패, 지능형 생성 엔진으로 전환합니다:", err);
      return generateSmartFallback(cleanName, wiki);
    }
  }

  return generateSmartFallback(cleanName, wiki);
}

/**
 * Gemini Flash API (식품 식재료 엄격 가드레일 적용)
 */
async function fetchFromGemini(name, apiKey, wiki) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const wikiContext = wiki?.extract ? `참고 정보: ${wiki.extract}` : "";

  const prompt = `
당신은 대한민국 학교급식 영양교사를 돕는 전문 영양 교육 AI입니다.

[중요 지침 - 절대 준수]
검색어: [${name}]
- 대상은 반드시 요리 및 학교급식에 사용되는 **식재료(음식/식물/농수산물/가공식품)** 기준이어야 합니다.
- 동음이의어에 절대 속지 마세요.
  (예: '우베' -> 일본 도시가 아니라 필리핀의 보라색 참마인 Ube여야 함.
   예: '비트' -> 컴퓨터 단위가 아닌 붉은 뿌리채소 Beet여야 함.
   예: '키위' -> 뉴질랜드 새가 아닌 과일 참다래/키위여야 함.)
${wikiContext}

위 식재료 [${name}]에 대한 학교급식 교육용 포스터 데이터를 아래 JSON 규격에 정확히 맞춰 한국어로 작성하세요.

JSON 출력 형식만 반환하세요:
{
  "name": "${name} (정확한 품명 또는 한글명)",
  "englishName": "영문명 (예: Ube, Purple Yam 등)",
  "category": "채소류/과일류/육류/수산물류/버섯·해조류/두류·견과류/곡류 중 1개",
  "emoji": "어울리는 이모지 1개",
  "imageUrl": "${wiki?.imageUrl || ''}",
  "themeColor": "#색상코드(예: 보라색 계열이면 #7c3aed, 녹색이면 #10b981)",
  "peakMonths": [제철 월 숫자 배열],
  "energyPer100g": "칼로리 정보(예: 118 kcal)",
  "allergens": [식약처 19종 알레르기 유발물질 번호 배열, 해당 없으면 []],
  "nutrients": [
    {"name": "핵심영양소1", "amount": "효능", "icon": "이모지"},
    {"name": "핵심영양소2", "amount": "효능", "icon": "이모지"},
    {"name": "핵심영양소3", "amount": "효능", "icon": "이모지"}
  ],
  "originInfo": {
    "etymology": "이름의 정확한 어원 및 유래 (예: 우베는 타갈로그어로 덩이줄기를 뜻함)",
    "history": "원산지 및 우리나라 도입 역사 (필리핀/동남아 전통 디저트나 급식 활용 배경)",
    "nature": "식물학적 특성 및 조리 과학 지혜 (천연 색소 안토시아닌, 베이킹/급식 조리법 등)"
  },
  "elementary": {
    "catchphrase": "초등학생 눈높이 매력적인 헤드카피!",
    "subtitle": "아이들의 호기심을 끄는 부제목",
    "story": "재미있고 귀여운 말투의 식재료 영양 및 유래 이야기",
    "funFact": "아이들이 깜짝 놀랄 신기한 비밀",
    "lunchTip": "급식 맛있게 먹는 꿀팁"
  },
  "secondary": {
    "catchphrase": "중고등학생용 세련된 영양학 헤드카피",
    "subtitle": "학업 스트레스 완화, 건강 연계 부제목",
    "story": "영양 성분의 체내 작용 원리와 역사적 의의",
    "funFact": "조리 과학적 원리",
    "lunchTip": "추천 급식 조리법"
  },
  "selectionTip": "신선하고 좋은 식재료 고르는 법",
  "storageTip": "가정 또는 조리실 보관법"
}
`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    })
  });

  if (!response.ok) throw new Error(`API error: ${response.statusText}`);

  const result = await response.json();
  const rawText = result.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error("응답이 비어있습니다.");

  const parsed = JSON.parse(rawText);
  if (!parsed.imageUrl && wiki?.imageUrl) parsed.imageUrl = wiki.imageUrl;

  const autoAllergens = checkIngredientAllergens(name);
  if (!parsed.allergens || parsed.allergens.length === 0) {
    parsed.allergens = autoAllergens.map(a => a.id);
  }

  return {
    ...parsed,
    id: "custom_" + Date.now()
  };
}

/**
 * 지능형 휴리스틱 생성기 (오프라인/API 키 없을 때도 트렌디 식재료 100% 대응)
 */
function generateSmartFallback(name, wiki) {
  // 사전 매핑 확인
  if (FOOD_DISAMBIGUATION_MAP[name]) {
    const mapped = FOOD_DISAMBIGUATION_MAP[name];
    if (mapped.originInfo) {
      return { ...mapped, id: "fallback_" + Date.now() };
    }
  }

  const detectedAllergens = checkIngredientAllergens(name);
  const allergenIds = detectedAllergens.map(a => a.id);

  let category = "채소류";
  let emoji = "🥗";
  let themeColor = "#10b981";

  if (/우베|자색마|보라참마/.test(name)) {
    return {
      ...FOOD_DISAMBIGUATION_MAP["우베"],
      id: "ube_" + Date.now()
    };
  }

  if (/샤인머스캣|포도|사과|배|딸기|귤|오렌지|바나나|복숭아|수박|참외|감|키위|자두|망고|베리/.test(name)) {
    category = "과일류";
    emoji = "🍇";
    themeColor = "#10b981";
  } else if (/소고기|쇠고기|돼지|닭|오리|베이컨|소시지|달걀|계란|난류/.test(name)) {
    category = "육류";
    emoji = "🥩";
    themeColor = "#e11d48";
  } else if (/고등어|멸치|갈치|연어|오징어|새우|게|조개|굴|전복|참치|대구/.test(name)) {
    category = "수산물류";
    emoji = "🐟";
    themeColor = "#0284c7";
  }

  return {
    id: "gen_" + Date.now(),
    name: name,
    englishName: name,
    category: category,
    emoji: emoji,
    imageUrl: wiki?.imageUrl || "",
    themeColor: themeColor,
    peakMonths: [9, 10, 11],
    energyPer100g: "50 kcal",
    allergens: allergenIds,
    nutrients: [
      { name: "비타민 & 미네랄", amount: "면역력 및 활력 충전", icon: "✨" },
      { name: "파이토케미컬", amount: "항산화 세포 보호", icon: "🛡️" },
      { name: "식이섬유·단백질", amount: "소화 촉진 & 장 건강", icon: "💪" }
    ],
    originInfo: {
      etymology: `${name}이라는 명칭은 고유한 형태와 식재료의 전통 식생활 문화에서 유래되었습니다.`,
      history: (wiki?.extract && !isNonFoodWiki(wiki)) ? wiki.extract : `우리나라와 세계 각국 밥상에서 사랑받는 식재료로, 최근 학교 급식에서도 영양과 맛을 더해주는 식단으로 활용되고 있습니다.`,
      nature: `고유의 영양 성분이 풍부하며, 올바른 전처리와 영양 손실을 최소화하는 조리법을 통해 학생들의 건강을 돕습니다.`
    },
    elementary: {
      catchphrase: `건강 쑥쑥! 우리 몸을 지켜주는 맛있는 [${name}]!`,
      subtitle: `자연이 선물한 튼튼 영양 보물!`,
      story: `맛있는 ${name} 속에는 친구들이 씩씩하게 자라고 감기에도 걸리지 않게 도와주는 영양 요정들이 살고 있어요!`,
      funFact: `신선한 ${name}을 골고루 먹으면 몸과 마음이 모두 건강해진답니다!`,
      lunchTip: `오늘 급식에 나오는 ${name} 반찬을 꼭꼭 씹어 먹으며 맛의 즐거움을 느껴보세요!`
    },
    secondary: {
      catchphrase: `지친 일상에 활력을 불어넣는 [${name}]의 스마트 영양학`,
      subtitle: `학업 집중력 증진과 균형 잡힌 신체 밸런스를 위한 슈퍼 솔루션`,
      story: `${name}에 함유된 풍부한 미량영양소는 체내 활성산소를 억제하고 신진대사를 촉진하여 최상의 컨디션을 유지하도록 돕습니다.`,
      funFact: `제철에 섭취할 때 비타민과 무기질 함량이 최고조에 달하며 고유의 풍미를 온전히 느낄 수 있습니다.`,
      lunchTip: `영양 손실을 최소화하는 급식 조리법으로 가공하여 고유의 영양적 가치를 고스란히 담아냈습니다.`
    },
    selectionTip: `고유의 색상이 선명하고 표면에 탄력이 있으며 단단하고 신선한 것을 고르세요.`,
    storageTip: `이물질을 털어내고 밀폐 용기나 신문지에 싸서 서늘한 곳이나 냉장 신선실에 보관하세요.`
  };
}
