/**
 * 전국 유·초·중·고등학교 급식 다빈도 식재료 종합 데이터베이스 (50선)
 * - 국가표준식품성분표 및 학교급식 영양관리기준 반영
 * - 유/초등 눈높이 교육스토리 vs 중/고등 영양지식 분리
 * - 제철 월(1~12월), 알레르기 19종 매핑, 영양소 3대 핵심 뱃지, 조리/고르는 팁
 */

export const INGREDIENTS_DATABASE = [
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
export const CATEGORIES = [
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
export function searchIngredients(query = "", category = "전체") {
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
export function getSeasonalIngredients(month = new Date().getMonth() + 1) {
  return INGREDIENTS_DATABASE.filter(item => item.peakMonths.includes(month));
}
