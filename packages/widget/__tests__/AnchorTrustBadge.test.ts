import { beforeEach, describe, expect, it } from "vitest";
import { defineAnchorTrustBadge, qualitativeLabel } from "../src/AnchorTrustBadge.js";

describe("qualitativeLabel", () => {
  it("bands scores into Excellent/Good/Fair/Low", () => {
    expect(qualitativeLabel(100)).toBe("Excellent");
    expect(qualitativeLabel(80)).toBe("Excellent");
    expect(qualitativeLabel(79)).toBe("Good");
    expect(qualitativeLabel(60)).toBe("Good");
    expect(qualitativeLabel(59)).toBe("Fair");
    expect(qualitativeLabel(40)).toBe("Fair");
    expect(qualitativeLabel(39)).toBe("Low");
    expect(qualitativeLabel(0)).toBe("Low");
  });
});

describe("<anchor-trust-badge>", () => {
  beforeEach(() => {
    defineAnchorTrustBadge();
    document.body.innerHTML = "";
  });

  it("renders an accessible status role with a descriptive label", () => {
    const el = document.createElement("anchor-trust-badge");
    el.setAttribute("score", "85");
    el.setAttribute("anchor-name", "Test Anchor Co");
    document.body.appendChild(el);

    expect(el.getAttribute("role")).toBe("status");
    expect(el.getAttribute("aria-label")).toBe(
      "Trust score for Test Anchor Co: 85 out of 100 (Excellent)",
    );
    expect(el.textContent).toBe("85/100 · Excellent");
  });

  it("omits the anchor name from the label when not provided", () => {
    const el = document.createElement("anchor-trust-badge");
    el.setAttribute("score", "50");
    document.body.appendChild(el);

    expect(el.getAttribute("aria-label")).toBe("Trust score : 50 out of 100 (Fair)".replace(/\s+/g, " ").trim());
  });

  it("re-renders when the score attribute changes", () => {
    const el = document.createElement("anchor-trust-badge");
    el.setAttribute("score", "30");
    document.body.appendChild(el);
    expect(el.textContent).toBe("30/100 · Low");

    el.setAttribute("score", "90");
    expect(el.textContent).toBe("90/100 · Excellent");
  });

  it("shows an accessible unavailable state for a missing or invalid score", () => {
    const el = document.createElement("anchor-trust-badge");
    document.body.appendChild(el);
    expect(el.getAttribute("aria-label")).toBe("Trust score unavailable");

    el.setAttribute("score", "not-a-number");
    expect(el.getAttribute("aria-label")).toBe("Trust score unavailable");

    el.setAttribute("score", "150");
    expect(el.getAttribute("aria-label")).toBe("Trust score unavailable");
  });

  it("registering the element twice does not throw", () => {
    expect(() => {
      defineAnchorTrustBadge();
      defineAnchorTrustBadge();
    }).not.toThrow();
  });
});
