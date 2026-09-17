"use client";

/**
 * AntiGravityBackground
 * Renders pure-CSS floating orbs behind the customer dashboard.
 * No JS animation loop — uses @keyframes via inline <style>.
 * Respects prefers-reduced-motion.
 */
export function AntiGravityBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="ag-root">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes ag-float-a {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            33%       { transform: translateY(-28px) translateX(12px); }
            66%       { transform: translateY(14px) translateX(-10px); }
          }
          @keyframes ag-float-b {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            40%       { transform: translateY(22px) translateX(-14px); }
            70%       { transform: translateY(-10px) translateX(8px); }
          }
          @keyframes ag-float-c {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50%       { transform: translateY(-18px) translateX(16px); }
          }
          .ag-orb { animation-timing-function: ease-in-out; animation-iteration-count: infinite; }
          .ag-orb-a { animation-name: ag-float-a; animation-duration: 14s; }
          .ag-orb-b { animation-name: ag-float-b; animation-duration: 18s; }
          .ag-orb-c { animation-name: ag-float-c; animation-duration: 22s; }
        }

        .ag-root {
          position: relative;
          min-height: 100%;
        }

        .ag-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: linear-gradient(
            135deg,
            #f0fdf4 0%,
            #f8fafc 40%,
            #eff6ff 70%,
            #fafafa 100%
          );
        }

        .ag-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(72px);
          opacity: 0.22;
          will-change: transform;
        }

        .ag-orb-1 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, #86efac 0%, transparent 70%);
          top: -100px; left: -80px;
        }
        .ag-orb-2 {
          width: 380px; height: 380px;
          background: radial-gradient(circle, #93c5fd 0%, transparent 70%);
          top: 30%; right: -120px;
        }
        .ag-orb-3 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, #fde68a 0%, transparent 70%);
          bottom: 10%; left: 20%;
          opacity: 0.15;
        }

        .ag-content {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <div className="ag-bg" aria-hidden="true">
        <div className="ag-orb ag-orb-1 ag-orb ag-orb-a" />
        <div className="ag-orb ag-orb-2 ag-orb ag-orb-b" />
        <div className="ag-orb ag-orb-3 ag-orb ag-orb-c" />
      </div>

      <div className="ag-content">{children}</div>
    </div>
  );
}
