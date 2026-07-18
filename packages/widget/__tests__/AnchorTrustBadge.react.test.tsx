import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnchorTrustBadge } from "../src/react";

function getBadge(container: HTMLElement) {
  const badge = container.querySelector("anchor-trust-badge");

  if (!badge) {
    throw new Error("Expected anchor-trust-badge to be rendered");
  }

  return badge;
}

describe("<AnchorTrustBadge />", () => {
  it("renders the underlying custom element with the provided props", () => {
    const { container } = render(
      <AnchorTrustBadge
        score={85}
        anchorName="Test Anchor Co"
        className="trust-badge"
      />
    );

    const badge = getBadge(container);

    expect(badge.tagName.toLowerCase()).toBe("anchor-trust-badge");
    expect(badge.getAttribute("score")).toBe("85");
    expect(badge.getAttribute("anchor-name")).toBe("Test Anchor Co");
    expect(badge.getAttribute("class")).toBe("trust-badge");
  });

  it("renders without an anchor name", () => {
    const { container } = render(<AnchorTrustBadge score={42} />);

    const badge = getBadge(container);

    expect(badge.tagName.toLowerCase()).toBe("anchor-trust-badge");
    expect(badge.getAttribute("score")).toBe("42");
    expect(badge.hasAttribute("anchor-name")).toBe(false);
  });
});