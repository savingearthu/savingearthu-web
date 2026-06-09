import { useState, useEffect } from "react";

// ──────────────────────────────────────────────
// ↓ Apps Script 배포 URL 여기에 붙여넣기
const API_URL = "여기에_배포URL_붙여넣기";
// ──────────────────────────────────────────────

const LOGO_URL =
  "https://impact.career/_storage_/public/2/r86hg3b8piirdieepxq9xgrq141y";

// URL 파라미터에서 cafeId 꺼내기
function getCafeId() {
  return new URLSearchParams(window.location.search).get("cafeId") || "";
}

function fmt(n) {
  const v = Number(n);
  if (isNaN(v)) return "0";
  if (v < 10) return v.toFixed(1);
  return Math.round(v).toLocaleString("ko-KR");
}

// ── 스타일 상수 ──────────────────────────────
const S = {
  // 전체 래퍼: 배경 이미지 + 다크 오버레이
  page: {
    minHeight: "100vh",
    maxWidth: 480,
    margin: "0 auto",
    background: "#1c1c1c",
    position: "relative",
    fontFamily: "'Noto Sans KR', sans-serif",
    color: "#fff",
    overflowX: "hidden",
  },
  // 배경 이미지 레이어 (실사진 넣을 곳)
  bgLayer: {
    position: "fixed",
    inset: 0,
    maxWidth: 480,
    margin: "0 auto",
    backgroundImage: "url('여기에_배경사진_URL')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    // 배경사진 없을 때 fallback 그라디언트
    background:
      "linear-gradient(180deg, #2a3a2a 0%, #1a2a1a 40%, #151f1a 100%)",
    filter: "brightness(0.45)",
    zIndex: 0,
  },
  // 콘텐츠 레이어
  content: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "0 0 3rem",
  },

  // ── 히어로 섹션 ──
  heroSection: {
    width: "100%",
    padding: "5rem 1.5rem 2rem",
    textAlign: "center",
  },
  cafeName: {
    fontSize: 42,
    fontWeight: 900,
    color: "#fff",
    letterSpacing: -1.5,
    lineHeight: 1.1,
    marginBottom: "0.5rem",
    textShadow: "0 2px 20px rgba(0,0,0,0.5)",
  },
  cafePeriod: {
    fontSize: 15,
    color: "rgba(255,255,255,0.75)",
    fontWeight: 400,
    letterSpacing: 0,
  },

  // ── 통계 섹션 ──
  statsSection: {
    width: "100%",
    padding: "2.5rem 1.5rem 1.5rem",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 0,
  },
  statItem: {
    textAlign: "center",
    padding: "0.5rem 0.25rem",
  },
  statLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: "rgba(255,255,255,0.65)",
    marginBottom: "0.5rem",
    letterSpacing: 0.2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 900,
    color: "#fff",
    letterSpacing: -1.5,
    lineHeight: 1,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: 400,
    color: "rgba(255,255,255,0.55)",
    marginLeft: 2,
  },

  // ── 인용구 ──
  quoteSection: {
    width: "100%",
    padding: "1rem 2rem",
    textAlign: "center",
  },
  quoteText: {
    fontSize: 14,
    fontWeight: 500,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 1.7,
    letterSpacing: 0.2,
  },

  // ── 구분선 ──
  divider: {
    width: "calc(100% - 3rem)",
    height: 1,
    background: "rgba(255,255,255,0.15)",
    margin: "0.5rem 1.5rem",
  },

  // ── 순환 구조 텍스트 ──
  cycleSection: {
    width: "100%",
    padding: "1rem 1.5rem",
    textAlign: "left",
  },
  cycleText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    lineHeight: 1.8,
    letterSpacing: 0.1,
  },
  cycleHighlight: {
    color: "rgba(255,255,255,0.9)",
    fontWeight: 500,
  },

  // ── 사람 카드 섹션 ──
  peopleSection: {
    width: "100%",
    padding: "1.5rem 1.5rem 0.5rem",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.2rem",
    textAlign: "left",
  },
  personAvatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 32,
    marginBottom: "0.6rem",
    overflow: "hidden",
    flexShrink: 0,
  },
  personAvatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  personDesc: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 1.55,
    marginBottom: "0.5rem",
  },
  personLink: {
    fontSize: 11,
    fontWeight: 600,
    color: "#fff",
    textDecoration: "underline",
    textUnderlineOffset: 3,
    cursor: "pointer",
  },

  // ── 지도 버튼 ──
  mapBtnWrap: {
    width: "100%",
    padding: "1.5rem 1.5rem 0.5rem",
  },
  mapBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "1rem 1.5rem",
    background: "#00aeef",
    borderRadius: 50,
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: -0.2,
    boxShadow: "0 4px 24px rgba(0,174,239,0.35)",
    cursor: "pointer",
  },

  // ── 로고 + 푸터 ──
  footerSection: {
    width: "100%",
    padding: "2.5rem 1.5rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  footerLogo: {
    width: 130,
    objectFit: "contain",
    filter: "brightness(0) invert(1)",
    opacity: 0.85,
  },
  footerLinks: {
    display: "flex",
    gap: 16,
  },
  footerLink: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    textDecoration: "none",
  },
};

// ── 로딩 화면 ─────────────────────────────────
function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#2a3a2a,#151f1a)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        fontFamily: "'Noto Sans KR',sans-serif",
      }}
    >
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: i === 1 ? "rgba(255,255,255,0.4)" : "#00a54f",
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>잠깐만요…</p>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}`}</style>
    </div>
  );
}

// ── 에러 화면 ─────────────────────────────────
function ErrorScreen({ detail }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg,#2a3a2a,#151f1a)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontFamily: "'Noto Sans KR',sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <p style={{ fontSize: 36, marginBottom: 4 }}>🌱</p>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
        카페 정보를 찾을 수 없어요.
      </p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{detail}</p>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────
export default function CafePage() {
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [data, setData] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const cafeId = getCafeId();
    if (!cafeId) {
      setErrMsg("URL에 cafeId가 없어요.");
      setStatus("error");
      return;
    }
    fetch(`${API_URL}?cafeId=${encodeURIComponent(cafeId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.cafe) {
          setErrMsg(`등록된 카페를 찾지 못했어요. (${cafeId})`);
          setStatus("error");
        } else {
          setData(d);
          setStatus("ok");
        }
      })
      .catch((e) => {
        setErrMsg(e.message);
        setStatus("error");
      });
  }, []);

  if (status === "loading") return <LoadingScreen />;
  if (status === "error") return <ErrorScreen detail={errMsg} />;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap"
        rel="stylesheet"
      />
      <div style={S.page}>
        {/* 배경 레이어 */}
        <div style={S.bgLayer} />

        {/* 콘텐츠 */}
        <div style={S.content}>

          {/* ① 히어로: 카페 이름 + 참여기간 */}
          <section style={S.heroSection}>
            <h1 style={S.cafeName}>{data.cafe}</h1>
            <p style={S.cafePeriod}>2025년부터 함께하는 지구카페</p>
          </section>

          {/* ② 통계 3칸 */}
          <div style={S.statsSection}>
            {[
              { label: "종이팩량", value: fmt(data.count), unit: "개" },
              { label: "살린 나무", value: fmt(data.trees), unit: "그루" },
              { label: "재생 휴지", value: fmt(data.tissue), unit: "개" },
            ].map((s, i) => (
              <div key={i} style={S.statItem}>
                <p style={S.statLabel}>{s.label}</p>
                <p style={S.statValue}>
                  {s.value}
                  <span style={S.statUnit}>{s.unit}</span>
                </p>
              </div>
            ))}
          </div>

          <div style={S.divider} />

          {/* ③ 인용구 */}
          <section style={S.quoteSection}>
            <p style={S.quoteText}>
              "{data.cafe}은 자원순환이 시작되는 곳입니다"
            </p>
          </section>

          <div style={S.divider} />

          {/* ④ 순환 구조 */}
          <section style={S.cycleSection}>
            <p style={S.cycleText}>
              <span style={S.cycleHighlight}>카페</span>
              {" → "}
              <span style={S.cycleHighlight}>지소행(수거)</span>
              {" → "}
              <span style={S.cycleHighlight}>제지회사</span>
              {" → "}
              <span style={S.cycleHighlight}>재생 종이(휴지)</span>
              {" → "}
              <span style={S.cycleHighlight}>기후 취약계층 전달</span>
            </p>
          </section>

          <div style={S.divider} />

          {/* ⑤ 사람 카드 2개 */}
          <section style={S.peopleSection}>
            {/* 황무연 선생님 */}
            <div>
              <div style={S.personAvatar}>
                {/* 사진 있으면: <img src="URL" style={S.personAvatarImg} alt="황무연" /> */}
                👴
              </div>
              <p style={S.personDesc}>
                "충무로 카페의 종이팩을 매일 수거하고 계시는 어르신 활동가"
              </p>
              {/* ↓ 인터뷰 링크 href에 넣기 */}
              <a style={S.personLink} href="여기에_인터뷰_URL" target="_blank" rel="noreferrer">
                지구인-터뷰 보러가기
              </a>
            </div>

            {/* 오늘은 지구인 */}
            <div>
              <div style={S.personAvatar}>
                {/* 사진: <img src="URL" style={S.personAvatarImg} alt="오늘은 지구인" /> */}
                🌍
              </div>
              <p style={S.personDesc}>오늘은 지구인(사진)<br />설명 멘트</p>
              {/* ↓ 봉사단 링크 */}
              <a style={S.personLink} href="여기에_봉사단_URL" target="_blank" rel="noreferrer">
                활동 보러가기
              </a>
            </div>
          </section>

          {/* ⑥ 지도 버튼 */}
          <div style={S.mapBtnWrap}>
            {/* ↓ 지도 URL */}
            <a style={S.mapBtn} href="여기에_지도_URL" target="_blank" rel="noreferrer">
              다른 지구 카페 확인하기 →
            </a>
          </div>

          {/* ⑦ 로고 + 링크 */}
          <section style={S.footerSection}>
            <img src={LOGO_URL} alt="지소행 로고" style={S.footerLogo} />
            <div style={S.footerLinks}>
              <a
                style={S.footerLink}
                href="https://www.instagram.com/savingearthu/"
                target="_blank"
                rel="noreferrer"
              >
                인스타그램
              </a>
              <a
                style={S.footerLink}
                href="https://savingearthu.org"
                target="_blank"
                rel="noreferrer"
              >
                홈페이지
              </a>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}