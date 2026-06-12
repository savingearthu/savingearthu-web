import { useState, useEffect } from "react";

// ── URL 설정 ──────────────────────────────────────────────────────────────────
const API_URL = "https://script.google.com/macros/s/AKfycbyzE7WdVzzrdS7PhzyvponsP9wvtSxI9EroRozP12vVeCLtC1RPe_Rx1bKOORnxkzEy/exec";
const LOGO_URL = "https://cdn.imweb.me/upload/S20230420b05ab2cbf2d03/17b01aa6bd13a.png";
const BG_IMAGE = "/bg.jpg";
const INTERVIEW_URL = "https://stibee.com/api/v1.0/emails/share/5VZxW3ytjo2n2O7uTRp-sVi4Uh9A-p0";
const RECYCLE_URL  = "https://savingearthu.org/actions/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=170908572&t=board";
const HOME_URL  = "https://savingearthu.org/";
const INSTA_URL = "https://www.instagram.com/savingearthu/";
const MAP_URL   = "https://naver.me/GlR9fVER";
// ─────────────────────────────────────────────────────────────────────────────

function getCafeId() {
  return new URLSearchParams(window.location.search).get("cafeId") || "";
}

function fmt(n) {
  const v = Number(n);
  if (isNaN(v)) return "0";
  if (v < 10) return v.toFixed(1);
  return Math.round(v).toLocaleString("ko-KR");
}

// ── 공통 스타일 ───────────────────────────────────────────────────────────────
const BASE_STYLE = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #f0f4f8; }
  @keyframes pulse {
    0%,100% { opacity:.3; transform:scale(.8); }
    50%      { opacity:1;  transform:scale(1.1); }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;

// ── 로딩 ─────────────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div style={{
      minHeight:"100vh", background:"#f0f4f8",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:16,
      fontFamily:"'Noto Sans KR',sans-serif",
    }}>
      <div style={{ display:"flex", gap:6 }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            display:"inline-block", width:9, height:9, borderRadius:"50%",
            background: i===1 ? "rgba(0,120,200,0.3)" : "#0078C8",
            animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`,
          }} />
        ))}
      </div>
      <p style={{ fontSize:13, color:"rgba(0,0,0,0.35)" }}>잠깐만요…</p>
    </div>
  );
}

// ── 에러 ─────────────────────────────────────────────────────────────────────
function ErrorScreen({ detail }) {
  return (
    <div style={{
      minHeight:"100vh", background:"#f0f4f8",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'Noto Sans KR',sans-serif",
      textAlign:"center", padding:"2rem", gap:8,
    }}>
      <p style={{ fontSize:36, marginBottom:4 }}>🌱</p>
      <p style={{ fontSize:14, color:"rgba(0,0,0,0.55)" }}>카페 정보를 찾을 수 없어요.</p>
      <p style={{ fontSize:11, color:"rgba(0,0,0,0.3)" }}>{detail}</p>
    </div>
  );
}

// ── 홈 화면 (드롭다운 선택) ──────────────────────────────────────────────────
function HomeScreen() {
  const [cafes, setCafes]         = useState([]);
  const [open, setOpen]           = useState(false);
  const [loadingList, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}?action=list`, { redirect: "follow" })
      .then(r => r.json())
      .then(d => { setCafes(d.cafes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function select(cafe) {
    window.location.href = `?cafeId=${encodeURIComponent(cafe.id)}`;
  }

  return (
    <>
      <style>{BASE_STYLE}</style>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet" />

      <div style={{
        minHeight:"100vh",
        background:"linear-gradient(160deg,#e8f4fd 0%,#d0eaff 50%,#c2e0ff 100%)",
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        fontFamily:"'Noto Sans KR',sans-serif",
        padding:"2rem 1.5rem",
        gap:"2rem",
      }}>

        {/* 로고 */}
        <img src={LOGO_URL} alt="지소행 로고" style={{ width:160, objectFit:"contain" }} />

        {/* 드롭다운 버튼 */}
        <div style={{ width:"100%", maxWidth:400, position:"relative", zIndex:100 }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
              background:"#fff", borderRadius:50,
              padding:"0.85rem 1.25rem",
              boxShadow:"0 4px 20px rgba(0,120,200,0.15)",
              border: open ? "2px solid #0078C8" : "2px solid transparent",
              cursor:"pointer", transition:"border .2s",
              fontFamily:"'Noto Sans KR',sans-serif",
            }}
          >
            <span style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:18, color:"#0078C8" }}>🔍</span>
              <span style={{ fontSize:15, color:"#aaa" }}>지구 카페 찾기...</span>
            </span>
            <span style={{
              fontSize:12, color:"#0078C8",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition:"transform .2s",
            }}>▼</span>
          </button>

          {/* 드롭다운 목록 */}
          {open && (
            <div style={{
              position:"absolute", top:"calc(100% + 8px)", left:0, right:0,
              background:"#fff", borderRadius:16,
              boxShadow:"0 8px 32px rgba(0,0,0,0.12)",
              maxHeight:300, overflowY:"auto",
              animation:"fadeUp .15s ease",
            }}>
              {loadingList ? (
                <p style={{ padding:"1rem", textAlign:"center", fontSize:13, color:"#aaa" }}>
                  카페 목록 불러오는 중…
                </p>
              ) : cafes.length === 0 ? (
                <p style={{ padding:"1rem", textAlign:"center", fontSize:13, color:"#aaa" }}>
                  카페 목록이 없어요
                </p>
              ) : cafes.map((cafe, i) => (
                <div key={cafe.id}
                  onClick={() => select(cafe)}
                  style={{
                    padding:"0.85rem 1.25rem",
                    cursor:"pointer",
                    fontSize:14, color:"#222",
                    borderBottom: i < cafes.length-1 ? "1px solid #f0f0f0" : "none",
                    transition:"background .1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background="#f0f7ff"}
                  onMouseLeave={e => e.currentTarget.style.background="#fff"}
                >
                  {cafe.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 설명 */}
        <p style={{ fontSize:14, color:"rgba(0,60,120,0.65)", textAlign:"center", lineHeight:1.7 }}>
          지소행과 함께 종이팩 자원순환을 실천하는<br />충무로의 지구카페들을 확인해보세요!
        </p>

        {/* 바깥 클릭 시 드롭다운 닫기 */}
        {open && (
          <div
            style={{ position:"fixed", inset:0, zIndex:99 }}
            onClick={() => setOpen(false)}
          />
        )}
      </div>
    </>
  );
}

// ── 카페 상세 페이지 ──────────────────────────────────────────────────────────
function CafePage({ data }) {

  function share() {
    if (navigator.share) {
      navigator.share({ title: data.cafe, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("링크가 복사되었어요!");
    }
  }

  const FLOW = ["카페", "지소행(수거)", "제지회사", "재생 종이(휴지)", "기후 취약계층"];

  return (
    <>
      <style>{BASE_STYLE + `
        .stat-card {
          background: #0078C8;
          border-radius: 16px;
          padding: 1.2rem 0.5rem;
          display: flex; flex-direction: column;
          align-items: center; gap: 0.5rem;
          flex: 1;
        }
        .btn-primary {
          display: flex; align-items: center; justify-content: center;
          width: 100%; padding: 1rem 1.5rem;
          background: #0078C8; border-radius: 50px;
          text-decoration: none; font-size: 15px;
          font-weight: 700; color: #fff; border: none; cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,120,200,0.25);
          font-family: 'Noto Sans KR', sans-serif;
        }
        .btn-secondary {
          display: flex; align-items: center; justify-content: center;
          width: 100%; padding: 1rem 1.5rem;
          background: #fff; border-radius: 50px;
          text-decoration: none; font-size: 15px;
          font-weight: 700; color: #0078C8; border: 2px solid #0078C8; cursor: pointer;
          font-family: 'Noto Sans KR', sans-serif;
        }
        .card {
          background: #fff; border-radius: 16px;
          padding: 1.2rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .flow-step {
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          flex: 1;
        }
        .flow-icon {
          width: 44px; height: 44px; border-radius: 50%;
          background: #e8f4fd;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet" />

      <div style={{
        minHeight:"100vh", maxWidth:480, margin:"0 auto",
        background:"#f0f4f8",
        fontFamily:"'Noto Sans KR',sans-serif",
        color:"#222", paddingBottom:"3rem",
      }}>

        {/* 헤더 배경 */}
        <div style={{
          background:"linear-gradient(160deg,#0078C8,#005fa3)",
          padding:"3.5rem 1.5rem 2rem",
          position:"relative", overflow:"hidden",
        }}>
          {/* 뒤로가기 */}
          <a href="/" style={{
            position:"absolute", top:"1.2rem", left:"1.2rem",
            color:"rgba(255,255,255,0.8)", textDecoration:"none",
            fontSize:13, display:"flex", alignItems:"center", gap:4,
          }}>
            ← 목록으로
          </a>

          <h1 style={{
            fontSize:36, fontWeight:900, color:"#fff",
            letterSpacing:-1, lineHeight:1.15, marginBottom:"0.4rem",
          }}>
            {data.cafe}
          </h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", fontWeight:400 }}>
            2025년부터 함께하는 지구카페
          </p>
        </div>

        <div style={{ padding:"1.5rem", display:"flex", flexDirection:"column", gap:"1rem" }}>

          {/* ① 통계 3칸 */}
          <div style={{ display:"flex", gap:"0.75rem" }}>
            {[
              { label:"종이팩", value:fmt(data.count),  unit:"개",  emoji:"📦" },
              { label:"살린 나무", value:fmt(data.trees),  unit:"그루", emoji:"🌳" },
              { label:"재생 휴지", value:fmt(data.tissue), unit:"개",  emoji:"🧻" },
            ].map((s,i) => (
              <div key={i} className="stat-card">
                <span style={{ fontSize:22 }}>{s.emoji}</span>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.8)", fontWeight:500 }}>{s.label}</p>
                <p style={{ fontSize:26, fontWeight:900, color:"#fff", letterSpacing:-1, lineHeight:1 }}>
                  {s.value}
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginLeft:2 }}>{s.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* ② 자원순환 구조 */}
          <div className="card">
            <p style={{ fontSize:12, fontWeight:700, color:"#0078C8", marginBottom:"1rem", letterSpacing:0.5 }}>
              자원순환 구조
            </p>
            <div style={{ display:"flex", alignItems:"flex-start", gap:0 }}>
              {FLOW.map((step, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", flex:1 }}>
                  <div className="flow-step">
                    <div className="flow-icon">
                      {["☕","🚚","🏭","🧻","🤝"][i]}
                    </div>
                    <p style={{ fontSize:10, color:"#444", textAlign:"center", lineHeight:1.4, wordBreak:"keep-all" }}>
                      {step}
                    </p>
                  </div>
                  {i < FLOW.length-1 && (
                    <span style={{ color:"#0078C8", fontSize:14, fontWeight:700, flexShrink:0, margin:"0 2px", paddingBottom:16 }}>
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ③ 사람 카드 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>

            {/* 황무연 선생님 */}
            <div className="card" style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
              <div style={{
                width:56, height:56, borderRadius:"50%",
                background:"#e8f4fd",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:28,
              }}>
                👴
              </div>
              <p style={{ fontSize:11, color:"#555", lineHeight:1.6 }}>
                충무로 카페의 종이팩을<br />매일 수거하고 계시는<br />어르신 활동가
              </p>
              <a href={INTERVIEW_URL} target="_blank" rel="noreferrer"
                style={{ fontSize:11, fontWeight:700, color:"#0078C8", textDecoration:"none" }}>
                지구인-터뷰 보러가기 →
              </a>
            </div>

            {/* 종이팩 다시쓰기 */}
            <div className="card" style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
              <div style={{
                width:56, height:56, borderRadius:"50%",
                background:"#e8f4fd",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:28,
              }}>
                ♻️
              </div>
              <p style={{ fontSize:11, color:"#555", lineHeight:1.6 }}>
                종이팩이 다시<br />재생 휴지로 태어나<br />전달되는 이야기
              </p>
              <a href={RECYCLE_URL} target="_blank" rel="noreferrer"
                style={{ fontSize:11, fontWeight:700, color:"#0078C8", textDecoration:"none" }}>
                활동 보러가기 →
              </a>
            </div>
          </div>

          {/* ④ 버튼 */}
          <a href={MAP_URL} target="_blank" rel="noreferrer" className="btn-primary">
            다른 지구 카페 확인하기 →
          </a>

          <button onClick={share} className="btn-secondary">
            공유하기
          </button>

          {/* ⑤ 로고 */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"0.75rem", paddingTop:"0.5rem" }}>
            <img src={LOGO_URL} alt="지소행 로고" style={{ width:120, objectFit:"contain" }} />
            <div style={{ display:"flex", gap:16 }}>
              <a href={INSTA_URL} target="_blank" rel="noreferrer"
                style={{ fontSize:12, color:"#888", textDecoration:"none" }}>인스타그램</a>
              <a href={HOME_URL} target="_blank" rel="noreferrer"
                style={{ fontSize:12, color:"#888", textDecoration:"none" }}>홈페이지</a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// ── 루트 ─────────────────────────────────────────────────────────────────────
export default function App() {
  const cafeId = getCafeId();

  // cafeId 없으면 홈 화면
  if (!cafeId) return <HomeScreen />;

  // cafeId 있으면 카페 상세
  return <CafeDetailLoader cafeId={cafeId} />;
}

function CafeDetailLoader({ cafeId }) {
  const [status, setStatus] = useState("loading");
  const [data, setData]     = useState(null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    fetch(`${API_URL}?cafeId=${encodeURIComponent(cafeId)}`, { redirect: "follow" })
      .then(r => r.json())
      .then(d => {
        if (!d.cafe) { setErrMsg(`등록된 카페를 찾지 못했어요. (${cafeId})`); setStatus("error"); }
        else { setData(d); setStatus("ok"); }
      })
      .catch(e => { setErrMsg(e.message); setStatus("error"); });
  }, [cafeId]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "error")   return <ErrorScreen detail={errMsg} />;
  return <CafePage data={data} />;
}