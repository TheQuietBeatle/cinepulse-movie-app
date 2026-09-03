export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isGuest?: boolean;
  createdAt?: number;
}

export interface FavoriteMovie {
  imdbID: string;
  title: string;
  year: string;
  type: string;
  poster: string;
  imdbRating?: string;
  genre?: string;
  plot?: string;
  addedAt: number;
}
