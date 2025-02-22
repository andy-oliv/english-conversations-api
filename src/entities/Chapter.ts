interface Chapter {
  id?: number;
  title: string;
  description: string;
  mediaUrl?: string;
  duration: string;
  requiredChapterId?: number;
}

export default Chapter;
