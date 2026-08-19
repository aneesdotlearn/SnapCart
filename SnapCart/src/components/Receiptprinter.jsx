import React, { createContext, useContext } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";

const ReceiptPrinterContext = createContext(null);

function useReceiptPrinter(component) {
  const ctx = useContext(ReceiptPrinterContext);

  if (!ctx) {
    throw new Error(
      `${component} must be used inside ReceiptPrinter.Root.`
    );
  }

  return ctx;
}

// ======================================================
// Receipt torn bottom
// ======================================================

const TOOTH_COUNT = 28;
const TOOTH_DEPTH = 4;

const toothPoints = Array.from(
  { length: TOOTH_COUNT * 2 },
  (_, index) => {
    const x =
      100 - ((index + 1) * 100) / (TOOTH_COUNT * 2);

    const y =
      index % 2 === 0
        ? "100%"
        : `calc(100% - ${TOOTH_DEPTH}px)`;

    return `${x}% ${y}`;
  }
).join(", ");

const receiptClipPath = `polygon(
  0 0,
  100% 0,
  100% calc(100% - ${TOOTH_DEPTH}px),
  ${toothPoints}
)`;

// ======================================================
// Status labels
// ======================================================

const statusLabels = {
  processing: "Processing your order",
  printing: "Printing your receipt",
  complete: "Order complete",
};

// ======================================================
// Root
// ======================================================

function ReceiptPrinterRoot({
  stage,
  children,
  className = "",
}) {
  return (
    <ReceiptPrinterContext.Provider value={{ stage }}>
      <section
        data-stage={stage}
        className={`relative isolate mx-auto flex w-full max-w-sm flex-col items-center ${className}`}
      >
        {children}
      </section>
    </ReceiptPrinterContext.Provider>
  );
}

// ======================================================
// Machine
// ======================================================

function ReceiptPrinterMachine({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        relative isolate
        w-full
        overflow-hidden
        rounded-3xl
        border border-purple-950
        bg-gradient-to-b
        from-purple-900
        to-purple-950
        p-3
        pb-8
        shadow-[0_20px_36px_-20px_rgba(76,29,149,0.55),0_6px_14px_-8px_rgba(76,29,149,0.3)]
        ${className}
      `}
    >
      {children}

      {/* Paper slot */}
      <div
        aria-hidden="true"
        className="
          absolute
          inset-x-6
          bottom-3
          z-40
          h-2
          rounded
          bg-black/50
          shadow-inner
        "
      />
    </div>
  );
}

// ======================================================
// Header
// ======================================================

function ReceiptPrinterHeader({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        relative
        z-10
        flex
        h-10
        items-center
        justify-between
        px-2
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ======================================================
// Screen
// ======================================================

function ReceiptPrinterScreen({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        relative
        z-10
        overflow-hidden
        rounded-2xl
        border
        border-black/20
        bg-purple-950
        p-4
        text-white
        shadow-inner
        ${className}
      `}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// ======================================================
// Status Indicator
// ======================================================

function StatusIndicator({ stage }) {
  const isComplete = stage === "complete";

  return (
    <span className="relative grid size-5 shrink-0 place-items-center">
      {isComplete ? (
        <FaCheckCircle
          className="text-green-400"
          size={17}
        />
      ) : (
        <FaSpinner
          className="animate-spin text-purple-200"
          size={15}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

// ======================================================
// Status
// ======================================================

function ReceiptPrinterStatus({
  children,
  className = "",
}) {
  const { stage } = useReceiptPrinter(
    "ReceiptPrinter.Status"
  );

  return (
    <div
      className={`
        flex
        min-w-0
        items-center
        gap-2
        ${className}
      `}
    >
      <StatusIndicator stage={stage} />

      <div
        aria-live="polite"
        role="status"
        className="
          min-w-0
          flex-1
          truncate
          text-xs
          font-bold
          text-purple-100
        "
      >
        {children ?? statusLabels[stage]}
      </div>
    </div>
  );
}

// ======================================================
// Output / Printing animation
// ======================================================

function ReceiptPrinterOutput({
  children,
  className = "",
}) {
  const { stage } = useReceiptPrinter(
    "ReceiptPrinter.Output"
  );

  const isVisible = stage !== "processing";
  const isPrinting = stage === "printing";

  return (
    <div
      className={`
        relative
        z-30
        -mt-4
        w-[calc(80%+3rem)]
        max-w-full
        overflow-hidden
        px-6
        ${className}
      `}
    >
      {/* Shadow immediately below the printer slot */}
      {isVisible && (
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-6
            -top-1
            z-20
            h-3
            bg-purple-950/70
            blur-[6px]
          "
        />
      )}

      <div
        className={`
          relative
          isolate
          ${isPrinting ? "receipt-printing" : ""}
        `}
        style={{
          /*
           * Keep the receipt completely hidden while processing.
           *
           * When printing starts, CSS animation takes control.
           */
          opacity: isVisible ? 1 : 0,
        }}
      >
        {children}
      </div>

      <style>{`
        /*
         * ==================================================
         * RECEIPT PRINTING ANIMATION
         * ==================================================
         *
         * The receipt starts above the visible area,
         * inside the printer.
         *
         * Then it slowly moves downward.
         */

        .receipt-printing {
          animation:
            receipt-feed-out
            1600ms
            cubic-bezier(0.65, 0, 0.35, 1)
            forwards;
        }

        @keyframes receipt-feed-out {

          /*
           * Receipt is completely inside printer
           */
          0% {
            transform: translateY(-110%);
            opacity: 0;
          }

          /*
           * Receipt begins appearing from slot
           */
          12% {
            transform: translateY(-88%);
            opacity: 1;
          }

          /*
           * Slow feed
           */
          40% {
            transform: translateY(-55%);
          }

          70% {
            transform: translateY(-25%);
          }

          /*
           * Final position
           */
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }

        /*
         * Respect reduced-motion accessibility preference.
         */
        @media (prefers-reduced-motion: reduce) {
          .receipt-printing {
            animation: none;
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// ======================================================
// Paper
// ======================================================

function ReceiptPrinterPaper({
  children,
  className = "",
}) {
  return (
    <article
      className={`
        relative
        z-10
        min-h-[18rem]
        bg-white
        px-6
        pt-7
        pb-9
        font-mono
        text-purple-950
        ${className}
      `}
      style={{
        clipPath: receiptClipPath,
      }}
    >
      {children}
    </article>
  );
}

// ======================================================
// Export
// ======================================================

export const ReceiptPrinter = {
  Root: ReceiptPrinterRoot,
  Machine: ReceiptPrinterMachine,
  Header: ReceiptPrinterHeader,
  Screen: ReceiptPrinterScreen,
  Status: ReceiptPrinterStatus,
  Output: ReceiptPrinterOutput,
  Paper: ReceiptPrinterPaper,
};

export default ReceiptPrinter;