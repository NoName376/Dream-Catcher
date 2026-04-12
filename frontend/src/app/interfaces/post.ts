export interface IPost {
  id: number;
  author: number;
  authorUsername: string;
  content: string;
  hashtagNames: string[];
  createdAt: string;
  isLiked: boolean;
  isBookmarked: boolean;
  likesCount: number;
}
