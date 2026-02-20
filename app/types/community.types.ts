export type CategoryType = 'ofertas' | 'vecinos' | 'otros';

export interface PostComment {
    id: string;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
    likes: number;
    replies?: PostComment[];
    isLikedByCurrentUser?: boolean; 
    rawReactions?: { user: { id: string }, type: string }[];
    authorId?: string;
}

export interface Post {
    id: string;
    author: string;
    authorAvatar: string;
    timestamp: string;
    category: CategoryType;
    content: string;
    image?: string;
    likes: number;
    comments: PostComment[];
    isLikedByCurrentUser?: boolean;
    rawReactions?: { user: { id: string }, type: string }[];
}

// Backend Types for mapping
export interface BackendUser {
    id: string;
    nombre: string;
    image: {
        url: string;
        id: string;
    };
}

export interface BackendReaction {
    user: BackendUser;
    type: string;
}

export interface BackendComment {
    _id: string;
    usuario: BackendUser;
    texto: string;
    fecha: string;
    reactions: BackendReaction[];
    respuestas: BackendComment[];
}

export interface BackendPost {
    _id: string;
    ubicacion: {
        type: 'Point';
        coordinates: number[];
    };
    contenido: string;
    usuario: BackendUser;
    imagen?: {
        url: string;
        id: string;
    };
    categoria: string;
    comentarios: BackendComment[];
    reactions: BackendReaction[];
    createdAt: string;
    updatedAt: string;
}
