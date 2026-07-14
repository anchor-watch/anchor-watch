/**
 * <anchor-trust-badge> — a framework-agnostic, accessible custom element
 * that renders a Trust Score (see @anchor-watch/trust-score and
 * docs/METHODOLOGY.md). Consumers pass an already-computed score; this
 * component only renders it, it doesn't compute it.
 *
 * Attributes:
 *   score        (required) integer 0-100
 *   anchor-name  (optional) shown in the accessible label
 */

const BANDS: Array<{ min: number; label: string }> = [
  { min: 80, label: "Excellent" },
  { min: 60, label: "Good" },
  { min: 40, label: "Fair" },
  { min: 0, label: "Low" },
];

export function qualitativeLabel(score: number): string {
  const band = BANDS.find((b) => score >= b.min);
  return band ? band.label : "Low";
}

export class AnchorTrustBadge extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["score", "anchor-name"];
  }

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(): void {
    this.render();
  }

  private render(): void {
    const rawScore = this.getAttribute("score");
    const anchorName = this.getAttribute("anchor-name");
    const score = rawScore === null ? null : Number(rawScore);
    const isValid = score !== null && Number.isFinite(score) && score >= 0 && score <= 100;

    this.setAttribute("role", "status");

    if (!isValid) {
      this.setAttribute("aria-label", "Trust score unavailable");
      this.textContent = "Trust score unavailable";
      return;
    }

    const label = qualitativeLabel(score);
    const subject = anchorName ? `for ${anchorName}` : "";
    this.setAttribute(
      "aria-label",
      `Trust score ${subject}: ${score} out of 100 (${label})`.replace(/\s+/g, " ").trim(),
    );
    this.textContent = `${score}/100 · ${label}`;
  }
}

export function defineAnchorTrustBadge(registry: CustomElementRegistry = customElements): void {
  if (!registry.get("anchor-trust-badge")) {
    registry.define("anchor-trust-badge", AnchorTrustBadge);
  }
}
