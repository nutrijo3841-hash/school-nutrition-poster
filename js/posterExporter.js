/**
 * 포스터 내보내기 및 인쇄 유틸리티
 * - html2canvas를 활용한 2x 초고해상도 PNG 이미지 저장
 * - 브라우저 즉시 인쇄 연동 (A4 1페이지 출력 CSS)
 * - 클립보드 복사 지원
 */

export async function downloadPosterAsImage(posterElement, fileName = "식재료_교육포스터") {
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

export function printPoster() {
  showToast("급식실 인쇄 준비 중... 🖨️");
  setTimeout(() => {
    window.print();
  }, 300);
}

export async function copyPosterToClipboard(posterElement) {
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

export function showToast(message, type = "info") {
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
