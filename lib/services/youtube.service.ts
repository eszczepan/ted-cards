import { YoutubeTranscript } from "youtube-transcript";
import { getSubtitles } from "youtube-captions-scraper";
import TranscriptAPI from "youtube-transcript-api";
import { YtTranscript } from "yt-transcript";
import { fetchTranscript as fetchTranscriptPlus } from "youtube-transcript-plus";
import { XMLParser } from "fast-xml-parser";

type ParsedTextNode = {
  _text?: string;
};

export class YoutubeService {
  async getTranscript(url: string): Promise<string> {
    let transcript = "";
    const methods = [
      // this.transcriptWithScraper.bind(this),
      // this.transcriptWithCaptionsScraper.bind(this),
      // this.transcriptWithYoutubeTranscript.bind(this),
      // this.transcriptWithYtTranscript.bind(this),
      // this.transcriptWithYoutubeTranscriptApi.bind(this),
      this.transcriptWithYoutubeTranscriptPlus.bind(this),
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

  async transcriptWithYoutubeTranscriptPlus(url: string): Promise<string> {
    try {
      const videoId = this.extractVideoId(url);

      if (!videoId) {
        throw new Error("Invalid YouTube URL");
      }

      // Próba pobrania transkrypcji bez proxy
      try {
        const transcript = await fetchTranscriptPlus(videoId, {
          disableHttps: true,
        });

        console.log("Transcript retrieved successfully");
        const text = transcript.map((t) => t.text).join(" ");
        const cleanedText = this.cleanTranscript(text).slice(0, 15000);
        return cleanedText;
      } catch (error) {
        console.error("Error getting transcript without proxy:", error);

        // Jeśli nie udało się bez proxy, próbujemy z proxy
        const proxy = await this.getProxy();
        console.log("Using proxy:", proxy);

        const transcript = await fetchTranscriptPlus(videoId, {
          disableHttps: true,
          transcriptFetch: async ({ url: transcriptUrl, lang, userAgent }) => {
            console.log("Fetching transcript from:", transcriptUrl);
            return fetch(transcriptUrl, {
              headers: {
                ...(lang && { "Accept-Language": lang }),
                "User-Agent": userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
              },
            });
          },
        });

        const text = transcript.map((t) => t.text).join(" ");
        const cleanedText = this.cleanTranscript(text).slice(0, 15000);
        return cleanedText;
      }
    } catch (error) {
      console.error("Error in transcriptWithYoutubeTranscriptPlus:", error);
      throw error;
    }
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
    const cleanedText = this.cleanTranscript(text).slice(0, 15000);

    return cleanedText;
  }

  async transcriptWithYoutubeTranscript(url: string): Promise<string> {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    const text = transcript.map((t) => t.text).join(" ");
    const cleanedText = this.cleanTranscript(text).slice(0, 15000);

    return cleanedText;
  }

  async transcriptWithYtTranscript(url: string): Promise<string> {
    const transcript = new YtTranscript({ url });
    const transcriptText = await transcript.getTranscript("en");

    if (!transcriptText) {
      throw new Error("Failed to get transcript from YtTranscript");
    }

    const cleanedText = this.cleanTranscript(transcriptText.map((t) => t.text).join(" ")).slice(0, 15000);

    return cleanedText;
  }

  async transcriptWithYoutubeTranscriptApi(url: string): Promise<string> {
    const videoId = this.extractVideoId(url);

    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    const transcript = await TranscriptAPI.getTranscript(videoId);
    const text = transcript.map((t: { text: string }) => t.text).join(" ");
    const cleanedText = this.cleanTranscript(text).slice(0, 15000);

    return cleanedText;
  }

  async transcriptWithScraper(url: string): Promise<string> {
    try {
      const res = await fetch(url);
      const pageSource = await res.text();
      const captionUrlMatch = pageSource.match(/"captionTracks":\[{.*?"baseUrl":"(.*?)"/);
      const transcriptUrl = captionUrlMatch ? captionUrlMatch[1].replace(/\\u0026/g, "&") : null;

      if (!transcriptUrl) {
        throw new Error("Could not find transcript URL using any method");
      }

      const transcriptRes = await fetch(transcriptUrl);
      const transcriptXml = await transcriptRes.text();
      const parser = new XMLParser({ ignoreAttributes: false, textNodeName: "_text" });
      const parsedXml = parser.parse(transcriptXml);

      const transcriptText = parsedXml.transcript.text
        .map((t: string | ParsedTextNode) => {
          if (typeof t === "string") return t;
          if (t && typeof t._text === "string") return t._text;
          return "";
        })
        .join(" ");

      const cleanedText = this.cleanTranscript(transcriptText).slice(0, 15000);
      return cleanedText;
    } catch (error) {
      console.error("Error in transcriptWithScraper:", error);
      throw error;
    }
  }

  private extractVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  private cleanTranscript(text: string): string {
    return text
      .replace(/\[\w+\]/g, "") // Remove [MUSIC], [APPLAUSE], etc.
      .replace(/\d{2}:\d{2}/g, "") // Remove timestamps
      .replace(/\n+/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/&#39;s/g, "'s") // Replace &#39;s with 's
      .trim();
  }

  private async getProxy(): Promise<string> {
    try {
      const proxyList = await fetch(
        "https://proxylist.geonode.com/api/proxy-list?protocols=http&speed=fast&limit=500&page=1&sort_by=lastChecked&sort_type=desc"
      );
      const proxyListJson = await proxyList.json();

      // Upewnij się, że mamy dostęp do danych proxy
      if (!proxyListJson?.data || !Array.isArray(proxyListJson.data) || proxyListJson.data.length === 0) {
        throw new Error("No proxy data available");
      }

      // Definiowanie typu dla danych proxy
      interface ProxyData {
        ip: string;
        port: string | number;
      }

      // Formatujemy poprawnie proxy - potrzebujemy IP i port
      const proxies = proxyListJson.data
        .filter((p: ProxyData) => p && p.ip && p.port)
        .map((p: ProxyData) => `http://${p.ip}:${p.port}`);

      if (proxies.length === 0) {
        throw new Error("No valid proxies found");
      }

      const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
      return randomProxy;
    } catch (error) {
      console.error("Error getting proxy:", error);
      // Fallback to default proxy if available
      return "http://localhost:8080";
    }
  }
}
