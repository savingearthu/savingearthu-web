import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // QR에서 cafeId 읽기
  const cafeId = new URLSearchParams(window.location.search).get("cafeId");

  useEffect(() => {
    if (!cafeId) {
      console.log("cafeId 없음 → QR로 접속해야 함");
      setLoading(false);
      return;
    }

    fetch(
      `https://script.google.com/macros/s/AKfycbyzE7WdVzzrdS7PhzyvponsP9wvtSxI9EroRozP12vVeCLtC1RPe_Rx1bKOORnxkzEy/exec?cafeId=${cafeId}`
    )
      .then(async (res) => {
        const text = await res.text();
        console.log("RAW:", text);
        return JSON.parse(text);
      })
      .then((json) => {
        console.log("DATA:", json);
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [cafeId]);

  if (loading) {
    return (
      <div style={styles.loading}>
        로딩중...
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.loading}>
        데이터 없음 (QR 확인)
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* 배경 */}
      <div style={styles.background} />
      <div style={styles.overlay} />

      {/* 컨텐츠 */}
      <div style={styles.container}>

        {/* 헤더 */}
        <div style={styles.header}>
          <h1 style={styles.cafeName}>{data.cafe}</h1>
          <p style={styles.subTitle}>
            2025년부터 함께하는 지구카페
          </p>
        </div>

        {/* 데이터 3개 */}
        <div style={styles.row}>
          <div style={styles.card}>
            <div style={styles.label}>종이팩량</div>
            <div style={styles.value}>{data.totalKg}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.label}>살린 나무</div>
            <div style={styles.value}>{data.trees}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.label}>재생 휴지</div>
            <div style={styles.value}>{data.tissue}</div>
          </div>
        </div>

        {/* 문구 */}
        <div style={styles.story}>
          “{data.cafe}은 자원순환이 시작되는 곳입니다”
        </div>

        {/* 순환 구조 */}
        <div style={styles.flow}>
          <div>☕ 카페</div>
          <div>→</div>
          <div>🌱 지소행</div>
          <div>→</div>
          <div>🏭 제지</div>
          <div>→</div>
          <div>📄 재생종이</div>
          <div>→</div>
          <div>♻️ 기후환원</div>
        </div>

        {/* 버튼 */}
        <button style={styles.button}>
          다른 지구카페 보기 →
        </button>

      </div>
    </div>
  );
}

/* ================= styles ================= */

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    fontFamily: "sans-serif",
    color: "#fff",
  },

  background: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "url('https://images.unsplash.com/photo-1637949754765-c846a69c4509?auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
  },

  container: {
    position: "relative",
    maxWidth: 420,
    margin: "0 auto",
    padding: "60px 16px 100px",
  },

  loading: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    marginBottom: 20,
  },

  cafeName: {
    fontSize: 28,
    margin: 0,
  },

  subTitle: {
    fontSize: 13,
    opacity: 0.8,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },

  card: {
    flex: 1,
    padding: 14,
    background: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    textAlign: "center",
  },

  label: {
    fontSize: 11,
    opacity: 0.8,
  },

  value: {
    fontSize: 22,
    fontWeight: 700,
    marginTop: 6,
  },

  story: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    opacity: 0.9,
  },

  flow: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
    fontSize: 11,
    opacity: 0.9,
  },

  button: {
    marginTop: 25,
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "none",
    background: "#fff",
    color: "#2b6cb0",
    fontWeight: 600,
    cursor: "pointer",
  },
};