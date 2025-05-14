declare module "youtube-transcript-api" {
  interface TranscriptItem {
    text: string;
    offset: number;
    duration: number;
    start: number;
  }

  const TranscriptAPI: {
    getTranscript(videoId: string, options?: { lang?: string }): Promise<TranscriptItem[]>;
  };

  export default TranscriptAPI;
}
