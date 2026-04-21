export type PostCategory = 'ordinary' | 'nightmare' | 'anxiety' | 'erotic' | 'archetypal';

export interface IPost {
  id: number;
  author: number;
  author_username: string;
  author_is_private: boolean;
  title: string;
  content: string;
  category: PostCategory;
  hashtag_names: string[];
  created_at: string;
  is_liked: boolean;
  is_bookmarked: boolean;
  likes_count: number;
}
