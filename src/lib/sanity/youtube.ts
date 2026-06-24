export type YoutubeEpisode = {
  videoId: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  duration: string | null;
  position: number;
};

type PlaylistItemSnippet = {
  title: string;
  publishedAt: string;
  position: number;
  thumbnails: { high?: { url: string }; medium?: { url: string } };
  resourceId: { videoId: string };
};

type PlaylistItemsResponse = {
  items?: Array<{ snippet: PlaylistItemSnippet; contentDetails?: { videoId: string } }>;
  nextPageToken?: string;
};

type VideoDetailsResponse = {
  items?: Array<{ id: string; contentDetails: { duration: string } }>;
};

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";
  const h = Number(match[1] ?? 0);
  const m = Number(match[2] ?? 0);
  const s = Number(match[3] ?? 0);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export async function fetchPlaylistEpisodes(playlistId: string): Promise<YoutubeEpisode[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  try {
    const items: PlaylistItemsResponse["items"] = [];
    let pageToken: string | undefined;

    do {
      const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      url.searchParams.set("part", "snippet");
      url.searchParams.set("playlistId", playlistId);
      url.searchParams.set("maxResults", "50");
      url.searchParams.set("key", apiKey);
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
      if (!res.ok) return [];

      const data: PlaylistItemsResponse = await res.json();
      if (data.items) items.push(...data.items);
      pageToken = data.nextPageToken;
    } while (pageToken);

    if (items.length === 0) return [];

    // Fetch durations in batches of 50
    const videoIds = items.map((i) => i.snippet.resourceId.videoId);
    const durationsMap: Record<string, string> = {};

    for (let i = 0; i < videoIds.length; i += 50) {
      const batch = videoIds.slice(i, i + 50).join(",");
      const dUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
      dUrl.searchParams.set("part", "contentDetails");
      dUrl.searchParams.set("id", batch);
      dUrl.searchParams.set("key", apiKey);

      const dRes = await fetch(dUrl.toString(), { next: { revalidate: 86400 } });
      if (dRes.ok) {
        const dData: VideoDetailsResponse = await dRes.json();
        for (const v of dData.items ?? []) {
          durationsMap[v.id] = parseDuration(v.contentDetails.duration);
        }
      }
    }

    return items
      .sort((a, b) => a.snippet.position - b.snippet.position)
      .map((item, idx) => {
        const snippet = item.snippet;
        const videoId = snippet.resourceId.videoId;
        return {
          videoId,
          title: snippet.title,
          publishedAt: snippet.publishedAt,
          thumbnail:
            snippet.thumbnails.high?.url ??
            snippet.thumbnails.medium?.url ??
            `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          duration: durationsMap[videoId] ?? null,
          position: idx + 1,
        };
      });
  } catch {
    return [];
  }
}
