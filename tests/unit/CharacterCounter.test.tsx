import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CharacterCounter } from "@/components/shared/CharacterCounter";

describe("CharacterCounter", () => {
  it("should display current and max character count", () => {
    const currentLength = 5;
    const maxLength = 100;

    render(<CharacterCounter currentLength={currentLength} maxLength={maxLength} />);

    expect(screen.getByText(`${currentLength}/${maxLength}`)).toBeInTheDocument();
  });

  it("should use default styling when character count is less than 80% of max", () => {
    const currentLength = 50;
    const maxLength = 100;

    const { container } = render(<CharacterCounter currentLength={currentLength} maxLength={maxLength} />);
    const counterElement = container.firstChild as HTMLElement;

    expect(counterElement).toHaveClass("text-muted-foreground");
    expect(counterElement).not.toHaveClass("text-yellow-500");
    expect(counterElement).not.toHaveClass("text-destructive");
  });

  it("should use yellow styling when character count is between 80% and 100% of max", () => {
    const maxLength = 100;
    const currentLength = 85;

    const { container } = render(<CharacterCounter currentLength={currentLength} maxLength={maxLength} />);
    const counterElement = container.firstChild as HTMLElement;

    expect(counterElement).toHaveClass("text-yellow-500");
    expect(counterElement).not.toHaveClass("text-muted-foreground");
    expect(counterElement).not.toHaveClass("text-destructive");
  });

  it("should use destructive styling when character count exceeds max length", () => {
    const maxLength = 100;
    const currentLength = 110;

    const { container } = render(<CharacterCounter currentLength={currentLength} maxLength={maxLength} />);
    const counterElement = container.firstChild as HTMLElement;

    expect(counterElement).toHaveClass("text-destructive");
    expect(counterElement).not.toHaveClass("text-muted-foreground");
    expect(counterElement).not.toHaveClass("text-yellow-500");
  });

  it("should apply correct classes at exact boundaries", () => {
    const maxLength = 100;

    const { container: container80 } = render(<CharacterCounter currentLength={80} maxLength={maxLength} />);
    expect(container80.firstChild).toHaveClass("text-muted-foreground");

    const { container: container81 } = render(<CharacterCounter currentLength={81} maxLength={maxLength} />);
    expect(container81.firstChild).toHaveClass("text-yellow-500");

    const { container: containerMax } = render(<CharacterCounter currentLength={maxLength} maxLength={maxLength} />);
    expect(containerMax.firstChild).toHaveClass("text-yellow-500");

    const { container: containerOver } = render(
      <CharacterCounter currentLength={maxLength + 1} maxLength={maxLength} />
    );
    expect(containerOver.firstChild).toHaveClass("text-destructive");
  });
});
