import { useState, useEffect } from "react";

// ── URL 설정 ──────────────────────────────────
const API_URL = "https://script.google.com/macros/s/AKfycbyzE7WdVzzrdS7PhzyvponsP9wvtSxI9EroRozP12vVeCLtC1RPe_Rx1bKOORnxkzEy/exec";
const LOGO_URL = "https://impact.career/_storage_/public/2/r86hg3b8piirdieepxq9xgrq141y";
const BG_IMAGE = "/bg.jpg"; // public 폴더에 넣은 사진 파일명
const INTERVIEW_URL = "https://savingearthu.org/n1/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=170908572&t=board";
const NEWSLETTER_URL = "https://stibee.com/api/v1.0/emails/share/5VZxW3ytjo2n2O7uTRp-sVi4Uh9A-p0";
const HOME_URL = "https://savingearthu.org/";
const INSTA_URL = "https://www.instagram.com/savingearthu/";
// ─────────────────────────────────────────────

function getCafeId() {
  return new URLSearchParams(window.location.search).get("cafeId") || "";
}

function fmt(n) {
  const v = Number(n);
  if (isNaN(v)) return "0";
  if (v < 10) return v.toFixed(1);
  return Math.round(v).toLocaleString("ko-KR");
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#2a3a2a,#151f1a)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
      fontFamily: "'Noto Sans KR',sans-serif",
    }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}`}</style>
      <div style={{ display: "flex", gap: 6 }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            display: "inline-block", width: 9, height: 9, borderRadius: "50%",
            background: i === 1 ? "rgba(255,255,255,0.4)" : "#00a54f",
            animation: `pulse 1.2s ease-in-out ${i*0.2}s infinite`,
          }} />
        ))}
      </div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>잠깐만요…</p>
    </div>
  );
}

function ErrorScreen({ detail }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#2a3a2a,#151f1a)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Noto Sans KR',sans-serif",
      textAlign: "center", padding: "2rem", gap: 8,
    }}>
      <p style={{ fontSize: 36, marginBottom: 4 }}>🌱</p>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>카페 정보를 찾을 수 없어요.</p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{detail}</p>
    </div>
  );
}

export default function CafePage() {
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const cafeId = getCafeId();
    if (!cafeId) { setErrMsg("URL에 cafeId가 없어요."); setStatus("error"); return; }
    fetch(`${API_URL}?cafeId=${encodeURIComponent(cafeId)}`)
      .then(r => r.json())
      .then(d => {
        if (!d.cafe) { setErrMsg(`등록된 카페를 찾지 못했어요. (${cafeId})`); setStatus("error"); }
        else { setData(d); setStatus("ok"); }
      })
      .catch(e => { setErrMsg(e.message); setStatus("error"); });
  }, []);

  if (status === "loading") return <LoadingScreen />;
  if (status === "error")   return <ErrorScreen detail={errMsg} />;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet" />
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #1a2a1a; }
      `}</style>

      <div style={{
        minHeight: "100vh", maxWidth: 480, margin: "0 auto",
        position: "relative", fontFamily: "'Noto Sans KR',sans-serif",
        color: "#fff", overflowX: "hidden",
      }}>

        {/* 배경 이미지 */}
        <div style={{
          position: "fixed", inset: 0, maxWidth: 480, margin: "0 auto",
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.38)",
          zIndex: 0,
        }} />

        {/* 콘텐츠 */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", flexDirection: "column",
          alignItems: "center", textAlign: "center",
          paddingBottom: "3rem",
        }}>

          {/* ① 카페 이름 + 참여기간 */}
          <section style={{ width: "100%", padding: "5rem 1.5rem 1.5rem" }}>
            <h1 style={{
              fontSize: 42, fontWeight: 900, color: "#fff",
              letterSpacing: -1.5, lineHeight: 1.1, marginBottom: "0.5rem",
              textShadow: "0 2px 24px rgba(0,0,0,0.6)",
            }}>
              {data.cafe}
            </h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.72)", fontWeight: 400 }}>
              2025년부터 함께하는 지구카페
            </p>
          </section>

          {/* ② 통계 3칸 */}
          <div style={{
            width: "100%", display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            padding: "2rem 1.5rem 1rem", gap: 0,
          }}>
            {[
              { label: "종이팩량",  value: fmt(data.count),  unit: "개"  },
              { label: "살린 나무", value: fmt(data.trees),  unit: "그루" },
              { label: "재생 휴지", value: fmt(data.tissue), unit: "개"  },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: "0.5rem 0.25rem" }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.62)", marginBottom: "0.5rem" }}>
                  {s.label}
                </p>
                <p style={{ fontSize: 30, fontWeight: 900, color: "#fff", letterSpacing: -1.5, lineHeight: 1 }}>
                  {s.value}<span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginLeft: 2 }}>{s.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* 구분선 */}
          <div style={{ width: "calc(100% - 3rem)", height: 1, background: "rgba(255,255,255,0.15)", margin: "0.3rem 1.5rem" }} />

          {/* ③ 인용구 */}
          <section style={{ width: "100%", padding: "1rem 2rem" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.82)", lineHeight: 1.75, letterSpacing: 0.2 }}>
              "{data.cafe}은 자원순환이 시작되는 곳입니다"
            </p>
          </section>

          <div style={{ width: "calc(100% - 3rem)", height: 1, background: "rgba(255,255,255,0.15)", margin: "0.3rem 1.5rem" }} />

          {/* ④ 순환 구조 */}
          <section style={{ width: "100%", padding: "0.9rem 1.5rem", textAlign: "left" }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", lineHeight: 1.9 }}>
              {["카페", "지소행(수거)", "제지회사", "재생 종이(휴지)", "기후 취약계층 전달"].map((step, i, arr) => (
                <span key={i}>
                  <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{step}</span>
                  {i < arr.length - 1 && <span style={{ color: "rgba(255,255,255,0.35)", margin: "0 4px" }}>→</span>}
                </span>
              ))}
            </p>
          </section>

          <div style={{ width: "calc(100% - 3rem)", height: 1, background: "rgba(255,255,255,0.15)", margin: "0.3rem 1.5rem" }} />

          {/* ⑤ 사람 카드 */}
          <section style={{
            width: "100%", display: "grid",
            gridTemplateColumns: "1fr 1fr", gap: "1.2rem",
            padding: "1.2rem 1.5rem 0.5rem", textAlign: "left",
          }}>
            {/* 황무연 선생님 */}
            <div>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, marginBottom: "0.6rem", overflow: "hidden",
              }}>
                👴
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.62)", lineHeight: 1.55, marginBottom: "0.5rem" }}>
                "충무로 카페의 종이팩을 매일 수거하고 계시는 어르신 활동가"
              </p>
              <a href={INTERVIEW_URL} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, fontWeight: 600, color: "#fff", textDecoration: "underline", textUnderlineOffset: 3 }}>
                지구인-터뷰 보러가기
              </a>
            </div>

            {/* 오늘은 지구인 */}
            <div>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, marginBottom: "0.6rem", overflow: "hidden",
              }}>
                🌍
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.62)", lineHeight: 1.55, marginBottom: "0.5rem" }}>
                오늘은 지구인(사진)<br />설명 멘트
              </p>
              <a href={NEWSLETTER_URL} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, fontWeight: 600, color: "#fff", textDecoration: "underline", textUnderlineOffset: 3 }}>
                활동 보러가기
              </a>
            </div>
          </section>

          {/* ⑥ 지도 버튼 */}
          <div style={{ width: "100%", padding: "1.5rem 1.5rem 0.5rem" }}>
            <a href={HOME_URL} target="_blank" rel="noreferrer" style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "100%", padding: "1rem 1.5rem",
              background: "#00aeef", borderRadius: 50,
              textDecoration: "none", fontSize: 15, fontWeight: 700, color: "#fff",
              boxShadow: "0 4px 24px rgba(0,174,239,0.35)",
            }}>
              다른 지구 카페 확인하기 →
            </a>
          </div>

          {/* ⑦ 로고 + 링크 */}
          <section style={{
            width: "100%", padding: "2.5rem 1.5rem 2rem",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
          }}>
            <img src={LOGO_URL} alt="지소행 로고" style={{
              width: 130, objectFit: "contain",
              filter: "brightness(0) invert(1)", opacity: 0.85,
            }} />
            <div style={{ display: "flex", gap: 16 }}>
              <a href={INSTA_URL} target="_blank" rel="noreferrer"
                style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                인스타그램
              </a>
              <a href={HOME_URL} target="_blank" rel="noreferrer"
                style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                홈페이지
              </a>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
export default function App() {
  return <CafePage />;
}