import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useDashboard } from "@/components/hooks/useDashboard";
import { FLASHCARD_PROPOSAL_STATUS, SOURCE_TYPE, CEFR_LEVEL, FLASHCARD_SOURCE } from "@/types";

global.fetch = vi.fn();

const mockGenerationCommand = {
  source_type: SOURCE_TYPE.YOUTUBE,
  front_language: "en",
  back_language: "pl",
  source_youtube_url: "https://www.youtube.com/watch?v=testVideo",
  source_text: "",
};

const mockGenerationResponse = {
  id: "gen-123",
  flashcard_proposals: [
    {
      id: "prop-1",
      front_content: "Front 1",
      back_content: "Back 1",
      front_language: "en",
      back_language: "pl",
      cefr_level: CEFR_LEVEL.B1,
      source: FLASHCARD_SOURCE.AI_YOUTUBE_FULL,
      source_youtube_url: "https://www.youtube.com/watch?v=testVideo",
      status: FLASHCARD_PROPOSAL_STATUS.ACCEPTED,
    },
    {
      id: "prop-2",
      front_content: "Front 2",
      back_content: "Back 2",
      front_language: "en",
      back_language: "pl",
      cefr_level: CEFR_LEVEL.A2,
      source: FLASHCARD_SOURCE.AI_YOUTUBE_FULL,
      source_youtube_url: "https://www.youtube.com/watch?v=testVideo",
      status: FLASHCARD_PROPOSAL_STATUS.ACCEPTED,
    },
  ],
};

describe("useDashboard", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should return the correct initial state", () => {
      const { result } = renderHook(() => useDashboard());

      expect(result.current.generationState).toBe("idle");
      expect(result.current.saveState).toBe("idle");
      expect(result.current.generationError).toBeNull();
      expect(result.current.saveError).toBeNull();
      expect(result.current.proposals).toEqual([]);
      expect(result.current.generationId).toBeNull();
      expect(result.current.selectedSourceType).toBe(SOURCE_TYPE.YOUTUBE);
    });
  });

  describe("handleGenerateSubmit", () => {
    it("should handle successful flashcard generation", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockGenerationResponse),
      });

      const { result } = renderHook(() => useDashboard());

      await act(async () => {
        await result.current.handleGenerateSubmit(mockGenerationCommand);
      });

      expect(result.current.generationState).toBe("success");
      expect(result.current.proposals).toEqual(mockGenerationResponse.flashcard_proposals);
      expect(result.current.generationId).toBe("gen-123");
      expect(global.fetch).toHaveBeenCalledWith("/api/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockGenerationCommand),
      });
    });

    it("should handle errors during flashcard generation", async () => {
      const errorMessage = "API error message";
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValueOnce({ error: errorMessage }),
      });

      const { result } = renderHook(() => useDashboard());

      await act(async () => {
        await result.current.handleGenerateSubmit(mockGenerationCommand);
      });

      expect(result.current.generationState).toBe("error");
      expect(result.current.generationError).toBe(errorMessage);
      expect(result.current.proposals).toEqual([]);
    });

    it("should not trigger generation if one is already in progress", async () => {
      global.fetch = vi.fn().mockImplementationOnce(() => new Promise(() => {}));

      const { result } = renderHook(() => useDashboard());

      act(() => {
        result.current.handleGenerateSubmit(mockGenerationCommand);
      });

      expect(result.current.generationState).toBe("loading");

      vi.resetAllMocks();

      await act(async () => {
        await result.current.handleGenerateSubmit(mockGenerationCommand);
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe("handleUpdateProposal", () => {
    it("should update a single proposal", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockGenerationResponse),
      });

      const { result } = renderHook(() => useDashboard());

      await act(async () => {
        await result.current.handleGenerateSubmit(mockGenerationCommand);
      });

      const updatedProposal = {
        ...mockGenerationResponse.flashcard_proposals[0],
        status: FLASHCARD_PROPOSAL_STATUS.EDITED,
        front_content: "Edited Front",
        back_content: "Edited Back",
      };

      act(() => {
        result.current.handleUpdateProposal(updatedProposal);
      });

      expect(result.current.proposals[0]).toEqual(updatedProposal);
      expect(result.current.proposals[1]).toEqual(mockGenerationResponse.flashcard_proposals[1]);
    });
  });

  describe("handleSaveAccepted", () => {
    it("should save only accepted and edited proposals", async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValueOnce(mockGenerationResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValueOnce({}),
        });

      const { result } = renderHook(() => useDashboard());

      await act(async () => {
        await result.current.handleGenerateSubmit(mockGenerationCommand);
      });

      const rejectedProposal = {
        ...mockGenerationResponse.flashcard_proposals[1],
        status: FLASHCARD_PROPOSAL_STATUS.REJECTED,
      };

      act(() => {
        result.current.handleUpdateProposal(rejectedProposal);
      });

      await act(async () => {
        await result.current.handleSaveAccepted();
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenLastCalledWith("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcards: [
            {
              front_content: "Front 1",
              back_content: "Back 1",
              front_language: "en",
              back_language: "pl",
              cefr_level: CEFR_LEVEL.B1,
              source: FLASHCARD_SOURCE.AI_YOUTUBE_FULL,
              source_youtube_url: "https://www.youtube.com/watch?v=testVideo",
            },
          ],
          generation_id: "gen-123",
        }),
      });

      expect(result.current.proposals.length).toBe(1);
      expect(result.current.proposals[0].status).toBe(FLASHCARD_PROPOSAL_STATUS.REJECTED);
    });

    it("should not call API when there are no accepted proposals", async () => {
      const { result } = renderHook(() => useDashboard());

      await act(async () => {
        await result.current.handleSaveAccepted();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should handle errors during saving", async () => {
      const errorMessage = "Failed to save flashcards";

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValueOnce(mockGenerationResponse),
        })
        .mockResolvedValueOnce({
          ok: false,
          json: vi.fn().mockResolvedValueOnce({ message: errorMessage }),
        });

      const { result } = renderHook(() => useDashboard());

      await act(async () => {
        await result.current.handleGenerateSubmit(mockGenerationCommand);
      });

      await act(async () => {
        await result.current.handleSaveAccepted();
      });

      expect(result.current.saveState).toBe("error");
      expect(result.current.saveError).toBe(errorMessage);
      expect(result.current.proposals).toEqual(mockGenerationResponse.flashcard_proposals);
    });
  });

  describe("handleSaveAll", () => {
    it("should save all non-rejected proposals", async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValueOnce(mockGenerationResponse),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValueOnce({}),
        });

      const { result } = renderHook(() => useDashboard());

      await act(async () => {
        await result.current.handleGenerateSubmit(mockGenerationCommand);
      });

      const rejectedProposal = {
        ...mockGenerationResponse.flashcard_proposals[1],
        status: FLASHCARD_PROPOSAL_STATUS.REJECTED,
      };

      act(() => {
        result.current.handleUpdateProposal(rejectedProposal);
      });

      await act(async () => {
        await result.current.handleSaveAll();
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenLastCalledWith("/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcards: [
            {
              front_content: "Front 1",
              back_content: "Back 1",
              front_language: "en",
              back_language: "pl",
              cefr_level: CEFR_LEVEL.B1,
              source: FLASHCARD_SOURCE.AI_YOUTUBE_FULL,
              source_youtube_url: "https://www.youtube.com/watch?v=testVideo",
            },
          ],
          generation_id: "gen-123",
        }),
      });

      expect(result.current.proposals).toEqual([]);
    });

    it("should not call API when all proposals are rejected", async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockGenerationResponse),
      });

      const { result } = renderHook(() => useDashboard());

      await act(async () => {
        await result.current.handleGenerateSubmit(mockGenerationCommand);
      });

      await act(async () => {
        result.current.proposals.forEach((proposal) => {
          result.current.handleUpdateProposal({
            ...proposal,
            status: FLASHCARD_PROPOSAL_STATUS.REJECTED,
          });
        });
      });

      vi.resetAllMocks();

      await act(async () => {
        await result.current.handleSaveAll();
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});
