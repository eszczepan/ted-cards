import { YoutubeTranscript } from "youtube-transcript";
import { getSubtitles } from "youtube-captions-scraper";

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
