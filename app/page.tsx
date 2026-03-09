export default function Home() {
  return (
    <div className="poem-page">
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(160deg, #fdf2f8, #fce7f3, #fdf2f8)",
          gap: "1.5rem",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "3rem" }}>🌸</span>
        <h1
          style={{
            fontFamily: "var(--font-dancing), 'Dancing Script', cursive",
            fontSize: "2.2rem",
            color: "#be185d",
            letterSpacing: "0.02em",
          }}
        >
          Чамд зориулсан шүлэг
        </h1>
        <p
          style={{
            fontFamily:
              "var(--font-playfair), 'Playfair Display', Georgia, serif",
            fontStyle: "italic",
            fontSize: "1.05rem",
            color: "#9d6b8a",
            maxWidth: "320px",
            lineHeight: 1.7,
          }}
        >
          Хэн нэгэнд шүлэг хүлээж байна.
          <br />
          QR кодоо уншуулаарай.
        </p>
        <span style={{ fontSize: "1.5rem", marginTop: "0.5rem" }}>✉️</span>
      </div>
    </div>
  );
}
