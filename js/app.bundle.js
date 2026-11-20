/**
 * 영양쏙쏙 (Nutri-Poster) 완전 통합 단일 번들 (v4.0)
 * - 5대 필수 핵심 요소 집중 (식재료명, 사진, 유래, 영양성분, 영양팁)
 * - 원거리 게시판 가독성을 위한 20pt급 대형 폰트 및 여백 최적화
 * - 영양교사 커스텀 수정사항 (사진 교체, 텍스트 편집) 브라우저 영구 자동저장 (Auto-Save)
 * - 원클릭 원본 복원 (Reset) 기능
 * - 브라우저 file:/// 및 http:// 완전 호환
 */
(function () {
  'use strict';

/* === MODULE: allergyData.js === */
/**
 * 대한민국 교육부 및 식품의약품안전처 지정 학교급식 알레르기 유발물질 19종 정보
 */
const ALLERGENS_19 = [
  { id: 1, name: "난류", detail: "달걀, 메추리알 등 가금류 알", icon: "🥚" },
  { id: 2, name: "우유", detail: "우유 및 유제품(치즈, 버터, 요거트 등)", icon: "🥛" },
  { id: 3, name: "메밀", detail: "메밀 국수, 메밀묵 등", icon: "🌾" },
  { id: 4, name: "땅콩", detail: "땅콩, 땅콩버터 등", icon: "🥜" },
  { id: 5, name: "대두", detail: "콩, 두부, 된장, 간장, 두유 등", icon: "🫘" },
  { id: 6, name: "밀", detail: "밀가루, 빵, 면류, 전 등", icon: "🍞" },
  { id: 7, name: "고등어", detail: "고등어 및 등푸른생선류", icon: "🐟" },
  { id: 8, name: "게", detail: "꽃게, 홍게, 대게 등", icon: "🦀" },
  { id: 9, name: "새우", detail: "대하, 보리새우, 칵테일새우 등", icon: "🦐" },
  { id: 10, name: "돼지고기", detail: "삼겹살, 목살, 햄, 소시지 등", icon: "🥓" },
  { id: 11, name: "복숭아", detail: "백도, 황도, 천도복숭아 등", icon: "🍑" },
  { id: 12, name: "토마토", detail: "토마토, 방울토마토, 케첩 등", icon: "🍅" },
  { id: 13, name: "아황산류", detail: "건조 과일, 포도주 등 잔류 SO2", icon: "🧪" },
  { id: 14, name: "호두", detail: "호두 및 견과류 제품", icon: "🌰" },
  { id: 15, name: "닭고기", detail: "닭고기, 치킨, 닭가슴살 등", icon: "🍗" },
  { id: 16, name: "쇠고기", detail: "소고기, 사골, 쇠고기 육수가공품 등", icon: "🥩" },
  { id: 17, name: "오징어", detail: "오징어, 한치 등", icon: "🦑" },
  { id: 18, name: "조개류", detail: "굴, 전복, 홍합, 바지락, 꼬막 등 포함", icon: "🦪" },
  { id: 19, name: "잣", detail: "잣 및 잣 함유 소스/음식", icon: "🌲" }
];

/**
 * 식재료 이름과 기본 정보를 바탕으로 알레르기 19종 해당 여부를 판별하는 유틸
 */
function checkIngredientAllergens(name, explicitIds = []) {
  if (explicitIds && explicitIds.length > 0) {
    return explicitIds.map(id => ALLERGENS_19.find(a => a.id === id)).filter(Boolean);
  }

  const detected = [];
  const cleanName = name.replace(/\s+/g, '');

  if (/계란|달걀|메추리알|난류/.test(cleanName)) detected.push(1);
  if (/우유|치즈|버터|요거트|유청|연유/.test(cleanName)) detected.push(2);
  if (/메밀/.test(cleanName)) detected.push(3);
  if (/땅콩/.test(cleanName)) detected.push(4);
  if (/대두|콩|두부|유부|청국장|된장|간장/.test(cleanName) && !/강낭콩|완두콩/.test(cleanName)) detected.push(5);
  if (/밀|밀가루|파스타|소면|칼국수|빵/.test(cleanName)) detected.push(6);
  if (/고등어/.test(cleanName)) detected.push(7);
  if (/게|꽃게|홍게|대게/.test(cleanName) && !/게살/.test(cleanName)) detected.push(8);
  if (/새우|대하/.test(cleanName)) detected.push(9);
  if (/돼지|돈육|삼겹|목살|베이컨|햄|소시지/.test(cleanName)) detected.push(10);
  if (/복숭아|천도/.test(cleanName)) detected.push(11);
  if (/토마토/.test(cleanName)) detected.push(12);
  if (/호두/.test(cleanName)) detected.push(14);
  if (/닭|치킨|닭봉|닭날개/.test(cleanName)) detected.push(15);
  if (/쇠고기|소고기|우육|한우/.test(cleanName)) detected.push(16);
  if (/오징어|한치/.test(cleanName)) detected.push(17);
  if (/조개|굴|전복|홍합|바지락|꼬막|가리비|재첩/.test(cleanName)) detected.push(18);
  if (/잣/.test(cleanName)) detected.push(19);

  return detected.map(id => ALLERGENS_19.find(a => a.id === id)).filter(Boolean);
}


/* === MODULE: ingredients.js === */
/**
 * 전국 유·초·중·고등학교 급식 다빈도 식재료 종합 데이터베이스 (50선)
 * - 국가표준식품성분표 및 학교급식 영양관리기준 반영
 * - 유/초등 눈높이 교육스토리 vs 중/고등 영양지식 분리
 * - 제철 월(1~12월), 알레르기 19종 매핑, 영양소 3대 핵심 뱃지, 조리/고르는 팁
 */

const INGREDIENTS_DATABASE = [
  {
    id: "taro",
    name: "토란 (土卵)",
    englishName: "Taro",
    category: "채소류",
    emoji: "🥔",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/TaroAKL.jpg/640px-TaroAKL.jpg",
    themeColor: "#854d0e",
    allergens: [],
    peakMonths: [9, 10, 11],
    energyPer100g: "58 kcal",
    nutrients: [
      { name: "뮤신·갈락탄", amount: "위벽 보호 & 면역 강화", icon: "🛡️" },
      { name: "칼륨 (고구마 2배)", amount: "나트륨 배출 & 혈압 안정", icon: "💧" },
      { name: "식이섬유", amount: "장 건강 & 원활한 소화", icon: "🌾" }
    ],
    originInfo: {
      etymology: "흙(土) 속에 낳은 동그란 알(卵)처럼 생겼다고 하여 '토란(土卵)'이라는 이름이 붙었습니다. 줄기는 말려 '토란대'로 먹습니다.",
      history: "열대 아시아가 원산지인 천남성과 여러해살이 작물로, 고려 시대 의약서 《향약구급방(1236년)》에도 기록된 우리나라 전통 구황작물입니다. 예로부터 가을 추석 명절에 토란탕(토란국)을 끓여 먹는 고유의 전통 풍습이 있습니다.",
      nature: "토란의 미끈거리는 성분은 위벽을 감싸주는 '뮤신'입니다. 생으로 만지면 가려운 이유는 바늘 모양의 '옥살산칼슘(수산칼슘)' 결정 때문이므로, 쌀뜨물이나 소금물에 삶아 독성과 떫은맛을 제거하고 조리하는 조상들의 지혜가 담겨 있습니다."
    },
    elementary: {
      catchphrase: "흙 속에서 찾은 신비한 알! 땅속의 보물 토란!",
      subtitle: "가을 추석 밥상의 주인공, 미끈미끈 튼튼 영양 덩어리!",
      story: "토란은 흙(土) 속에 낳은 동글동글한 알(卵)처럼 생겨서 토란이라는 이름이 생겼어요! 넓고 커다란 잎사귀는 비 올 때 우산이 되어주고, 땅속 뿌리는 우리 배를 따뜻하고 든든하게 채워주는 고마운 가을 보물이랍니다.",
      funFact: "토란 잎사귀는 방수 코팅이 되어 있어 물방울이 스며들지 않고 보석처럼 또르르 굴러가요! 만화 영화 토토로가 우산 대신 쓴 커다란 잎이 바로 토란잎이랍니다!",
      lunchTip: "추석 무렵 급식에 나오는 따끈하고 구수한 소고기 토란국은 밥 한 그릇 말아 먹으면 속이 사르르 편안해져요."
    },
    secondary: {
      catchphrase: "위 점막을 보호하고 나트륨을 배출하는 가을의 알칼리성 슈퍼푸드",
      subtitle: "고려 시대부터 이어온 전통 구황작물, 뮤신과 고농도 칼륨의 보고",
      story: "토란의 당단백질인 뮤신과 갈락탄은 소화관 점막을 보호하고 면역 세포를 자극하며, 풍부한 칼륨이 급식 속 잔여 나트륨을 배출시켜 학업 스트레스로 인한 부종을 완화합니다.",
      funFact: "생토란의 침상수산칼슘(Calcium oxalate)은 피부를 찌르듯 가렵게 하므로, 쌀뜨물이나 식초물로 데쳐 알칼리/산 중화하는 과학적 전처리가 필수입니다.",
      lunchTip: "토란 들깨탕, 토란 갈비찜, 바삭한 토란 크로켓 등 다양한 급식 메뉴로 포만감과 영양을 동시에 잡습니다."
    },
    selectionTip: "모양이 둥글고 단단하며, 껍질에 흙이 적당히 묻어있고 머리 부분 줄기 자른 자리가 신선한 것을 고르세요.",
    storageTip: "추위에 매우 약하므로 절대 냉장고에 넣지 말고, 흙이 묻은 채 신문지에 싸서 10~15℃ 실온 서늘한 곳에 보관하세요."
  },
  {
    id: "ube",
    name: "우베 (보라색 참마)",
    englishName: "Ube (Purple Yam)",
    category: "채소류",
    emoji: "🍠",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Kambar_wh.jpg/640px-Kambar_wh.jpg",
    themeColor: "#7c3aed",
    allergens: [],
    peakMonths: [8, 9, 10, 11],
    energyPer100g: "118 kcal",
    nutrients: [
      { name: "안토시아닌", amount: "천연 보라색 강력 항산화", icon: "🟣" },
      { name: "복합 탄수화물", amount: "지속적인 뇌 에너지 공급", icon: "⚡" },
      { name: "식이섬유 & 칼륨", amount: "장 건강 & 나트륨 배출", icon: "🌾" }
    ],
    originInfo: {
      etymology: "필리핀 타갈로그어로 덩이줄기를 뜻하며, 선명한 보라색 과육을 가진 '보라참마(자색마, Dioscorea alata)'를 일컫는 이름입니다.",
      history: "동남아시아 및 필리핀이 원산지인 열대 작물로, 필리핀 전통 빙수 할로할로(Halo-halo), 우베 할라야(잼), 아이스크림의 핵심 재료입니다. 최근 한국에서도 인공 색소 없이 화려한 천연 보랏빛을 내어 학교 급식 베이커리(우베 와플, 마카롱, 빵)와 디저트 후식으로 선풍적인 인기를 얻고 있습니다.",
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
  {
    id: "spinach",
    name: "시금치",
    englishName: "Spinach",
    category: "채소류",
    emoji: "🥬",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop&q=80",
    themeColor: "#10b981", // Emerald
    allergens: [],
    peakMonths: [11, 12, 1, 2, 3],
    energyPer100g: "23 kcal",
    nutrients: [
      { name: "루테인·비타민A", amount: "눈 건강 보호", icon: "👁️" },
      { name: "철분", amount: "빈혈 예방 & 활력", icon: "🩸" },
      { name: "엽산", amount: "두뇌 발달 & 세포 성장", icon: "🧠" }
    ],
    originInfo: {
      etymology: "페르시아(현재의 이란)가 원산지로, 중국을 거쳐 한자 '파릉초(波稜菜)'에서 '시금치'로 음운 변천된 이름입니다.",
      history: "중앙아시아 실크로드를 통해 전파되어 조선 초기에 우리나라에 도입되었습니다. 성종 때 문헌에 기록되어 오랜 기간 겨울철 비타민 보급원으로 중용되었습니다.",
      nature: "떫은맛을 내는 수산(Oxalic acid) 성분은 끓는 물에 소금을 넣고 살짝 데쳐내면 80% 이상 제거되어 칼슘 결석을 예방할 수 있습니다."
    },
    allergens: [],
    peakMonths: [11, 12, 1, 2, 3],
    energyPer100g: "23 kcal",
    nutrients: [
      { name: "루테인·비타민A", amount: "눈 건강 보호", icon: "👁️" },
      { name: "철분", amount: "빈혈 예방 & 활력", icon: "🩸" },
      { name: "엽산", amount: "두뇌 발달 & 세포 성장", icon: "🧠" }
    ],
    elementary: {
      catchphrase: "뽀빠이도 반한 초록빛 영양 대장!",
      subtitle: "초록 요정 시금치를 먹고 쑥쑥 자라나요!",
      story: "시금치 속에는 피를 맑게 해주고 눈을 번쩍 뜨이게 하는 초록 비타민이 가득해요. 힘이 불끈 솟아나는 뽀빠이 아저씨의 마법 채소랍니다!",
      funFact: "겨울철 찬바람을 맞고 자란 남해·포항 시금치는 얼었다 녹기를 반복해 설탕처럼 달콤해요!",
      lunchTip: "고소한 참깨와 참기름을 솔솔 뿌린 시금치나물은 밥도둑이에요."
    },
    secondary: {
      catchphrase: "지친 눈과 뇌를 깨우는 그린 슈퍼푸드",
      subtitle: "수험 생활과 디지털 피로를 날리는 비타민 & 엽산의 보고",
      story: "풍부한 루테인과 제아잔틴은 전자기기 블루라이트로부터 망막을 보호하며, 비타민K와 엽산은 인지 기능 향상과 뇌 피로 회복을 돕습니다.",
      funFact: "지용성 비타민이 많아 기름(들기름, 올리브유)과 함께 조리하면 영양소 흡수율이 최대 5배까지 높아집니다.",
      lunchTip: "조리 시 살짝 데쳐 수산(Oxalic acid) 성분을 줄이면 칼슘 흡수가 더욱 좋아집니다."
    },
    selectionTip: "잎이 짙은 녹색을 띠고 윤기가 흐르며, 뿌리 쪽이 선명한 붉은색을 띠는 것이 달고 맛있습니다.",
    storageTip: "흙이 묻은 채로 키친타월에 싸서 세워 냉장 보관하면 1주일간 싱싱함이 유지됩니다."
  },
  {
    id: "tomato",
    name: "토마토",
    englishName: "Tomato",
    category: "채소류",
    emoji: "🍅",
    themeColor: "#ef4444", // Red
    allergens: [12],
    peakMonths: [5, 6, 7, 8, 9],
    energyPer100g: "19 kcal",
    nutrients: [
      { name: "라이코펜", amount: "강력한 항산화", icon: "🛡️" },
      { name: "비타민 C", amount: "면역력 & 피부 건강", icon: "✨" },
      { name: "칼륨", amount: "나트륨 배출", icon: "💧" }
    ],
    elementary: {
      catchphrase: "빨간 토마토가 웃으면 의사 선생님 얼굴이 파래진대요!",
      subtitle: "빨갛게 잘 익은 방울방울 슈퍼 비타민!",
      story: "토마토의 빨간 옷 속에는 우리 몸의 병균을 물리쳐주는 튼튼 방패(라이코펜)가 가득 차 있어요. 매일 하나씩 먹으면 감기 귀신도 도망친답니다!",
      funFact: "토마토는 과일일까요, 채소일까요? 정답은 밭에서 자라는 '열매채소(채소)'랍니다!",
      lunchTip: "학교 급식에 나오는 알록달록 방울토마토는 껍질째 톡 터뜨려 먹어요."
    },
    secondary: {
      catchphrase: "활성산소를 잡는 붉은 파이토케미컬의 힘",
      subtitle: "학습 스트레스 완화와 혈관 건강을 책임지는 라이코펜",
      story: "토마토의 붉은 색소 라이코펜은 활성산소를 억제하는 강력한 항산화제로, 혈압 안정과 심혈관 질환 예방에 탁월한 효능을 보입니다.",
      funFact: "설탕을 뿌려 먹으면 비타민 B1이 파괴되므로, 올리브유 등 기름에 살짝 익혀 먹을 때 라이코펜 체내 흡수율이 급증합니다.",
      lunchTip: "토마토 스튜, 파스타, 샐러드 등 다양한 조리법으로 즐기면 영양 밸런스가 극대화됩니다."
    },
    selectionTip: "껍질에 탄력이 있고 윤기가 나며, 꼭지가 마르지 않고 초록빛을 띠는 단단한 것을 고르세요.",
    storageTip: "냉장고에 넣으면 단맛과 향이 줄어드므로 바구니에 담아 통풍이 잘되는 실온에 보관하세요."
  },
  {
    id: "pumpkin",
    name: "단호박",
    englishName: "Sweet Pumpkin",
    category: "채소류",
    emoji: "🎃",
    themeColor: "#f59e0b", // Amber
    allergens: [],
    peakMonths: [7, 8, 9, 10],
    energyPer100g: "66 kcal",
    nutrients: [
      { name: "베타카로틴", amount: "면역력 증진", icon: "🌟" },
      { name: "식이섬유", amount: "장 건강 & 쾌변", icon: "🌾" },
      { name: "비타민 E", amount: "노화 방지 & 활력", icon: "⚡" }
    ],
    elementary: {
      catchphrase: "달콤달콤 노란 보물상자 단호박!",
      subtitle: "설탕보다 달콤하고 영양은 두 배!",
      story: "노란 속살 속에는 밤보다 달콤한 꿀맛과 함께 우리 눈을 반짝이게 해주는 노란 영양소가 듬뿍 들어있어요. 맛있는 단호박죽 한 그릇이면 배가 든든!",
      funFact: "단호박은 씨앗에도 머리가 똑똑해지는 불포화지방산이 풍부해서 볶아 먹기도 해요!",
      lunchTip: "달콤한 단호박 샐러드나 바삭한 단호박 튀김은 급식 인기 만점 메뉴!"
    },
    secondary: {
      catchphrase: "소화 흡수율이 뛰어난 천연 에너지 충전소",
      subtitle: "풍부한 펙틴과 베타카로틴으로 붓기 완화 및 소화기 보호",
      story: "단호박의 당질은 소화 흡수가 빨라 체력 보충에 우수하며, 수용성 식이섬유인 펙틴이 장내 유해물질을 흡착 배출하고 위벽을 부드럽게 보호합니다.",
      funFact: "겉껍질에 항산화 페놀산이 밀집되어 있으므로 깨끗이 씻어 껍질째 섭취하는 것이 좋습니다.",
      lunchTip: "단호박 훈제오리 구이, 단호박 크림스프 등 든든한 일품요리로 제격입니다."
    },
    selectionTip: "색이 짙은 녹색이고 골이 깊으며, 손으로 들었을 때 묵직하고 꼭지가 잘 마른 것을 고르세요.",
    storageTip: "통째로는 서늘한 그늘에 보관하고, 자른 후에는 씨를 긁어내고 랩으로 감싸 냉장 보관합니다."
  },
  {
    id: "mackerel",
    name: "고등어",
    englishName: "Mackerel",
    category: "수산물류",
    emoji: "🐟",
    themeColor: "#0284c7", // Sky blue
    allergens: [7],
    peakMonths: [9, 10, 11],
    energyPer100g: "183 kcal",
    nutrients: [
      { name: "DHA·EPA", amount: "두뇌 회전 & 혈관 청소", icon: "🧠" },
      { name: "오메가-3", amount: "집중력 및 기억력 향상", icon: "⚡" },
      { name: "비타민 D", amount: "칼슘 흡수 & 뼈 강화", icon: "🦴" }
    ],
    elementary: {
      catchphrase: "바다의 보약! 등 푸른 생선 대장 고등어!",
      subtitle: "머리가 쑥쑥 좋아지는 오메가-3가 퐁당!",
      story: "파란 바다를 힘차게 헤엄치는 고등어의 등에는 머리가 팽팽 돌아가게 돕는 DHA가 가득 차 있어요. 뼈도 튼튼하게 자라게 해준답니다!",
      funFact: "고등어 등 쪽의 물결무늬는 바다 위에서 날아오는 갈매기로부터 몸을 숨기는 보호색이에요!",
      lunchTip: "달콤짭조름한 고등어 무조림이나 바삭한 카레 고등어구이로 맛있게 먹어요."
    },
    secondary: {
      catchphrase: "수험생 뇌세포를 활성화하는 브레인 푸드",
      subtitle: "풍부한 오메가-3 불포화지방산으로 뇌 혈류 개선과 혈행 촉진",
      story: "등푸른생선의 대표주자인 고등어는 오메가-3 지방산(EPA/DHA) 함량이 압도적으로 높아 뇌세포막을 구성하고 혈중 중성지방 수치를 개선합니다.",
      funFact: "비타민 B2와 나이아신이 풍부해 피부염과 구내염 예방에도 탁월합니다.",
      lunchTip: "생강, 레몬즙, 된장을 활용해 비린내를 잡고 그릴에 바삭하게 구워내면 풍미가 배가됩니다."
    },
    selectionTip: "눈동자가 맑고 튀어나와 있으며, 등 쪽의 푸른색과 물결무늬가 선명하고 살이 탄력 있는 것이 좋습니다.",
    storageTip: "아가미와 내장을 제거한 뒤 굵은 소금을 뿌려 밀폐 용기에 담아 냉동 보관하세요."
  },
  {
    id: "lotus_root",
    name: "연근",
    englishName: "Lotus Root",
    category: "채소류",
    emoji: "🪷",
    themeColor: "#8b5cf6", // Purple
    allergens: [],
    peakMonths: [10, 11, 12, 1, 2],
    energyPer100g: "67 kcal",
    nutrients: [
      { name: "뮤신", amount: "위벽 보호 & 소화 촉진", icon: "🛡️" },
      { name: "탄닌", amount: "지혈 & 소염 작용", icon: "🩹" },
      { name: "비타민 C", amount: "피로 해소 & 면역력", icon: "🍋" }
    ],
    elementary: {
      catchphrase: "동글동글 구멍 숭숭! 재미난 연근 탐험대!",
      subtitle: "구멍 사이로 엿보는 건강한 땅속 보물!",
      story: "연꽃이 자라는 진흙 속에서 건져 올린 연근! 송송 뚫린 구멍으로 숨을 쉬며 자랐대요. 코피가 자주 나거나 감기에 잘 걸리는 친구들에게 최고의 친구랍니다!",
      funFact: "연근을 썰었을 때 실처럼 늘어나는 끈적끈적한 성분은 우리 위장을 튼튼하게 지켜주는 '뮤신'이에요!",
      lunchTip: "바삭하고 달콤한 연근 칩이나 쫀득쫀득 연근조림은 영양 만점 반찬이에요."
    },
    secondary: {
      catchphrase: "위장 점막을 지키고 피를 맑게 하는 뿌리채소",
      subtitle: "탄닌의 수렴 작용과 풍부한 식이섬유로 장내 유익균 증식",
      story: "연근의 떫은맛을 내는 탄닌 성분은 수렴 및 지혈 작용이 뛰어나며, 뮤신은 소화효소의 작용을 돕고 위벽을 보호하여 불규칙한 식습관을 가진 학생들에게 유익합니다.",
      funFact: "연근 속 비타민 C는 녹말 입자에 둘러싸여 있어 열을 가해도 쉽게 파괴되지 않습니다.",
      lunchTip: "식초물에 살짝 담그면 갈변을 방지하고 특유의 아린 맛을 깔끔하게 제거할 수 있습니다."
    },
    selectionTip: "마디가 굵고 일직선이며 흠집이 없고, 표면에 흙이 적당히 묻어있으며 자른 단면이 백색인 것을 고르세요.",
    storageTip: "흙이 묻은 채로 신문지에 싸서 서늘한 곳에 두고, 썬 것은 식초물에 담가 냉장 보관합니다."
  },
  {
    id: "paprika",
    name: "파프리카",
    englishName: "Paprika / Bell Pepper",
    category: "채소류",
    emoji: "🫑",
    themeColor: "#ea580c", // Orange
    allergens: [],
    peakMonths: [5, 6, 7, 8],
    energyPer100g: "20 kcal",
    nutrients: [
      { name: "비타민 C", amount: "레몬의 2배, 사과의 40배!", icon: "🍋" },
      { name: "카로티노이드", amount: "피부 미용 & 항산화", icon: "🎨" },
      { name: "칼륨", amount: "체내 노폐물 배출", icon: "💧" }
    ],
    elementary: {
      catchphrase: "알록달록 무지개 보석 채소 파프리카!",
      subtitle: "빨강, 주황, 노랑, 초록! 골라 먹는 재미!",
      story: "아삭아삭 씹을 때마다 달콤한 즙이 팡팡 터져요! 사과보다 비타민 C가 훨씬 많아서 예쁜 피부와 튼튼한 면역력을 선물해 주는 알록달록 친구랍니다.",
      funFact: "빨간 파프리카는 칼슘이 듬뿍, 주황은 감기 예방, 노랑은 스트레스 해소에 으뜸이에요!",
      lunchTip: "아삭한 파프리카 잡채와 파프리카 볶음밥은 눈과 입이 모두 즐거워요."
    },
    secondary: {
      catchphrase: "컬러풀한 파이토케미컬로 채우는 일일 비타민",
      subtitle: "색상별 차별화된 항산화 물질과 수분 충전 솔루션",
      story: "파프리카 반 개만 섭취해도 하루 비타민 C 권장량을 충족할 수 있으며, 캡산틴과 제아잔틴 등 카로티노이드가 풍부하여 피부 노화 방지와 시력 보호에 기여합니다.",
      funFact: "매운맛 캡사이신이 거의 없어 위장에 부담을 주지 않으며 당도가 7~10 Brix로 매우 높습니다.",
      lunchTip: "단백질 식품(닭가슴살, 소고기)과 함께 볶으면 지용성 비타민 흡수율이 배가됩니다."
    },
    selectionTip: "색상이 선명하고 꼭지가 마르지 않았으며, 표면이 단단하고 흠집 없이 팽팽한 것을 고르세요.",
    storageTip: "물기를 닦고 랩으로 하나씩 밀봉하여 냉장고 채소칸에 보관하면 2주 이상 신선합니다."
  },
  {
    id: "beef",
    name: "쇠고기",
    englishName: "Beef",
    category: "육류",
    emoji: "🥩",
    themeColor: "#b91c1c", // Dark Red
    allergens: [16],
    peakMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    energyPer100g: "218 kcal",
    nutrients: [
      { name: "양질의 단백질", amount: "근육 생성 & 성장 발달", icon: "💪" },
      { name: "헴철분", amount: "흡수율 높은 빈혈 예방", icon: "🩸" },
      { name: "아연", amount: "면역 세포 성장", icon: "🛡️" }
    ],
    elementary: {
      catchphrase: "근육 튼튼! 키 쑥쑥! 힘이 솟는 쇠고기!",
      subtitle: "우리 몸을 든든하게 받쳐주는 힘센 영양소!",
      story: "달리고 뛰놀 때 필요한 튼튼한 근육을 만들어 주는 1등 공신이에요. 쇠고기 속 철분은 우리 온몸에 산소를 배달해 피로를 싹 날려줍니다!",
      funFact: "쇠고기에 들어있는 철분은 식물성 철분보다 우리 몸에 3배나 더 쏙쏙 잘 흡수돼요!",
      lunchTip: "구수한 소고기 미역국이나 달콤한 소불고기는 우리 학교 급식 최고의 인기 메뉴!"
    },
    secondary: {
      catchphrase: "성장기 근육 형성과 필수 아미노산의 원천",
      subtitle: "조혈 작용을 돕는 헴철과 면역계 핵심 미네랄 아연의 결합",
      story: "쇠고기는 신체 성장에 필수적인 8대 필수 아미노산을 고루 갖춘 완전단백질 식품으로, 성장기 청소년의 골격 형성 및 체조직 합성에 결정적인 역할을 합니다.",
      funFact: "참기름 등 불포화지방산과 함께 조리하면 콜레스테롤 흡수를 억제하는 효과가 있습니다.",
      lunchTip: "채소(버섯, 양파, 파프리카)와 곁들여 섬유소와 비타민을 보충하면 완벽한 균형 식단이 됩니다."
    },
    selectionTip: "고기 색이 밝은 선홍색을 띠고, 지방은 백색이나 미황색이며 탄력이 있는 것을 고르세요.",
    storageTip: "공기와 닿지 않도록 올리브유를 살짝 바르거나 랩으로 밀봉하여 신선실에 냉장 보관하세요."
  },
  {
    id: "shiitake",
    name: "표고버섯",
    englishName: "Shiitake Mushroom",
    category: "버섯·해조류",
    emoji: "🍄",
    themeColor: "#78350f", // Brown
    allergens: [],
    peakMonths: [3, 4, 5, 9, 10],
    energyPer100g: "38 kcal",
    nutrients: [
      { name: "베타글루칸", amount: "면역력 증강 & 항암", icon: "🛡️" },
      { name: "비타민 D (에르고스테롤)", amount: "칼슘 흡수 & 뼈 강화", icon: "🦴" },
      { name: "에리타데닌", amount: "혈중 콜레스테롤 저하", icon: "❤️" }
    ],
    elementary: {
      catchphrase: "숲속의 고기! 쫄깃쫄깃 향긋한 표고버섯!",
      subtitle: "햇살을 머금은 뼈 튼튼 영양 버섯!",
      story: "숲속 참나무에서 자라는 표고버섯은 고기처럼 쫄깃하고 깊은 맛이 나요. 햇볕을 듬뿍 받아 뼈를 튼튼하게 해주는 비타민 D가 아주 풍부하답니다!",
      funFact: "말린 표고버섯을 햇볕에 1시간만 두면 비타민 D 함량이 수십 배로 껑충 뛰어요!",
      lunchTip: "표고버섯 탕수나 표고 쇠고기 볶음으로 먹으면 씹는 맛이 최고예요."
    },
    secondary: {
      catchphrase: "면역 활성물질 베타글루칸과 혈관 정화의 정수",
      subtitle: "에리타데닌으로 고혈압 예방, 천연 감칠맛 구아닐산의 보고",
      story: "표고버섯의 베타글루칸은 백혈구 생성을 자극해 면역력을 극대화하며, 에리타데닌 성분이 혈액 순환을 원활하게 하고 혈압 상승을 억제합니다.",
      funFact: "특유의 풍미를 내는 렌티오닌 성분은 정신을 맑게 하고 식욕을 돋우는 역할을 합니다.",
      lunchTip: "국물 요리의 천연 조미료로 활용하면 나트륨 섭취를 대폭 줄이면서 깊은 맛을 냅니다."
    },
    selectionTip: "갓이 너무 피지 않고 둥글며, 갓 안쪽 주름이 백색이고 깨끗한 것을 고르세요.",
    storageTip: "물에 씻지 않고 키친타월에 싸서 밀폐 용기에 담아 냉장 보관하거나, 썰어서 건조 보관합니다."
  },
  {
    id: "tofu",
    name: "두부 (콩)",
    englishName: "Tofu",
    category: "두류·견과류",
    emoji: "🫘",
    themeColor: "#eab308", // Yellow
    allergens: [5],
    peakMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    energyPer100g: "84 kcal",
    nutrients: [
      { name: "식물성 단백질", amount: "밭에서 나는 소고기", icon: "💪" },
      { name: "칼슘", amount: "성장기 치아 & 뼈 형성", icon: "🦷" },
      { name: "레시틴·이소플라본", amount: "두뇌 발달 & 세포 보호", icon: "🧠" }
    ],
    elementary: {
      catchphrase: "하얗고 보들보들! 밭에서 나는 쇠고기 두부!",
      subtitle: "작은 콩알이 마법을 부려 하얀 두부가 되었어요!",
      story: "동글동글 대두콩이 뽀글뽀글 끓여져 부드러운 두부로 변신했어요! 고기만큼 단백질이 많아서 우리 몸을 튼튼하고 씩씩하게 자라게 해준답니다.",
      funFact: "두부는 콩보다 소화 흡수가 훨씬 잘되어 소화율이 무려 95%나 돼요!",
      lunchTip: "바삭한 두부 강정과 따끈따끈 두부 된장찌개로 맛있게 냠냠!"
    },
    secondary: {
      catchphrase: "콜레스테롤 제로, 고단백 저칼로리의 이상적 식품",
      subtitle: "이소플라본과 사포닌의 항산화 작용 및 두뇌 활성화 레시틴",
      story: "두부는 칼슘과 철분이 풍부하면서 포화지방산이 낮아 심혈관 건강에 최적이며, 콩 레시틴은 뇌세포막을 구성하는 콜린을 공급하여 집중력 향상을 돕습니다.",
      funFact: "김치와 함께 섭취하면 두부의 단백질과 김치의 비타민/유산균이 상호 보완되어 영양적 시너지를 냅니다.",
      lunchTip: "마파두부, 두부 스테이크, 두부면 샐러드 등 다양한 퓨전 요리로 활용도가 높습니다."
    },
    selectionTip: "모양이 반듯하고 팩 속 물이 맑으며, 단단하면서도 탄력이 느껴지는 것을 고르세요.",
    storageTip: "밀폐 용기에 두부가 잠길 정도로 찬물을 붓고 소금을 약간 넣어 냉장 보관하며 매일 물을 갈아줍니다."
  },
  {
    id: "strawberry",
    name: "딸기",
    englishName: "Strawberry",
    category: "과일류",
    emoji: "🍓",
    themeColor: "#f43f5e", // Rose
    allergens: [],
    peakMonths: [1, 2, 3, 4, 5],
    energyPer100g: "32 kcal",
    nutrients: [
      { name: "비타민 C", amount: "사과의 10배!", icon: "🍋" },
      { name: "안토시아닌", amount: "시력 회복 & 항산화", icon: "👁️" },
      { name: "엽산", amount: "피로 회복 & 세포 생성", icon: "⚡" }
    ],
    elementary: {
      catchphrase: "달콤 상큼 빨간 요정 딸기!",
      subtitle: "씨앗이 밖에 콕콕 박힌 신비한 열매!",
      story: "봄 향기를 가득 품은 달콤한 딸기는 한 입 베어 물면 비타민 요정이 입안 가득 팡팡! 감기를 쫓아내고 활기찬 하루를 선물해 줘요.",
      funFact: "딸기 겉에 콕콕 박힌 점들은 씨앗이 아니라 하나하나가 진짜 작은 열매랍니다!",
      lunchTip: "달콤한 생딸기와 딸기 요거트는 급식 디저트 중 단연 1등!"
    },
    secondary: {
      catchphrase: "환절기 피로를 녹이는 천연 안토시아닌의 보고",
      subtitle: "엘라그산의 항산화 기전과 스트레스 호르몬 완화",
      story: "딸기의 붉은색을 띠는 안토시아닌은 눈의 피로를 덜어주고 시각 기능을 촉진하며, 풍부한 펙틴은 혈중 콜레스테롤을 낮추고 장 건강을 돕습니다.",
      funFact: "물에 30초 이상 담가두면 수용성 비타민 C가 물에 녹아 빠져나가므로 꼭지를 떼지 않고 빠르게 씻어야 합니다.",
      lunchTip: "우유나 유제품과 함께 먹으면 딸기의 구연산이 칼슘 흡수를 촉진합니다."
    },
    selectionTip: "꼭지가 마르지 않고 진한 초록색을 띠며, 꽃받침이 뒤로 젖혀져 있고 꼭지 부위까지 붉은빛이 선명한 것을 고르세요.",
    storageTip: "물에 씻지 않고 꼭지를 둔 채 키친타월을 깐 밀폐 용기에 겹치지 않게 담아 냉장 보관합니다."
  },
  {
    id: "broccoli",
    name: "브로콜리",
    englishName: "Broccoli",
    category: "채소류",
    emoji: "🥦",
    themeColor: "#15803d",
    allergens: [],
    peakMonths: [10, 11, 12, 1, 2, 3],
    energyPer100g: "28 kcal",
    nutrients: [
      { name: "설포라판", amount: "강력한 항암 & 면역 활성", icon: "🛡️" },
      { name: "비타민 C", amount: "레몬의 2배", icon: "✨" },
      { name: "카로틴", amount: "점막 보호 & 호흡기 건강", icon: "🫁" }
    ],
    elementary: {
      catchphrase: "초록빛 작은 나무 요정 브로콜리!",
      subtitle: "내 몸을 지키는 튼튼 요새를 지어요!",
      story: "작은 미니 나무처럼 생긴 브로콜리에는 나쁜 세균을 쫓아내는 초록빛 방패가 숨어있어요. 꼭꼭 씹어 먹으면 우리 몸속에 멋진 튼튼 요새가 완성돼요!",
      funFact: "우리가 먹는 브로콜리는 채소의 잎이 아니라 수천 개의 작은 '꽃봉오리'랍니다!",
      lunchTip: "살짝 데쳐서 초고추장에 찍어 먹거나 부드러운 브로콜리 수프로 즐겨요."
    },
    secondary: {
      catchphrase: "미국 국립암연구소가 선정한 10대 슈퍼푸드",
      subtitle: "설포라판과 인돌-3-카비놀의 체내 해독 시스템 강화",
      story: "브로콜리의 설포라판 성분은 헬리코박터 파일로리균 증식을 억제하여 위 건강을 지켜주며, 풍부한 식이섬유가 혈당 급상승을 방지합니다.",
      funFact: "100도씨 찜기에서 3분간 살짝 찔 때 설포라판 생성 효소(미로시나아제)가 가장 잘 보존됩니다.",
      lunchTip: "기름진 육류 조리 시 곁들이면 지방 대사를 촉진하고 영양 균형을 맞출 수 있습니다."
    },
    selectionTip: "송이가 단단하고 가운데가 볼록하게 솟아 있으며, 꽃봉오리가 피지 않고 짙은 녹색인 것을 고르세요.",
    storageTip: "랩으로 단단히 감싸 냉장고 신선실에 세워 보관하거나 살짝 데쳐 소분 후 냉동 보관합니다."
  },
  {
    id: "egg",
    name: "달걀 (난류)",
    englishName: "Egg",
    category: "육류",
    emoji: "🥚",
    themeColor: "#f59e0b",
    allergens: [1],
    peakMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    energyPer100g: "155 kcal",
    nutrients: [
      { name: "완전단백질", amount: "단백질 생물가 100", icon: "💪" },
      { name: "콜린", amount: "기억력 & 뇌세포 활성", icon: "🧠" },
      { name: "루테인", amount: "시력 보호 & 황반 강화", icon: "👁️" }
    ],
    elementary: {
      catchphrase: "동글동글 마법의 알! 영양 만점 달걀!",
      subtitle: "노른자 속 영양 보물상자를 열어봐요!",
      story: "껍질을 톡 깨면 노란 해님과 하얀 구름이 쏙! 성장기 어린이에게 꼭 필요한 단백질과 비타민이 완벽하게 들어있는 마법의 완전식품이랍니다.",
      funFact: "노른자에 든 '콜린'은 머리를 똑똑하게 만들어 시험 볼 때 기억력을 쑥쑥 올려줘요!",
      lunchTip: "폭신폭신 달걀찜과 알록달록 달걀말이는 언제나 인기 1등!"
    },
    secondary: {
      catchphrase: "아미노산 스코어 만점의 완전영양 식품",
      subtitle: "뇌 신경전달물질 아세틸콜린의 전구체 콜린과 양질의 레시틴",
      story: "달걀 단백질은 체내 흡수율이 가장 이상적인 기준 단백질로 활용되며, 노른자의 레시틴은 콜레스테롤 흡수를 자연 억제하고 혈관을 깨끗하게 합니다.",
      funFact: "달걀 껍데기에 적힌 난각번호 마지막 1자리는 사육 환경(1:방사, 2:축사, 3/4:케이지)을 나타냅니다.",
      lunchTip: "조리 방식에 따라 반숙일 때 체내 소화 시간이 약 1시간 30분으로 가장 빠르고 부담이 적습니다."
    },
    selectionTip: "껍데기 표면이 매끈하지 않고 까칠까칠하며, 흔들었을 때 소리가 나지 않는 신선한 것을 고르세요.",
    storageTip: "뾰족한 부분이 아래로 향하게 하여 냉장고 문 쪽보다는 온도 변화가 적은 안쪽에 보관하세요."
  },
  {
    id: "anchovy",
    name: "멸치",
    englishName: "Anchovy",
    category: "수산물류",
    emoji: "🐟",
    themeColor: "#0284c7",
    allergens: [],
    peakMonths: [7, 8, 9, 10, 11],
    energyPer100g: "127 kcal",
    nutrients: [
      { name: "칼슘", amount: "우유의 수배에 달하는 칼슘의 왕", icon: "🦴" },
      { name: "타우린", amount: "피로 해소 & 심장 강화", icon: "⚡" },
      { name: "핵산", amount: "세포 분열 & 성장 촉진", icon: "🧬" }
    ],
    elementary: {
      catchphrase: "작지만 힘센 칼슘의 왕! 바다의 보물 멸치!",
      subtitle: "뼈째 먹고 쑥쑥 자라요!",
      story: "멸치는 머리부터 꼬리까지 뼈째 통째로 먹을 수 있어 칼슘이 가득해요! 뼈와 치아가 튼튼해져서 넘어져도 다치지 않는 튼튼 어린이가 될 수 있어요.",
      funFact: "멸치는 성격이 급해서 물 밖으로 나오면 금방 죽는다고 해서 '멸할 멸(滅)' 자를 쓴대요!",
      lunchTip: "바삭하고 달콤한 아몬드 멸치볶음은 밥 한 공기 뚝딱!"
    },
    secondary: {
      catchphrase: "골밀도 형성과 신경 안정을 돕는 천연 미네랄 보고",
      subtitle: "칼슘과 인의 황금 배합 및 피로를 녹이는 고농도 타우린",
      story: "멸치의 칼슘은 신경 자극 전달과 근육 수축을 조절하여 수험생의 긴장과 불안을 완화해주며, 핵산 성분이 신진대사를 촉진합니다.",
      funFact: "멸치 똥(내장)에는 퓨린이 있지만 소화효소와 핵산이 풍부하므로 크기가 작으면 통째 먹는 것이 영양상 이롭습니다.",
      lunchTip: "기름 없이 마른 팬에 먼저 덖어주면 비린내는 날아가고 고소한 풍미와 바삭함이 배가됩니다."
    },
    selectionTip: "은빛 광택이 돌고 맑은 노란빛을 띠며, 꺾이지 않고 배가 터지지 않은 것을 고르세요.",
    storageTip: "수분을 머금으면 곰팡이가 피기 쉬우므로 지퍼백에 밀봉하여 냉동실에 보관합니다."
  },
  {
    id: "apple",
    name: "사과",
    englishName: "Apple",
    category: "과일류",
    emoji: "🍎",
    themeColor: "#dc2626",
    allergens: [],
    peakMonths: [9, 10, 11, 12],
    energyPer100g: "52 kcal",
    nutrients: [
      { name: "펙틴", amount: "장 청소 & 배변 촉진", icon: "🌾" },
      { name: "퀘르세틴", amount: "폐 기능 강화 & 항염", icon: "🫁" },
      { name: "유기산", amount: "피로 회복 & 소화 촉진", icon: "🍋" }
    ],
    elementary: {
      catchphrase: "아침에 먹는 황금 사과! 사각사각 꿀맛!",
      subtitle: "빨간 볼 백설공주도 반한 달콤한 비타민!",
      story: "아침에 먹는 사과는 '금사과'라고 불러요! 껍질째 와그작 베어 물면 뱃속 나쁜 찌꺼기를 깨끗하게 청소해 변비 걱정을 싹 날려준답니다.",
      funFact: "사과 속 유기산은 입안의 세균을 없애주어 이를 튼튼하고 깨끗하게 지켜줘요!",
      lunchTip: "급식에 나오는 새콤달콤 사과 샐러드와 사과 조각은 비타민 충전 완료!"
    },
    secondary: {
      catchphrase: "수용성 식이섬유 펙틴과 호흡기를 지키는 퀘르세틴",
      subtitle: "콜레스테롤 배출과 환절기 미세먼지 방어 솔루션",
      story: "사과의 퀘르세틴 성분은 대기오염 및 미세먼지로부터 폐 점막을 보호하며, 펙틴은 담즙산을 흡착 배출해 혈중 지질을 개선합니다.",
      funFact: "사과 껍질에 항산화 성분 안토시아닌과 식이섬유가 과육보다 2배 이상 많아 껍질째 섭취를 권장합니다.",
      lunchTip: "비타민 C가 풍부한 과일(키위, 오렌지)과 곁들이면 피로 물질인 젖산 분해가 빨라집니다."
    },
    selectionTip: "손으로 쥐었을 때 단단하고 묵직하며, 껍질이 너무 매끄러운 것보다 자연스러운 거친 질감이 있는 것을 고르세요.",
    storageTip: "사과에서 나오는 에틸렌 가스가 다른 과일을 숙성시키므로 비닐봉지에 단독으로 밀봉하여 냉장 보관하세요."
  },
  {
    id: "pork",
    name: "돼지고기 (돈육)",
    englishName: "Pork",
    category: "육류",
    emoji: "🐷",
    themeColor: "#e11d48",
    allergens: [10],
    peakMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    energyPer100g: "242 kcal",
    nutrients: [
      { name: "비타민 B1 (티아민)", amount: "소고기의 10배!", icon: "⚡" },
      { name: "필수 아미노산", amount: "성장기 근육 생성", icon: "💪" },
      { name: "철·인·미네랄", amount: "활력 증진 & 뼈 건강", icon: "🛡️" }
    ],
    elementary: {
      catchphrase: "지친 몸에 에너지를 뿜뿜! 비타민 B1 대장 돼지고기!",
      subtitle: "신나게 뛰어놀 힘을 선물해 줘요!",
      story: "수업 시간, 체육 시간에 열심히 달리고 나면 힘이 빠지죠? 돼지고기 속 비타민 B1이 우리가 먹은 밥을 에너지로 슝슝 바꿔준답니다!",
      funFact: "돼지고기 안심 부위는 지방이 닭가슴살만큼 적고 부드러워서 다이어트와 성장에 최고예요!",
      lunchTip: "급식 최고의 인기 메뉴 수육 보쌈과 제육볶음은 언제나 환영받아요."
    },
    secondary: {
      catchphrase: "탄수화물 대사의 핵심 코엔자임, 비타민 B1의 절대강자",
      subtitle: "체내 중금속 흡착 배출 및 피로물질 젖산 분해 촉진",
      story: "돼지고기는 피로 회복 비타민이라 불리는 티아민(B1) 함량이 모든 육류 중 가장 높아 학업 피로도가 높은 청소년의 에너지 대사에 필수적입니다.",
      funFact: "돼지고기의 불포화지방산(리놀레산, 아라키돈산)은 혈관 내 콜레스테롤 축적을 막아줍니다.",
      lunchTip: "알리신이 풍부한 마늘, 양파와 함께 조리하면 비타민 B1과 결합하여 흡수율이 수십 배 상승합니다."
    },
    selectionTip: "육질이 선홍색이고 탄력이 있으며, 지방 부위는 희고 단단한 것을 고르세요.",
    storageTip: "표면의 핏물을 닦아내고 랩으로 공기를 차단해 밀봉한 후 1~2도 신선실에 보관합니다."
  },
  {
    id: "chicken",
    name: "닭고기",
    englishName: "Chicken",
    category: "육류",
    emoji: "🍗",
    themeColor: "#f59e0b",
    allergens: [15],
    peakMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    energyPer100g: "173 kcal",
    nutrients: [
      { name: "필수 아미노산", amount: "소화 흡수 뛰어난 단백질", icon: "💪" },
      { name: "비타민 B3 (나이아신)", amount: "에너지 생성 촉진", icon: "⚡" },
      { name: "콜라겐", amount: "피부 및 연골 건강", icon: "✨" }
    ],
    elementary: {
      catchphrase: "달려라 튼튼이! 단백질 파워 닭고기!",
      subtitle: "날개 달린 단백질 요정이 우리 몸을 튼튼하게!",
      story: "닭고기는 지방이 적고 부드러워서 우리 몸에 단백질을 쏙쏙 넣어줘요! 친구들이 운동회에서 씽씽 달릴 수 있는 튼튼한 다리 힘을 만들어 준답니다.",
      funFact: "닭가슴살은 소화가 아주 잘 돼서 아기들의 첫 이유식이나 운동선수들의 필수 식단으로 쓰여요!",
      lunchTip: "바삭바삭 닭강정, 맑고 따뜻한 닭곰탕은 언제나 밥 한 공기 뚝딱!"
    },
    secondary: {
      catchphrase: "지방은 낮추고 근육을 채우는 최적의 고단백질원",
      subtitle: "풍부한 메티오닌과 필수 아미노산으로 간 기능 보호 및 피로 완화",
      story: "닭고기는 섬유질이 가늘고 연해 소화율이 매우 높으며, 불포화지방산 함량이 높아 청소년기 심혈관 부담 없이 순수 근육 발달을 돕습니다.",
      funFact: "닭 날개 부위에는 콜라겐이 집중되어 있어 연골과 인대 형성에 도움을 줍니다.",
      lunchTip: "양파, 파, 마늘의 알리신 성분과 함께 조리하면 비린내를 제거하고 비타민 흡수율을 높입니다."
    },
    selectionTip: "살이 두껍고 탄력이 있으며, 껍질이 크림색으로 윤택하고 털구멍이 도드라진 것을 고르세요.",
    storageTip: "물기를 닦고 밀폐 용기에 담아 1~2일 내 조리하거나 한 번 먹을 만큼 소분해 냉동 보관합니다."
  },
  {
    id: "carrot",
    name: "당근",
    englishName: "Carrot",
    category: "채소류",
    emoji: "🥕",
    themeColor: "#ea580c",
    allergens: [],
    peakMonths: [9, 10, 11, 12],
    energyPer100g: "37 kcal",
    nutrients: [
      { name: "베타카로틴", amount: "채소 중 최고 함량!", icon: "🥕" },
      { name: "비타민 A", amount: "야맹증 예방 & 눈 보호", icon: "👁️" },
      { name: "루테인", amount: "시력 보호 & 황반 강화", icon: "👓" }
    ],
    elementary: {
      catchphrase: "토끼가 좋아하는 주황색 눈 영양제 당근!",
      subtitle: "어두운 밤에도 눈이 반짝반짝!",
      story: "주황빛 당근 속에는 밤에도 눈을 초롱초롱 밝혀주는 비타민 A가 가득해요! 토끼처럼 뛰어놀고 시력을 튼튼하게 지켜주는 소중한 친구랍니다.",
      funFact: "당근의 주황색은 '카로틴'이라는 영양소 때문이에요. 기름에 볶아 먹으면 영양이 몸에 8배나 더 잘 들어와요!",
      lunchTip: "달콤한 당근 라페, 바삭한 야채튀김, 알록달록 볶음밥으로 신나게 먹어요."
    },
    secondary: {
      catchphrase: "디지털 기기에 지친 망막을 케어하는 카로티노이드의 왕",
      subtitle: "체내에서 비타민 A로 전환되는 프로비타민 A의 압도적 공급원",
      story: "당근 100g이면 성인 하루 권장 비타민 A 요구량을 충분히 충족하며, 안구 건조증과 시력 감퇴를 예방하는 데 가장 우수한 천연 식재료입니다.",
      funFact: "당근 중심부보다 껍질 바로 밑 부분에 카로틴이 가장 많으므로 껍질을 얇게 벗기는 것이 좋습니다.",
      lunchTip: "지용성 비타민 흡수를 위해 식물성 기름(식용유, 참기름)을 이용해 살짝 볶아 배식합니다."
    },
    selectionTip: "색깔이 주황빛으로 짙고 선명하며, 표면이 매끈하고 단단하며 모양이 고른 것을 고르세요.",
    storageTip: "흙이 묻은 채로 신문지에 싸서 서늘한 곳에 세워 보관하거나, 세척 후 물기를 제거해 밀폐 보관합니다."
  },
  {
    id: "potato",
    name: "감자",
    englishName: "Potato",
    category: "채소류",
    emoji: "🥔",
    themeColor: "#d97706",
    allergens: [],
    peakMonths: [6, 7, 8, 9],
    energyPer100g: "66 kcal",
    nutrients: [
      { name: "비타민 C", amount: "가열해도 파괴되지 않는 비타민", icon: "🍋" },
      { name: "칼륨", amount: "나트륨 배출 & 부종 완화", icon: "💧" },
      { name: "복합 탄수화물", amount: "지속적인 뇌 에너지 공급", icon: "⚡" }
    ],
    elementary: {
      catchphrase: "땅속의 사과! 포슬포슬 맛있는 감자!",
      subtitle: "뜨거운 불에도 끄떡없는 마법 비타민 C!",
      story: "감자는 흙 속에서 자란 둥글둥글 영양 덩어리에요! 다른 채소와 달리 뜨겁게 삶거나 구워도 비타민 C가 도망가지 않는 놀라운 힘을 가지고 있답니다.",
      funFact: "감자는 사과보다 비타민 C가 3배나 더 많아서 유럽에서는 '땅속의 사과'라고 불렀대요!",
      lunchTip: "포슬포슬 감자조림, 부드러운 감자스프, 바삭한 웨지감자는 최고의 인기!"
    },
    secondary: {
      catchphrase: "전분질이 보호하는 열안정성 비타민 C와 칼륨 솔루션",
      subtitle: "급식 염분 밸런스를 맞추는 나트륨 길항 작용과 소화기 점막 보호",
      story: "감자의 비타민 C는 전분 입자로 둘러싸여 있어 조리 가열 시에도 손실률이 10~15%에 불과하며, 풍부한 칼륨이 체내 삼투압과 혈압을 조절합니다.",
      funFact: "감자의 판토텐산은 부신피질 호르몬 분비를 촉진해 스트레스에 대한 저항력을 높여줍니다.",
      lunchTip: "껍질째 찌거나 오븐에 구워 조리하면 수용성 미네랄의 유실을 최소화할 수 있습니다."
    },
    selectionTip: "표면에 흠집이 적고 매끄러우며, 무겁고 단단하며 싹이 나거나 녹색으로 변하지 않은 것을 고르세요.",
    storageTip: "통풍이 잘되는 서늘한 그늘에 보관하고, 사과를 함께 넣어두면 사과의 에틸렌 가스가 감자의 싹을 억제합니다."
  },
  {
    id: "squid",
    name: "오징어",
    englishName: "Squid",
    category: "수산물류",
    emoji: "🦑",
    themeColor: "#0284c7",
    allergens: [17],
    peakMonths: [7, 8, 9, 10, 11],
    energyPer100g: "87 kcal",
    nutrients: [
      { name: "타우린", amount: "소고기의 16배! 피로 해소", icon: "⚡" },
      { name: "고단백 저지방", amount: "근육 생성 & 체중 관리", icon: "💪" },
      { name: "EPA·DHA", amount: "혈관 청소 & 뇌 활력", icon: "🧠" }
    ],
    elementary: {
      catchphrase: "피로야 가라! 바다의 번개맨 오징어!",
      subtitle: "타우린 파워로 온몸에 힘이 번쩍!",
      story: "오징어에는 피로를 싹 날려주는 '타우린'이라는 영양소가 가득해요! 공부하느라 지치고 운동하느라 땀 흘린 친구들의 몸을 번개처럼 충전해 준답니다.",
      funFact: "말린 오징어 겉에 묻은 하얀 가루는 곰팡이가 아니라 피로 회복을 돕는 '타우린' 영양소예요!",
      lunchTip: "매콤달콤 오징어 볶음, 쫄깃한 오징어 튀김과 오징어 뭇국으로 맛있게 먹어요."
    },
    secondary: {
      catchphrase: "지친 수험생의 간 해독과 피로물질을 분해하는 타우린의 보고",
      subtitle: "콜레스테롤 억제 및 혈압 정상화를 돕는 고밀도 해양 펩타이드",
      story: "오징어의 타우린 함량은 수산물 중 최상위권으로 간장의 담즙 분비를 촉진하고 심근 기능을 강화하며, 필수 아미노산가가 높아 단백질 보충에 우수합니다.",
      funFact: "오징어 먹물에 함유된 일렉신(ilexin) 성분은 항종양 및 면역 증강 효과가 보고되어 있습니다.",
      lunchTip: "질겨지지 않도록 센 불에서 짧은 시간 내에 조리하는 것이 식감과 영양을 지키는 비결입니다."
    },
    selectionTip: "몸통이 짙은 초콜릿색을 띠며 투명감이 있고, 빨판이 온전하며 살이 단단한 것을 고르세요.",
    storageTip: "내장과 뼈를 분리하여 깨끗이 씻은 후 랩으로 감싸 냉동실에 보관합니다."
  },
  {
    id: "seaweed",
    name: "미역 (해조류)",
    englishName: "Seaweed / Wakame",
    category: "버섯·해조류",
    emoji: "🌿",
    themeColor: "#047857",
    allergens: [],
    peakMonths: [1, 2, 3, 4, 5],
    energyPer100g: "15 kcal",
    nutrients: [
      { name: "요오드", amount: "갑상선 호르몬 생성 & 성장", icon: "🦋" },
      { name: "알긴산", amount: "중금속·미세먼지 체외 배출", icon: "🧹" },
      { name: "칼슘", amount: "골격 형성 & 치아 건강", icon: "🦷" }
    ],
    elementary: {
      catchphrase: "바다의 청소부! 미끈미끈 초록 미역!",
      subtitle: "생일날 먹는 사랑과 축하의 영양 선물!",
      story: "바다 깊은 곳에서 파도를 타고 자란 미역은 우리 몸속 나쁜 찌꺼기를 깨끗하게 쓸어내는 신비한 청소부에요! 뼈도 튼튼하게 자라게 해준답니다.",
      funFact: "고래가 새끼를 낳으면 가장 먼저 미역을 뜯어 먹고 몸을 회복한대요! 그래서 우리도 생일날 미역국을 먹어요.",
      lunchTip: "진하고 구수한 소고기 미역국과 새콤달콤 미역오이초무침은 급식 인기 만점!"
    },
    secondary: {
      catchphrase: "미세먼지와 중금속을 흡착 배출하는 천연 킬레이트 알긴산",
      subtitle: "신진대사의 중추 요오드와 풍부한 해양 미네랄의 시너지",
      story: "미역의 미끈거리는 점액질 성분인 알긴산은 체내 유해 콜레스테롤과 중금속을 흡착하여 장 밖으로 배출하며, 풍부한 요오드는 기초대사량을 조절합니다.",
      funFact: "파와 함께 끓이면 파의 황 성분이 미역의 칼슘 흡수를 방해하므로, 급식 조리 시 파 대신 마늘을 주로 사용합니다.",
      lunchTip: "들깨가루를 곁들인 들깨미역국은 오메가-3와 지용성 비타민 흡수를 동시에 높여줍니다."
    },
    selectionTip: "잎이 넓고 줄기가 가늘며, 짙은 흑갈색이나 짙은 녹색을 띠고 만졌을 때 탄력 있는 것을 고르세요.",
    storageTip: "건미역은 직사광선을 피해 건조한 곳에 두고, 생미역은 끓는 물에 살짝 데쳐 찬물에 헹군 뒤 냉동 보관합니다."
  },
  {
    id: "mandarin",
    name: "귤 (감귤)",
    englishName: "Mandarin / Tangerine",
    category: "과일류",
    emoji: "🍊",
    themeColor: "#ea580c",
    allergens: [],
    peakMonths: [10, 11, 12, 1, 2],
    energyPer100g: "39 kcal",
    nutrients: [
      { name: "비타민 C", amount: "감기 예방 & 면역 방패", icon: "🛡️" },
      { name: "헤스페리딘", amount: "모세혈관 강화 & 비타민 P", icon: "❤️" },
      { name: "구연산", amount: "젖산 분해 & 피로 회복", icon: "🍋" }
    ],
    elementary: {
      catchphrase: "까먹는 재미가 솔솔! 겨울철 비타민 보물상자 귤!",
      subtitle: "주황빛 새콤달콤 알맹이가 팡팡!",
      story: "손으로 톡 까서 입에 넣으면 새콤달콤 과즙이 입안 가득 팡! 겨울바람이 불어와도 감기 걸리지 않게 우리 몸에 튼튼한 방패를 씌워주는 귀여운 과일이에요.",
      funFact: "귤껍질 안쪽에 붙은 하얀 줄기는 '알베도'라고 해요. 여기에 비타민 P가 가득해서 혈관을 튼튼하게 지켜줘요!",
      lunchTip: "식사 후 디저트로 나오는 상큼한 제주 감귤은 최고의 힐링!"
    },
    secondary: {
      catchphrase: "겨울철 호흡기 면역과 모세혈관 건강을 지키는 비타민 P의 보고",
      subtitle: "구연산의 젖산 분해로 만성 피로 회복 및 피부 점막 강화",
      story: "감귤 두 개면 하루 비타민 C 필요량을 충족하며, 하얀 속껍질의 헤스페리딘(비타민 P) 성분은 모세혈관 투과성을 억제해 뇌출혈 등 혈관 질환을 예방합니다.",
      funFact: "수확 직후보다 며칠간 서늘한 곳에 후숙하면 신맛을 내는 유기산이 분해되어 당도가 상승합니다.",
      lunchTip: "샐러드 드레싱이나 상큼한 과일 샐러드에 곁들여 비타민 흡수율을 극대화합니다."
    },
    selectionTip: "껍질이 얇고 단단하며, 꼭지가 푸르고 크기에 비해 묵직한 것이 과즙이 많고 달콤합니다.",
    storageTip: "겹쳐두면 쉽게 곰팡이가 피므로 신문지를 층층이 깔고 서늘한 실온(3~5℃)에 보관하세요."
  }
];

/**
 * 카테고리 목록
 */
const CATEGORIES = [
  "전체",
  "채소류",
  "과일류",
  "육류",
  "수산물류",
  "버섯·해조류",
  "두류·견과류"
];

/**
 * 검색 및 필터 유틸
 */
function searchIngredients(query = "", category = "전체") {
  const cleanQ = query.trim().toLowerCase();
  return INGREDIENTS_DATABASE.filter(item => {
    const matchesCategory = category === "전체" || item.category === category;
    const matchesQuery = !cleanQ || 
      item.name.toLowerCase().includes(cleanQ) || 
      item.englishName.toLowerCase().includes(cleanQ) ||
      item.elementary.catchphrase.toLowerCase().includes(cleanQ) ||
      item.nutrients.some(n => n.name.toLowerCase().includes(cleanQ));
    return matchesCategory && matchesQuery;
  });
}

/**
 * 이달의 제철 식재료 가져오기
 */
function getSeasonalIngredients(month = new Date().getMonth() + 1) {
  return INGREDIENTS_DATABASE.filter(item => item.peakMonths.includes(month));
}


/* === MODULE: aiService.js === */
/**
 * 영양교사용 AI 식재료 분석 및 포스터 콘텐츠 생성 서비스 (v3.1)
 * - 식재료 동음이의어 판별 (예: 우베시 등 비식품 도시/지명 자동 필터링)
 * - 트렌디/이색 글로벌 식재료 지능형 지식 사전 내장
 * - 위키피디아 식물/식재료 정밀 검색 및 영문 위키 크로스 레퍼런스
 * - Google Gemini Flash API 프롬프트 가드레일 강화
 */


const STORAGE_KEY_API_KEY = "nutri_poster_gemini_api_key";

function getStoredApiKey() {
  return localStorage.getItem(STORAGE_KEY_API_KEY) || "";
}

function saveApiKey(key) {
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
async function fetchWikiInfo(name) {
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
async function generateIngredientData(ingredientName) {
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
    imageUrl: wiki?.imageUrl || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
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


/* === MODULE: posterRenderer.js === */
/**
 * 포스터 레이아웃 렌더러 (v4.0 - 필수 5대 핵심 요소 집중형 & 20pt 대형 가독성)
 * 영양교사 사용자 요청 적극 반영:
 * 1. 식재료명
 * 2. 식재료 사진
 * 3. 식재료의 유래 및 각종 정보 (어원, 역사, 식문화)
 * 4. 영양성분 및 설명 (3대 핵심 영양소 & 인체 효능)
 * 5. 영양 팁 (영양교사 꿀팁 및 식생활 가이드)
 * 
 * - 불필요한 장식(달력 바, 복잡한 다중 분할 카드) 완전 제거
 * - 여백 최소화 및 20pt(26px)급 시원한 대형 폰트로 원거리 게시판 가독성 극대화
 * - contenteditable & data-field 속성으로 실시간 자유 편집 및 자동 저장 지원
 */


function renderPoster(container, state) {
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
 * 실물 사진 렌더링 헬퍼 (대형 고화질 뷰 & 변경 안내)
 */
function renderIngredientPhoto(item, sizeClasses = "w-52 h-52 sm:w-60 sm:h-60") {
  const imgUrl = item.imageUrl || "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80";

  return `
    <div class="relative group cursor-pointer shrink-0" id="heroVisualBox" title="클릭하여 사진 변경 (또는 Ctrl+V로 이미지 붙여넣기)">
      <div class="${sizeClasses} rounded-3xl bg-theme-light border-4 border-theme-border flex items-center justify-center shadow-md overflow-hidden relative">
        <img src="${imgUrl}" alt="${item.name}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80';" />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-sm font-black gap-1 no-print p-2 text-center">
          <span>📷 사진 변경</span>
          <span class="text-[11px] font-normal text-slate-200">클릭 또는 [Ctrl+V] 붙여넣기</span>
        </div>
      </div>
      <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3.5 py-1 rounded-full border-2 border-slate-300 text-xs font-black text-slate-800 shadow-sm flex items-center gap-1.5 whitespace-nowrap">
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
      <div class="inline-flex items-center gap-2 bg-rose-50 border-2 border-rose-300 text-rose-800 px-3.5 py-1.5 rounded-xl text-sm font-bold shadow-2xs">
        <span class="bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-black shrink-0">⚠️</span>
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="font-black text-rose-950">알레르기 유발물질:</span>
          ${allergenList.map(a => `<span class="bg-white border border-rose-400 text-rose-900 px-2 py-0.5 rounded-md text-xs font-black">${a}</span>`).join('')}
          <span class="text-xs text-rose-600 font-semibold">(해당 학생 섭취 유의)</span>
        </div>
      </div>
    `;
  }
  return `
    <div class="inline-flex items-center gap-1.5 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 px-3.5 py-1.5 rounded-xl text-sm font-bold shadow-2xs">
      <span class="text-emerald-600 font-black">✅ 안심 식재료</span>
      <span class="text-slate-600 font-semibold">• 19종 주요 알레르기 비해당</span>
    </div>
  `;
}

/**
 * 1. A4 세로형 포스터 레이아웃 (5대 핵심 요소 집중형 & 20pt급 대형 가독성)
 */
function renderA4Layout(item, content, allergenList, state) {
  const isElem = state.mode === 'elementary';
  const origin = item.originInfo || {
    etymology: `${item.name}의 이름은 고유한 형태와 조상들의 지혜에서 비롯되었습니다.`,
    history: `예로부터 사계절 우리 전통 식생활과 명절 밥상에서 사랑받아 온 대표 식재료입니다.`,
    nature: `특유의 영양 성분이 풍부하며 올바른 전처리와 조리법을 거쳐 맛과 건강을 전합니다.`
  };

  return `
    <div class="aspect-a4 bg-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-4 border-theme-border poster-shadow relative overflow-hidden text-slate-800">
      
      <!-- 상단 데코 -->
      <div class="absolute -top-24 -right-24 w-56 h-56 bg-theme-light rounded-full opacity-60 pointer-events-none"></div>
      <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-theme-light rounded-full opacity-60 pointer-events-none"></div>

      <!-- [상단 헤더] 학교명 & 포스터 타이틀 -->
      <div class="relative z-10 border-b-2 border-slate-200 pb-2 mb-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="px-3.5 py-1.5 rounded-full text-sm font-black bg-theme-light text-theme-dark border-2 border-theme-border">
            ${isElem ? '🌱 초등 식생활 교실' : '🎓 스마트 영양 가이드'}
          </span>
          <span class="text-sm text-slate-500 font-bold">| 이달의 식재료 탐구</span>
        </div>
        <div data-field="schoolName" contenteditable="true" class="text-sm sm:text-base font-extrabold text-slate-700 hover:bg-amber-100 px-3 py-1 rounded-xl cursor-pointer transition border border-transparent hover:border-amber-300" title="클릭하여 학교명을 수정할 수 있습니다">
          ${state.schoolName || '행복학교 급식실 · 영양상담실'}
        </div>
      </div>

      <!-- ========================================================
           요소 1 & 2: [식재료명] & [식재료 사진] (히어로 섹션)
           ======================================================== -->
      <div class="relative z-10 bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-3xl p-5 border-2 border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-6 my-1">
        <!-- 2. 식재료 사진 -->
        ${renderIngredientPhoto(item, "w-48 h-48 sm:w-56 sm:h-56")}

        <!-- 1. 식재료명 및 캐치프레이즈 -->
        <div class="flex-1 text-center sm:text-left flex flex-col justify-center gap-2">
          <div data-field="subtitle" contenteditable="true" class="inline-block self-center sm:self-start text-sm sm:text-base font-black text-theme-primary bg-theme-light px-4 py-1.5 rounded-full border border-theme-border">
            ${content.subtitle}
          </div>
          
          <div>
            <h1 data-field="name" contenteditable="true" class="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              ${item.name}
            </h1>
            <p data-field="englishName" contenteditable="true" class="text-lg sm:text-xl font-bold text-slate-400 italic mt-0.5">
              ${item.englishName}
            </p>
          </div>

          <div data-field="catchphrase" contenteditable="true" class="text-lg sm:text-xl font-black text-slate-800 leading-snug break-keep bg-white/90 p-3 rounded-2xl border border-slate-200">
            ${content.catchphrase}
          </div>

          <div>
            ${renderAllergyNotice(allergenList)}
          </div>
        </div>
      </div>

      <!-- ========================================================
           요소 3: [식재료의 유래 및 각종 정보]
           ======================================================== -->
      <div class="relative z-10 bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-xs my-2">
        <div class="flex items-center gap-2 mb-2 pb-1.5 border-b border-amber-200">
          <span class="text-3xl">📜</span>
          <h2 class="text-xl sm:text-2xl font-black text-amber-950">
            [${item.name}]의 유래와 식재료 이야기
          </h2>
          <span class="text-xs bg-amber-200 text-amber-900 font-extrabold px-3 py-1 rounded-full ml-auto">식재료 탐구</span>
        </div>

        <div class="flex flex-col gap-3">
          <div class="bg-white/95 p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
            <span class="text-base sm:text-lg font-black text-amber-950 flex items-center gap-1.5 mb-1">
              <span>🏷️</span> 이름의 유래 (어원):
            </span>
            <p data-field="etymology" contenteditable="true" class="text-base sm:text-lg text-slate-800 leading-relaxed font-bold break-keep">
              ${origin.etymology}
            </p>
          </div>

          <div class="bg-white/95 p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
            <span class="text-base sm:text-lg font-black text-amber-950 flex items-center gap-1.5 mb-1">
              <span>🌾</span> 역사와 식문화:
            </span>
            <p data-field="history" contenteditable="true" class="text-base sm:text-lg text-slate-800 leading-relaxed font-bold break-keep">
              ${origin.history}
            </p>
          </div>
        </div>
      </div>

      <!-- ========================================================
           요소 4: [영양성분 및 설명]
           ======================================================== -->
      <div class="relative z-10 my-2">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-3xl">✨</span>
          <h2 class="text-xl sm:text-2xl font-black text-slate-900">
            핵심 영양성분과 우리 몸에 주는 이로움
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          ${item.nutrients.map((n, idx) => `
            <div class="bg-white p-4 rounded-2xl border-2 border-slate-200 hover:border-theme-border shadow-xs flex flex-col justify-between transition">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-3xl p-2 rounded-2xl bg-theme-light shrink-0">${n.icon}</span>
                <span data-field="nutrient_name_${idx}" contenteditable="true" class="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  ${n.name}
                </span>
              </div>
              <p data-field="nutrient_amount_${idx}" contenteditable="true" class="text-sm sm:text-base font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                ${n.amount}
              </p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ========================================================
           요소 5: [영양 팁 (영양교사 꿀팁)]
           ======================================================== -->
      <div class="relative z-10 bg-emerald-50/90 border-2 border-emerald-300 rounded-3xl p-5 shadow-xs my-1">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="text-3xl">💡</span>
          <h2 class="text-xl sm:text-2xl font-black text-emerald-950">
            영양선생님의 식생활 & 조리 꿀팁!
          </h2>
        </div>
        <p data-field="lunchTip" contenteditable="true" class="text-base sm:text-lg lg:text-xl text-emerald-950 leading-relaxed font-black break-keep">
          ${origin.nature || content.lunchTip || item.selectionTip}
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
 * 2. 16:9 가로형 슬라이드 레이아웃 (5대 핵심 요소 집중형 & TV 화면 최적화)
 */
function renderScreenLayout(item, content, allergenList, state) {
  const isElem = state.mode === 'elementary';
  const origin = item.originInfo || {
    etymology: `${item.name}의 이름은 고유한 형태와 조상들의 지혜에서 비롯되었습니다.`,
    history: `예로부터 사계절 우리 전통 식생활과 명절 밥상에서 사랑받아 온 대표 식재료입니다.`,
    nature: `특유의 영양 성분이 풍부하며 올바른 전처리와 조리법을 거쳐 맛과 건강을 전합니다.`
  };

  return `
    <div class="aspect-screen bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-4 border-theme-border poster-shadow relative overflow-hidden text-slate-800">
      
      <!-- 상단 헤더 -->
      <div class="flex items-center justify-between border-b-2 border-slate-200 pb-2 mb-2">
        <div class="flex items-center gap-2">
          <span class="px-3.5 py-1.5 rounded-full text-sm font-black bg-theme-light text-theme-dark border-2 border-theme-border">
            📺 급식실 스마트 영양 모니터
          </span>
          <span data-field="schoolName" contenteditable="true" class="text-base sm:text-lg font-black text-slate-700">
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
        <div class="col-span-12 sm:col-span-5 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-50 to-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs h-full">
          ${renderIngredientPhoto(item, "w-48 h-48 sm:w-56 sm:h-56")}

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
          <!-- 3. 유래 및 정보 -->
          <div class="bg-amber-50/90 border-2 border-amber-300 p-4 rounded-3xl">
            <div class="flex items-center gap-1.5 mb-1.5 text-amber-950 font-black text-base sm:text-lg">
              <span>📜</span> <span>식재료 유래 이야기</span>
            </div>
            <p data-field="etymology" contenteditable="true" class="text-sm sm:text-base text-slate-800 leading-snug font-bold mb-1 break-keep">
              • <strong>유래:</strong> ${origin.etymology}
            </p>
            <p data-field="history" contenteditable="true" class="text-sm sm:text-base text-slate-800 leading-snug font-bold break-keep">
              • <strong>역사:</strong> ${origin.history}
            </p>
          </div>

          <!-- 4. 영양성분 3종 -->
          <div>
            <div class="text-sm sm:text-base font-black text-slate-900 mb-1.5 flex items-center gap-1.5">
              <span>✨</span> <span>핵심 영양성분과 인체 효능</span>
            </div>
            <div class="grid grid-cols-3 gap-2.5">
              ${item.nutrients.map((n, idx) => `
                <div class="bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-2xs text-center flex flex-col justify-center">
                  <span class="text-2xl mb-1">${n.icon}</span>
                  <span data-field="nutrient_name_${idx}" contenteditable="true" class="text-sm sm:text-base font-black text-slate-900 leading-tight">${n.name}</span>
                  <span data-field="nutrient_amount_${idx}" contenteditable="true" class="text-xs sm:text-sm font-bold text-slate-600 mt-1 leading-tight">${n.amount}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 5. 영양 팁 -->
          <div class="bg-emerald-50 border-2 border-emerald-300 p-3.5 rounded-2xl">
            <div class="text-sm sm:text-base font-black text-emerald-950 flex items-center gap-1 mb-1">
              <span>💡</span> <span>영양교사의 꿀팁:</span>
            </div>
            <p data-field="lunchTip" contenteditable="true" class="text-sm sm:text-base text-emerald-900 leading-normal font-black break-keep">
              ${origin.nature || content.lunchTip}
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
 * 3. 1:1 정사각 카드뉴스 레이아웃 (5대 핵심 요소 집중형 & 스마트폰/가정통신문)
 */
function renderSquareLayout(item, content, allergenList, state) {
  const isElem = state.mode === 'elementary';
  const origin = item.originInfo || {
    etymology: `${item.name}의 이름은 고유한 형태와 조상들의 지혜에서 비롯되었습니다.`,
    history: `예로부터 사계절 우리 전통 식생활과 명절 밥상에서 사랑받아 온 대표 식재료입니다.`,
    nature: `특유의 영양 성분이 풍부하며 올바른 전처리와 조리법을 거쳐 맛과 건강을 전합니다.`
  };

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
      <div class="flex items-center gap-5 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-4 rounded-3xl border-2 border-slate-200 my-1">
        ${renderIngredientPhoto(item, "w-36 h-36 sm:w-44 sm:h-44")}

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

      <!-- 3. 유래 및 정보 -->
      <div class="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl my-1">
        <span class="text-sm sm:text-base font-black text-amber-950 flex items-center gap-1 mb-1">
          <span>📜</span> 식재료 유래 이야기:
        </span>
        <p data-field="etymology" contenteditable="true" class="text-sm sm:text-base text-slate-800 leading-snug font-bold break-keep">
          ${origin.etymology} ${origin.history}
        </p>
      </div>

      <!-- 4. 영양성분 3종 -->
      <div class="grid grid-cols-3 gap-2 my-1">
        ${item.nutrients.map((n, idx) => `
          <div class="bg-white p-3 rounded-2xl border-2 border-slate-200 text-center shadow-2xs">
            <span class="text-2xl mb-0.5 block">${n.icon}</span>
            <span data-field="nutrient_name_${idx}" contenteditable="true" class="text-sm sm:text-base font-black text-slate-900 block leading-tight">${n.name}</span>
            <span data-field="nutrient_amount_${idx}" contenteditable="true" class="text-xs sm:text-sm font-bold text-slate-600 block mt-1 leading-tight">${n.amount}</span>
          </div>
        `).join('')}
      </div>

      <!-- 5. 영양 팁 -->
      <div class="bg-emerald-50 border-2 border-emerald-300 p-3.5 rounded-2xl my-1">
        <span class="text-sm sm:text-base font-black text-emerald-950 flex items-center gap-1 mb-0.5">
          <span>💡</span> 영양선생님의 꿀팁:
        </span>
        <p data-field="lunchTip" contenteditable="true" class="text-sm sm:text-base text-emerald-900 font-black leading-snug break-keep">
          ${origin.nature || content.lunchTip}
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


/* === MODULE: posterExporter.js === */
/**
 * 포스터 내보내기 및 인쇄 유틸리티
 * - html2canvas를 활용한 2x 초고해상도 PNG 이미지 저장
 * - 브라우저 즉시 인쇄 연동 (A4 1페이지 출력 CSS)
 * - 클립보드 복사 지원
 */

async function downloadPosterAsImage(posterElement, fileName = "식재료_교육포스터") {
  if (!posterElement) return;

  if (typeof html2canvas === 'undefined') {
    alert("이미지 생성 라이브러리가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
    return;
  }

  showToast("고화질 포스터 이미지를 생성하고 있습니다... 🎨");

  try {
    const canvas = await html2canvas(posterElement, {
      scale: 2, // 선명한 2배율 고해상도 인쇄 품질
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      onclone: (clonedDoc) => {
        // 복제된 DOM에서 contenteditable 테두리나 불필요한 outline 제거
        const editables = clonedDoc.querySelectorAll('[contenteditable]');
        editables.forEach(el => {
          el.removeAttribute('contenteditable');
          el.style.outline = 'none';
        });
      }
    });

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = `${fileName}_${formatDate(new Date())}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("🎉 포스터가 성공적으로 다운로드되었습니다!");
  } catch (error) {
    console.error("포스터 이미지 다운로드 실패:", error);
    showToast("❌ 이미지 저장 중 오류가 발생했습니다.", "error");
  }
}

function printPoster() {
  showToast("급식실 인쇄 준비 중... 🖨️");
  setTimeout(() => {
    window.print();
  }, 300);
}

async function copyPosterToClipboard(posterElement) {
  if (!posterElement || typeof html2canvas === 'undefined') return;

  showToast("클립보드에 복사할 이미지를 생성 중입니다...");

  try {
    const canvas = await html2canvas(posterElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    canvas.toBlob(async (blob) => {
      try {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        showToast("📋 포스터 이미지가 클립보드에 복사되었습니다! (한글/파워포인트에 바로 붙여넣기 가능)");
      } catch (err) {
        console.warn("Clipboard API 에러:", err);
        // 대체: 다운로드 유도
        showToast("브라우저 보안으로 인해 바로 복사가 제한되었습니다. PNG 다운로드를 이용해주세요.", "error");
      }
    });
  } catch (err) {
    console.error(err);
    showToast("클립보드 복사 실패", "error");
  }
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

function showToast(message, type = "info") {
  let toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  const bg = type === "error" ? "bg-rose-600" : "bg-slate-900";
  toast.className = `${bg} text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 transform transition-all duration-300 translate-y-3 opacity-0 pointer-events-auto`;
  toast.innerHTML = `<span>${type === 'error' ? '⚠️' : '✨'}</span><span>${message}</span>`;

  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-3", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


/* === MODULE: app.js === */
/**
 * 영양쏙쏙 (Nutri-Poster) 메인 애플리케이션 컨트롤러
 * - [신규] 영양교사용 커스텀 수정사항 자동 저장 (localStorage Auto-Save) 영구 보관
 * - [신규] 원클릭 원본 복원 (Reset) 기능
 * - 식재료 실물 고화질 사진 교체 및 즉시 붙여넣기 (Ctrl + V)
 * - 20pt 대형 폰트 & 5대 필수 정보 집중 포스터 렌더링 동기화
 */


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


})();
