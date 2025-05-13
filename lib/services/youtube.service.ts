import { YoutubeTranscript } from "youtube-transcript";
import { getSubtitles } from "youtube-captions-scraper";
import { XMLParser } from "fast-xml-parser";

type ParsedTextNode = {
  _text?: string;
};

export class YoutubeService {
  async transcriptWithCaptionsScraper(url: string): Promise<string> {
    const videoId = this.extractVideoId(url);

    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    const subtitles = await getSubtitles({
      videoID: videoId,
      lang: "en",
    });
    const text = subtitles.map((s) => s.text).join(" ");

    return this.cleanTranscript(text).slice(0, 15000);
  }

  async transcriptWithYoutubeTranscript(url: string): Promise<string> {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    const text = transcript.map((t) => t.text).join(" ");

    return this.cleanTranscript(text).slice(0, 15000);
  }

  async transcriptWithScraper(url: string): Promise<string> {
    const videoId = this.extractVideoId(url);

    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }
    const videoUrl = `https://youtube.com/watch?v=${videoId}`;

    try {
      const res = await fetch(videoUrl);
      const pageSource = await res.text();
      const playerResponseMatch = pageSource.match(/var ytInitialPlayerResponse = (.*?);<\/script>/);

      if (!playerResponseMatch) throw new Error("Player response not found");

      const playerResponse = JSON.parse(playerResponseMatch[1]);
      const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

      if (!captionTracks || captionTracks.length === 0) throw new Error("No captions available");

      const transcriptUrl = captionTracks[0].baseUrl;

      const transcriptRes = await fetch(transcriptUrl);
      const transcriptXml = await transcriptRes.text();
      const parser = new XMLParser({ ignoreAttributes: false, textNodeName: "_text" });
      const parsedXml = parser.parse(transcriptXml);

      let transcriptText = "";
      if (parsedXml.transcript && Array.isArray(parsedXml.transcript.text)) {
        transcriptText = parsedXml.transcript.text
          .map((t: string | ParsedTextNode) => {
            if (typeof t === "string") {
              return t;
            } else if (t && typeof t._text === "string") {
              return t._text;
            }
            return "";
          })
          .join(" ")
          .replace(/&#39;/g, "'");
      } else if (
        parsedXml.transcript &&
        parsedXml.transcript.text &&
        typeof parsedXml.transcript.text._text === "string"
      ) {
        transcriptText = parsedXml.transcript.text._text.replace(/&#39;/g, "'");
      } else if (parsedXml.transcript && typeof parsedXml.transcript.text === "string") {
        transcriptText = parsedXml.transcript.text.replace(/&#39;/g, "'");
      } else {
        const textElements = transcriptXml.matchAll(/<text[^>]*>(.*?)<\/text>/gi);
        transcriptText = Array.from(textElements, (m) => m[1])
          .map((text) => text.replace(/&#39;/g, "'").replace(/<[^>]+>/g, ""))
          .join(" ");
      }

      return this.cleanTranscript(transcriptText).slice(0, 15000);
    } catch (error) {
      console.error("Error in transcriptWithScraper:", error);
      throw error;
    }
  }

  extractVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  cleanTranscript(text: string): string {
    return text
      .replace(/\[\w+\]/g, "") // Remove [MUSIC], [APPLAUSE], etc.
      .replace(/\d{2}:\d{2}/g, "") // Remove timestamps
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();
  }
}
