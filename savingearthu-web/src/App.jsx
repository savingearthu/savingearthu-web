cat > /mnt/user-data/outputs/App.jsx << 'JSXEOF'
import { useState, useEffect } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbyzE7WdVzzrdS7PhzyvponsP9wvtSxI9EroRozP12vVeCLtC1RPe_Rx1bKOORnxkzEy/exec";
const LOGO_URL = "https://impact.career/_storage_/public/2/r86hg3b8piirdieepxq9xgrq141y";
const BG_IMAGE = "/bg.jpg";
const INTERVIEW_URL = "https://savingearthu.org/n1/?q=YToxOntzOjEyOiJrZXl3b3JkX3R5cGUiO3M6MzoiYWxsIjt9&bmode=view&idx=170908572&t=board";
const NEWSLETTER_URL = "https://stibee.com/api/v1.0/emails/share/5VZxW3ytjo2n2O7uTRp-sVi4Uh9A-p0";
const HOME_URL = "https://savingearthu.org/";
const INSTA_URL = "https://www.instagram.com/savingearthu/";

const CYCLE_STEPS = [
  { icon: "☕", step: "1단계", title: "카페에서 수거", desc: "충무로 카페들이 종이팩을 모아요. 버려지던 종이팩이 새 여정을 시작해요.", bg: "#1a1a1a", color: "#fff", accent: "rgba(255,255,255,0.2)" },
  { icon: "🌿", step: "2단계", title: "지소행이 수거해요", desc: "황무연 선생님과 어르신 활동가들이 직접 카페를 돌며 종이팩을 수거해요.", bg: "#00a54f", color: "#fff", accent: "rgba(255,255,255,0.2)" },
  { icon: "🏭", step: "3단계", title: "제지회사로 이동", desc: "수거된 종이팩은 제지회사로 전달돼요. 재활용 공정이 시작되는 순간이에요.", bg: "#f5f0e8", color: "#1a1a1a", accent: "rgba(0,0,0,0.08)" },
  { icon: "🧻", step: "4단계", title: "재생 종이·휴지로", desc: "종이팩이 깨끗한 재생 휴지로 다시 태어나요. 자원이 순환되는 순간이에요.", bg: "#00aeef", color: "#fff", accent: "rgba(255,255,255,0.2)" },
  { icon: "🤝", step: "5단계", title: "기후 취약계층 전달", desc: "만들어진 휴지는 기후 취약계층에게 전달돼요. 카페의 종이팩이 이웃을 도와요.", bg: "#faf3e0", color: "#1a1a1a", accent: "rgba(0,0,0,0.08)" },
];

function fmt(n) {
  const v = Number(n);
  if (isNaN(v)) return "0";
  if (v < 10) return v.toFixed(1);
  return Math.round(v).toLocaleString("ko-KR");
}

function getCafeId() {
  return new URLSearchParams(window.location.search).get("cafeId") || "";
}

// ── 로딩 ──
function LoadingScreen() {
  return (
    <div style={{ minHeight:"100vh", background:"#faf8f5", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:16, fontFamily:"'Noto Sans KR',sans-serif" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}`}</style>
      <div style={{ display:"flex", gap:6 }}>
        {[0,1,2].map(i => (
          <span key={i} style={{ display:"inline-block", width:9, height:9, borderRadius:"50%", background: i===1 ? "#e0e0e0" : "#00a54f", animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite` }} />
        ))}
      </div>
      <p style={{ fontSize:13, color:"#aaa" }}>잠깐만요…</p>
    </div>
  );
}

// ── 에러 ──
function ErrorScreen({ detail }) {
  return (
    <div style={{ minHeight:"100vh", background:"#faf8f5", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Noto Sans KR',sans-serif", textAlign:"center", padding:"2rem", gap:8 }}>
      <p style={{ fontSize:36, marginBottom:4 }}>🌱</p>
      <p style={{ fontSize:14, color:"#888" }}>카페 정보를 찾을 수 없어요.</p>
      <p style={{ fontSize:11, color:"#ccc" }}>{detail}</p>
    </div>
  );
}

// ── 순환구조 카드 ──
function CycleSection() {
  const [cur, setCur] = useState(0);
  const s = CYCLE_STEPS[cur];
  const next = () => setCur(c => (c + 1) % CYCLE_STEPS.length);

  return (
    <div style={{ background:"#fff", padding:"1.1rem", borderBottom:"1px solid #eeeae4" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:".9rem" }}>
        <span style={{ fontSize:10, fontWeight:500, color:"#aaa", letterSpacing:1, textTransform:"uppercase" }}>순환 구조</span>
        <div style={{ display:"flex", gap:5 }}>
          {CYCLE_STEPS.map((_, i) => (
            <span key={i} onClick={() => setCur(i)} style={{ width:6, height:6, borderRadius:"50%", background: i===cur ? "#00a54f" : "#e0e0e0", display:"block", cursor:"pointer", transform: i===cur ? "scale(1.3)" : "scale(1)", transition:"all .2s" }} />
          ))}
        </div>
      </div>

      <div onClick={next} style={{ background:s.bg, color:s.color, borderRadius:16, padding:"1.2rem", minHeight:105, display:"flex", flexDirection:"column", justifyContent:"space-between", cursor:"pointer", transition:"transform .15s", userSelect:"none" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <span style={{ fontSize:26, lineHeight:1 }}>{s.icon}</span>
          <span style={{ fontSize:10, fontWeight:500, padding:"3px 9px", borderRadius:20, background:s.accent, color:s.color }}>{s.step}</span>
        </div>
        <div>
          <p style={{ fontSize:17, fontWeight:900, marginBottom:3, letterSpacing:"-.5px" }}>{s.title}</p>
          <p style={{ fontSize:11, opacity:.72, lineHeight:1.5 }}>{s.desc}</p>
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:".8rem", fontSize:11, fontWeight:500, color: s.color==="#fff" ? "#aaa" : "rgba(0,0,0,0.4)" }}>
        {cur < CYCLE_STEPS.length - 1
          ? <span>탭해서 다음 단계 →</span>
          : <span style={{ color:"#00a54f", fontWeight:700 }}>✓ 순환 완료!</span>
        }
      </div>
    </div>
  );
}

// ── 홈 화면 ──
function HomePage({ onSelect }) {
  const [cafeList, setCafeList] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then(d => { setCafeList(d.cafeList || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet" />
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#faf8f5; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .cafe-item:hover { background:#f0faf4 !important; }
      `}</style>
      <div style={{ minHeight:"100vh", maxWidth:480, margin:"0 auto", fontFamily:"'Noto Sans KR',sans-serif", background:"#faf8f5", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"2rem 1.5rem", position:"relative" }}>

        <img src={LOGO_URL} alt="지소행 로고" style={{ width:160, marginBottom:"2.5rem" }} />

        <div style={{ width:"100%", position:"relative" }}>
          <div onClick={() => setOpen(o => !o)} style={{ width:"100%", padding:".85rem 1.2rem", background: open ? "#fff" : "#00aeef", border: "2px solid #00aeef", borderRadius: open ? "16px 16px 0 0" : 50, display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer", transition:"all .2s" }}>
            <span style={{ fontSize:15, fontWeight:500, color: open ? "#00aeef" : "#fff" }}>지구 카페 찾기…</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={open ? "#00aeef" : "#fff"} strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>

          {open && (
            <div style={{ position:"absolute", top:"100%", left:0, right:0, background:"#fff", border:"2px solid #00aeef", borderTop:"none", borderRadius:"0 0 16px 16px", overflow:"hidden", boxShadow:"0 8px 24px rgba(0,174,239,0.15)", zIndex:10, animation:"fadeIn .15s ease", maxHeight:300, overflowY:"auto" }}>
              {loading ? (
                <div style={{ padding:"1.2rem", textAlign:"center", color:"#aaa", fontSize:13 }}>불러오는 중…</div>
              ) : cafeList.length === 0 ? (
                <div style={{ padding:"1.2rem", textAlign:"center", color:"#aaa", fontSize:13 }}>등록된 카페가 없어요</div>
              ) : cafeList.map((cafe, i) => (
                <div key={cafe.id} className="cafe-item" onClick={() => onSelect(cafe.id)} style={{ padding:".9rem 1.2rem", display:"flex", alignItems:"center", gap:10, cursor:"pointer", borderBottom: i < cafeList.length-1 ? "1px solid #f0f0f0" : "none", transition:"background .15s" }}>
                  <span style={{ width:28, height:28, borderRadius:"50%", background:"#e8f7ef", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>☕</span>
                  <span style={{ fontSize:14, fontWeight:500, color:"#202020" }}>{cafe.name}</span>
                  <span style={{ marginLeft:"auto", color:"#00a54f", fontSize:13 }}>→</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p style={{ marginTop:"1.2rem", fontSize:13, color:"#aaa", textAlign:"center", lineHeight:1.7 }}>
          지소행과 함께 종이팩 자원순환을 실천하는<br />충무로의 지구카페들을 확인해보세요!
        </p>

        <div style={{ position:"absolute", bottom:"2rem", display:"flex", gap:16 }}>
          <a href={INSTA_URL} target="_blank" rel="noreferrer" style={{ fontSize:11, color:"#bbb", textDecoration:"none" }}>인스타그램</a>
          <a href={HOME_URL} target="_blank" rel="noreferrer" style={{ fontSize:11, color:"#bbb", textDecoration:"none" }}>홈페이지</a>
        </div>
      </div>
    </>
  );
}

// ── 카페 상세 페이지 ──
function CafePage({ cafeId, onBack }) {
  const [status, setStatus] = useState("loading");
  const [data, setData] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    fetch(`${API_URL}?cafeId=${encodeURIComponent(cafeId)}`)
      .then(r => r.json())
      .then(d => {
        if (!d.cafe) { setErrMsg(`등록된 카페를 찾지 못했어요. (${cafeId})`); setStatus("error"); }
        else { setData(d); setStatus("ok"); }
      })
      .catch(e => { setErrMsg(e.message); setStatus("error"); });
  }, [cafeId]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "error") return <ErrorScreen detail={errMsg} />;

  const stats = [
    { emoji:"♻️", label:"종이팩량", value: fmt(data.count), unit:"개", color:"#00a54f" },
    { emoji:"🌳", label:"살린 나무", value: fmt(data.trees), unit:"그루", color:"#2e7d32" },
    { emoji:"🧻", label:"재생 휴지", value: fmt(data.tissue), unit:"개", color:"#00aeef" },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet" />
      <style>{`* { margin:0; padding:0; box-sizing:border-box; } body { background:#faf8f5; }`}</style>

      <div style={{ minHeight:"100vh", maxWidth:480, margin:"0 auto", fontFamily:"'Noto Sans KR',sans-serif", background:"#faf8f5", color:"#1a1a1a" }}>

        {/* 히어로 */}
        <div style={{ position:"relative", height:220, overflow:"hidden" }}>
          <div style={{ width:"100%", height:"100%", backgroundImage:`url(${BG_IMAGE})`, backgroundSize:"cover", backgroundPosition:"center", filter:"brightness(0.45)" }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.6) 100%)" }} />
          <button onClick={onBack} style={{ position:"absolute", top:"1rem", left:"1rem", background:"rgba(255,255,255,0.18)", backdropFilter:"blur(8px)", border:"none", borderRadius:50, padding:"5px 13px", color:"#fff", fontSize:11, fontFamily:"'Noto Sans KR',sans-serif", cursor:"pointer" }}>
            ← 목록
          </button>
          <div style={{ position:"absolute", bottom:"1.2rem", left:"1.3rem", right:"1.3rem" }}>
            <p style={{ fontSize:10, fontWeight:500, color:"rgba(255,255,255,0.55)", letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:3 }}>참여 카페</p>
            <h1 style={{ fontSize:28, fontWeight:900, color:"#fff", letterSpacing:-1, lineHeight:1.15, marginBottom:4, textShadow:"0 2px 16px rgba(0,0,0,0.4)" }}>{data.cafe}</h1>
            <span style={{ display:"inline-flex", alignItems:"center", background:"rgba(255,255,255,0.15)", backdropFilter:"blur(4px)", borderRadius:20, padding:"3px 10px", fontSize:10, color:"rgba(255,255,255,0.85)", fontWeight:500 }}>
              <em style={{ color:"#a8f0c6", fontStyle:"normal" }}>2025</em>년부터 함께하는 지구카페
            </span>
          </div>
        </div>

        {/* 스탯 3분할 카드 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, padding:"1rem", background:"#faf8f5", borderBottom:"1px solid #eeeae4" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background:"#fff", borderRadius:16, padding:".9rem .6rem 1rem", textAlign:"center", border:"1px solid #f0ede8" }}>
              <span style={{ fontSize:20, marginBottom:".4rem", display:"block" }}>{s.emoji}</span>
              <p style={{ fontSize:10, color:"#aaa", fontWeight:500, marginBottom:".35rem", letterSpacing:".2px" }}>{s.label}</p>
              <p style={{ fontSize:26, fontWeight:900, letterSpacing:"-1.5px", lineHeight:1, color:s.color }}>
                {s.value}<span style={{ fontSize:11, fontWeight:400, color:"#bbb", marginLeft:1 }}>{s.unit}</span>
              </p>
            </div>
          ))}
        </div>

        {/* 인용구 */}
        <div style={{ background:"#fff", padding:"1.1rem 1.3rem", borderBottom:"1px solid #eeeae4", borderTop:"1px solid #eeeae4" }}>
          <p style={{ fontSize:13, fontWeight:500, color:"#2a2a2a", lineHeight:1.7, borderLeft:"3px solid #00a54f", paddingLeft:".9rem" }}>
            <em style={{ color:"#00a54f", fontStyle:"normal" }}>{data.cafe}</em>은<br />자원순환이 시작되는 곳입니다
          </p>
        </div>

        {/* 순환구조 */}
        <CycleSection />

        {/* 사람들 */}
        <div style={{ background:"#fff", borderBottom:"1px solid #eeeae4" }}>
          <p style={{ padding:".9rem 1.2rem .4rem", fontSize:10, fontWeight:500, color:"#aaa", letterSpacing:1, textTransform:"uppercase" }}>함께하는 사람들</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:1, background:"#eeeae4" }}>
            {[
              { emoji:"👴", name:"황무연 선생님", desc:"충무로 카페의 종이팩을 매일 수거하고 계시는 어르신 활동가", link:"지구인-터뷰 →", href:INTERVIEW_URL },
              { emoji:"🌍", name:"오늘은 지구인", desc:"함께 지구를 지키는 봉사단", link:"활동 보러가기 →", href:NEWSLETTER_URL },
            ].map((p, i) => (
              <div key={i} style={{ background:"#fff", padding:".9rem" }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"#f0ede8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:".5rem" }}>{p.emoji}</div>
                <p style={{ fontSize:12, fontWeight:700, color:"#1a1a1a", marginBottom:2 }}>{p.name}</p>
                <p style={{ fontSize:10, color:"#888", lineHeight:1.45, marginBottom:".45rem" }}>{p.desc}</p>
                <a href={p.href} target="_blank" rel="noreferrer" style={{ fontSize:10, fontWeight:600, color:"#00a54f", textDecoration:"none" }}>{p.link}</a>
              </div>
            ))}
          </div>
        </div>

        {/* 지도 버튼 */}
        <div style={{ padding:".9rem 1.1rem", background:"#fff", borderBottom:"1px solid #eeeae4" }}>
          <a href={HOME_URL} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"100%", padding:".85rem", background:"#00aeef", borderRadius:14, fontSize:13, fontWeight:700, color:"#fff", textDecoration:"none" }}>
            다른 지구 카페 확인하기 →
          </a>
        </div>

        {/* 푸터 */}
        <div style={{ padding:"1.3rem 1.2rem", background:"#fff", display:"flex", flexDirection:"column", alignItems:"center", gap:".6rem" }}>
          <img src={LOGO_URL} alt="지소행 로고" style={{ width:90, opacity:.45 }} />
          <div style={{ display:"flex", gap:12 }}>
            <a href={INSTA_URL} target="_blank" rel="noreferrer" style={{ fontSize:10, color:"#bbb", textDecoration:"none" }}>인스타그램</a>
            <a href={HOME_URL} target="_blank" rel="noreferrer" style={{ fontSize:10, color:"#bbb", textDecoration:"none" }}>홈페이지</a>
          </div>
        </div>

      </div>
    </>
  );
}

// ── 메인 App ──
export default function App() {
  const [cafeId, setCafeId] = useState(
    () => new URLSearchParams(window.location.search).get("cafeId") || ""
  );

  function handleSelect(id) {
    setCafeId(id);
    window.history.pushState({}, "", `?cafeId=${id}`);
  }

  function handleBack() {
    setCafeId("");
    window.history.pushState({}, "", "/");
  }

  return cafeId
    ? <CafePage cafeId={cafeId} onBack={handleBack} />
    : <HomePage onSelect={handleSelect} />;
}
JSXEOF