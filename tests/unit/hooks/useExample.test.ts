import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useState } from "react";

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

describe("useCounter", () => {
  it("should return the current value and functions", () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current.count).toBe(10);
    expect(typeof result.current.increment).toBe("function");
    expect(typeof result.current.decrement).toBe("function");
    expect(typeof result.current.reset).toBe("function");
  });

  it("should increment the counter", () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(11);
  });

  it("should decrement the counter", () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(9);
  });

  it("should reset the counter", () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(11);

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(10);
  });
});
