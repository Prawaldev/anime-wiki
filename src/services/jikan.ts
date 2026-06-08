import axios from 'axios';

const JIKAN_URL = 'https://api.jikan.moe/v4';

const jikanApi = axios.create({
  baseURL: JIKAN_URL,
});

export interface Character {
  mal_id: number;
  url: string;
  images: {
    jpg: { image_url: string };
    webp: { image_url: string; small_image_url: string };
  };
  name: string;
  name_kanji: string;
  nicknames: string[];
  favorites: number;
  about: string;
  _source?: string;
}

export interface Anime {
  mal_id: number;
  url: string;
  images: {
    jpg: { image_url: string; large_image_url: string };
    webp: { image_url: string; large_image_url: string };
  };
  title: string;
  title_english: string;
  title_japanese: string;
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  studios: { mal_id: number; name: string }[];
  genres: { mal_id: number; name: string }[];
  _source?: string;
}

export interface CharacterAnimeAppearance {
  role: string;
  anime: {
    mal_id: number;
    url: string;
    images: {
      jpg: { image_url: string; small_image_url: string; large_image_url: string };
    };
    title: string;
  };
}

export interface VoiceActor {
  language: string;
  person: {
    mal_id: number;
    url: string;
    images: {
      jpg: { image_url: string };
    };
    name: string;
  };
}

export interface AnimeCharacter {
  role: string;
  character: {
    mal_id: number;
    url: string;
    images: {
      jpg: { image_url: string };
      webp: { image_url: string; small_image_url: string };
    };
    name: string;
  };
}

export interface Recommendation {
  entry: {
    mal_id: number;
    url: string;
    images: {
      jpg: { image_url: string; small_image_url: string; large_image_url: string };
    };
    title: string;
  };
}

export const jikan = {
  searchCharacters: async (query: string): Promise<Character[]> => {
    try {
      const response = await jikanApi.get('/characters', {
        params: { q: query, limit: 24, order_by: 'favorites', sort: 'desc' },
      });
      return (response.data?.data || []).map((c: any) => ({ ...c, _source: 'Jikan' }));
    } catch (error) {
      console.error('Error searching characters:', error);
      return [];
    }
  },
  searchAnime: async (query: string): Promise<Anime[]> => {
    try {
      const response = await jikanApi.get('/anime', {
        params: { q: query, limit: 24 },
      });
      return (response.data?.data || []).map((a: any) => ({ ...a, _source: 'Jikan' }));
    } catch (error) {
      console.error('Error searching anime:', error);
      return [];
    }
  },
  getCharacterById: async (id: number): Promise<Character | null> => {
    try {
      const response = await jikanApi.get<{ data: Character }>(`/characters/${id}/full`);
      return response.data?.data ? { ...response.data.data, _source: 'Jikan' } : null;
    } catch (error) {
      console.error(`Error fetching character ${id}:`, error);
      return null;
    }
  },
  getAnimeById: async (id: number): Promise<Anime | null> => {
    try {
      const response = await jikanApi.get<{ data: Anime }>(`/anime/${id}/full`);
      return response.data?.data ? { ...response.data.data, _source: 'Jikan' } : null;
    } catch (error) {
      console.error(`Error fetching anime ${id}:`, error);
      return null;
    }
  },
  getAnimeCharacters: async (id: number) => {
    try {
        const response = await jikanApi.get(`/anime/${id}/characters`);
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching characters:', error);
        return [];
    }
  },
  getAnimeRecommendations: async (id: number) => {
    try {
        const response = await jikanApi.get(`/anime/${id}/recommendations`);
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
  },
  getCharacterAnime: async (id: number) => {
    try {
        const response = await jikanApi.get(`/characters/${id}/anime`);
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching character anime:', error);
        return [];
    }
  },
  getCharacterVoiceActors: async (id: number) => {
    try {
        const response = await jikanApi.get(`/characters/${id}/voices`);
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching voice actors:', error);
        return [];
    }
  },
  getTopCharacters: async (page: number = 1): Promise<Character[]> => {
    try {
      const response = await jikanApi.get('/top/characters', { params: { page, limit: 24 } });
      return (response.data?.data || []).map((c: any) => ({ ...c, _source: 'Jikan' }));
    } catch (error) {
      console.error('Error fetching top characters:', error);
      return [];
    }
  },
  getTopAnime: async (page: number = 1): Promise<Anime[]> => {
    try {
      const response = await jikanApi.get('/top/anime', { params: { page, limit: 24 } });
      return (response.data?.data || []).map((a: any) => ({ ...a, _source: 'Jikan' }));
    } catch (error) {
      console.error('Error fetching top anime:', error);
      return [];
    }
  }
};

export const getAnimeById = jikan.getAnimeById;
export const getAnimeCharacters = jikan.getAnimeCharacters;
export const getAnimeRecommendations = jikan.getAnimeRecommendations;
export const getCharacterById = jikan.getCharacterById;
export const getCharacterAnime = jikan.getCharacterAnime;
export const getCharacterVoiceActors = jikan.getCharacterVoiceActors;
export const getTopAnime = jikan.getTopAnime;
export const getTopCharacters = jikan.getTopCharacters;
export const searchAnime = jikan.searchAnime;
export const searchCharacters = jikan.searchCharacters;
