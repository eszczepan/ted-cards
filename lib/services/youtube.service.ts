import { YoutubeTranscript } from "youtube-transcript";
import { getSubtitles } from "youtube-captions-scraper";
import TranscriptAPI from "youtube-transcript-api";
import { XMLParser } from "fast-xml-parser";

type ParsedTextNode = {
  _text?: string;
};

export class YoutubeService {
  async getTranscript(url: string): Promise<string> {
    let transcript = "";
    const methods = [
      // this.transcriptWithCaptionsScraper.bind(this),
      // this.transcriptWithYoutubeTranscript.bind(this),
      this.transcriptWithScraper.bind(this),
      // this.transcriptWithYoutubeTranscriptApi.bind(this),
    ];

    for (const method of methods) {
      try {
        transcript = await method(url);
        if (transcript.length > 0) {
          break;
        }
      } catch (error) {
        console.error(`Method ${method.name} failed:`, error);
      }
    }

    if (transcript.length === 0) {
      throw new Error(`Failed to get transcript from all available ${methods.length} methods`);
    }

    return transcript;
  }

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

  async transcriptWithYoutubeTranscriptApi(url: string): Promise<string> {
    const videoId = this.extractVideoId(url);

    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    const transcript = await TranscriptAPI.getTranscript(videoId);
    const text = transcript.map((t: { text: string }) => t.text).join(" ");

    return this.cleanTranscript(text).slice(0, 15000);
  }

  async transcriptWithScraper(url: string): Promise<string> {
    const videoId = this.extractVideoId(url);

    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }
    const videoUrl = `https://youtube.com/watch?v=${videoId}`;

    try {
      const res = await fetch(videoUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          Referer: "https://www.youtube.com/",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "same-origin",
          "Cache-Control": "max-age=0",
        },
        credentials: "omit",
      });

      const pageSource = await res.text();

      const playerResponseRegex = /ytInitialPlayerResponse\s*=\s*({.+?})(?=;)/;
      const playerResponseMatch = pageSource.match(playerResponseRegex);

      console.log("playerResponseMatch:", playerResponseMatch);

      if (!playerResponseMatch || !playerResponseMatch[1]) {
        throw new Error("Player response not found");
      }

      try {
        console.log("First element of playerResponseMatch:", playerResponseMatch[1]);
        const playerResponse = JSON.parse(playerResponseMatch[1]);
        console.log("playerResponse:", playerResponse);
        const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        console.log("captionTracks:", captionTracks);

        if (!captionTracks || captionTracks.length === 0) {
          throw new Error("No captions available");
        }

        const transcriptUrl = captionTracks[0].baseUrl;

        const transcriptRes = await fetch(transcriptUrl);
        const transcriptXml = await transcriptRes.text();
        console.log("transcriptXml:", transcriptXml);
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
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);

        // Alternative way to get the transcript URL
        const captionUrlMatch = pageSource.match(/"captionTracks":\[{.*?"baseUrl":"(.*?)"/);
        if (!captionUrlMatch || !captionUrlMatch[1]) {
          throw new Error("Caption URL not found in alternative method");
        }

        const transcriptUrl = captionUrlMatch[1].replace(/\\u0026/g, "&");
        const transcriptRes = await fetch(transcriptUrl);
        const transcriptXml = await transcriptRes.text();

        // Simple text extraction from XML
        const textElements = transcriptXml.matchAll(/<text[^>]*>(.*?)<\/text>/gi);
        const transcriptText = Array.from(textElements, (m) => m[1])
          .map((text) => text.replace(/&#39;/g, "'").replace(/<[^>]+>/g, ""))
          .join(" ");

        return this.cleanTranscript(transcriptText).slice(0, 15000);
      }
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
