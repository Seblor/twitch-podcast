export const useQueue = () => useState<{
  isOpen: boolean;
  downloads: DownloadItem[];
}>('queue', () => ({
  isOpen: false,
  downloads: []
}))

export type DownloadItem = {
  id: string;
  date: number;
  title: string;
  description: string;
  progress: number | null;
  eta: string;
}
