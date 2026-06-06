import axios from 'axios';

const BASE_URL = 'https://api.jikan.moe/v4';

const api = axios.create({
  baseURL: BASE_URL,
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
}

export interface CharacterSearchResponse {
  data: Character[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export const searchCharacters = async (query: string): Promise<Character[]> => {
  try {
    const response = await api.get<CharacterSearchResponse>(`/characters`, {
      params: { q: query, limit: 10, order_by: 'favorites', sort: 'desc' },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching characters:', error);
    return [];
  }
};

export const getCharacterById = async (id: number): Promise<Character | null> => {
  try {
    const response = await api.get<{ data: Character }>(`/characters/${id}/full`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching character ${id}:`, error);
    return null;
  }
};

export const getCharacterAnime = async (id: number) => {
  try {
    const response = await api.get(`/characters/${id}/anime`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching character anime ${id}:`, error);
    return [];
  }
};
