import { useEffect, useState } from "react";
import "./App.css";

const API =
  "https://script.google.com/macros/s/AKfycbyzE7WdVzzrdS7PhzyvponsP9wvtSxI9EroRozP12vVeCLtC1RPe_Rx1bKOORnxkzEy/exec";

// 안전 숫자 처리
const safe = (v) => (v === undefined || v === null || isNaN(v) ? 0 : Number(v));

// 숫자 포맷
const fmt = (n) => {
  const v = Number(n);
  if (isNaN(v)) return "0";
  if (v < 10) return v.toFixed(1);
  return Math.round(v).toLocaleString("ko-KR");
};

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const cafeId = new URLSearchParams(window.location.search).get("cafeId");

      // 1️⃣ ID 검증
      if (!cafeId || !cafeId.startsWith("cafe_")) {
        setError("잘못된 QR입니다.");
        setLoading(false);
        return;
      }

      try {
        // 2️⃣ 타임아웃 설정
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000);

        const res = await fetch(
          `${API}?cafeId=${encodeURIComponent(cafeId)}`,
          { signal: controller.signal }
        );

        clearTimeout(timeout);

        const json = await res.json();

        if (!json || !json.cafe) {
          setError("등록된 카페 데이터를 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        // 3️⃣ 데이터 저장
        setData(json);
      } catch (e) {
        setError("데이터를 불러오지 못했습니다. 네트워크를 확인해주세요.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div>
          <span className="ld"></span>
          <span className="ld"></span>
          <span className="ld"></span>
        </div>
        <p>잠깐만요…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div id="err">
        <p style={{ fontSize: "32px", marginBottom: "10px" }}>🌱</p>
        <p style={{ color: "rgba(255,255,255,.6)" }}>{error}</p>
      </div>
    );
  }

  return (
    <div id="main">
      {/* 히어로 */}
      <section className="hero">
        <p className="hero-tag">참여 카페</p>
        <h1 className="hero-name">{data.cafe}</h1>
        <div className="hero-period">
          <em>2025</em>년부터 함께하는 지구카페
        </div>
      </section>

      {/* 스탯 */}
      <div className="stats">
        <div className="stats-grid">
          <div className="stat green">
            <p className="stat-label">종이팩량</p>
            <p className="stat-val">
              {fmt(safe(data.count))} <span className="stat-unit">개</span>
            </p>
          </div>

          <div className="stat">
            <p className="stat-label">살린 나무</p>
            <p className="stat-val">
              {fmt(safe(data.trees))} <span className="stat-unit">그루</span>
            </p>
          </div>

          <div className="stat blue">
            <p className="stat-label">재생 휴지</p>
            <p className="stat-val">
              {fmt(safe(data.tissue))} <span className="stat-unit">개</span>
            </p>
          </div>
        </div>
      </div>

      {/* 인용구 */}
      <div className="section">
        <div className="quote">
          <p>
            <em>{data.cafe}</em>는
            <br />
            자원순환이 시작되는 곳입니다
          </p>
        </div>
      </div>

      {/* 순환 구조 */}
      <div className="section">
        <p className="section-label">순환 구조</p>
        <div className="cycle-flow">
          <div className="cycle-node">
            <div className="cycle-icon" style={{ background: "#edf7f2" }}>
              ☕
            </div>
            <p className="cycle-node-label">카페<br />종이팩</p>
          </div>

          <span className="cycle-arr">→</span>

          <div className="cycle-node">
            <div className="cycle-icon" style={{ background: "#eaf7fd" }}>
              🌿
            </div>
            <p className="cycle-node-label">지소행<br />수거</p>
          </div>

          <span className="cycle-arr">→</span>

          <div className="cycle-node">
            <div className="cycle-icon" style={{ background: "#f2f2f2" }}>
              🏭
            </div>
            <p className="cycle-node-label">제지<br />회사</p>
          </div>

          <span className="cycle-arr">→</span>

          <div className="cycle-node">
            <div className="cycle-icon" style={{ background: "#edf7f2" }}>
              🧻
            </div>
            <p className="cycle-node-label">재생<br />종이</p>
          </div>

          <span className="cycle-arr">→</span>

          <div className="cycle-node">
            <div className="cycle-icon" style={{ background: "#fff8ee" }}>
              🤝
            </div>
            <p className="cycle-node-label">기후<br />취약계층</p>
          </div>
        </div>
      </div>
    </div>
  );
}