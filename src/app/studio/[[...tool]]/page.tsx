"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

const configured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_DATASET,
);

export default function StudioPage() {
  if (!configured) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#0e0d12",
          color: "#f2f0ec",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            Sanity Studio
          </h1>
          <p style={{ lineHeight: 1.6, color: "#aaa6b3" }}>
            No Sanity project connected yet. Copy{" "}
            <code style={{ color: "#f2f0ec" }}>.env.example</code> to{" "}
            <code style={{ color: "#f2f0ec" }}>.env.local</code>, add your
            project ID and dataset, restart the dev server, then reload this
            page.
          </p>
          <p style={{ lineHeight: 1.6, color: "#aaa6b3", marginTop: "1rem" }}>
            Until then the public site runs from{" "}
            <code style={{ color: "#f2f0ec" }}>content/events.json</code>.
          </p>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
