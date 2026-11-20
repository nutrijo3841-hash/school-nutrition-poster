/**
 * 대한민국 교육부 및 식품의약품안전처 지정 학교급식 알레르기 유발물질 19종 정보
 */
export const ALLERGENS_19 = [
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
export function checkIngredientAllergens(name, explicitIds = []) {
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
