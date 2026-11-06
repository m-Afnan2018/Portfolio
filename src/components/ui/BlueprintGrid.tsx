/**
 * The recurring blueprint motif, kept deliberately quiet: two margin guide
 * lines and corner crosshairs. (A full 12-column grid + live scroll
 * coordinate readouts competed with the particle Core and the content, so
 * they were removed; the hero shows the coordinates once.)
 */
export function BlueprintGrid() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]">
      <div className="absolute inset-y-0 right-[5vw] left-[5vw] border-x border-[var(--guide)] lg:left-[calc(5vw+48px)]" />
      <span className="crosshair top-[60px] left-[calc(5vw-5px)] lg:left-[calc(5vw+43px)]" />
      <span className="crosshair top-[60px] right-[calc(5vw-5px)]" />
      <span className="crosshair bottom-[38px] left-[calc(5vw-5px)] lg:left-[calc(5vw+43px)]" />
      <span className="crosshair right-[calc(5vw-5px)] bottom-[38px]" />
    </div>
  );
}
