import { defineStore } from 'pinia';
import { useUbicacionNegocios } from '@/store/ubicacion.store';
import { useAuthStore } from '@/stores/auth.store';
import type {
  Post,
  BackendPost,
  PostComment,
  BackendComment,
} from '@/types/community.types';

// const DEFAULT_SEARCH_RADIUS = 5000; // 5km default -- REMOVED, using store

export const useCommunityStore = defineStore('community', {
  state: () => ({
    posts: [] as Post[],
    loading: false,
    error: null as string | null,
    lastUpdate: 0,
    lastLocation: null as { lat: number; lng: number } | null,
    lastRadius: null as number | null,
    page: 1,
    hasMore: true,
    // My Posts State
    myPosts: [] as Post[],
    pageMyPosts: 1,
    hasMoreMyPosts: true,
    // My Comments State
    myComments: [] as any[], // Using any to avoid strict type issues for now, or need to define MyComment type
    pageMyComments: 1,
    hasMoreMyComments: true,
    currentPost: null as Post | null,
  }),

  actions: {
    async fetchPosts(lat: number, lng: number, force = false, targetPage = 1) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      const ubicacionStore = useUbicacionNegocios(); // Access location store for search radius

      const now = Date.now();
      const expiration = 2 * 60 * 1000; // 2 minutes

      // Check cache validity (simplified logic)
      if (
        !force &&
        targetPage === this.page &&
        this.posts.length > 0 &&
        now - this.lastUpdate < expiration &&
        this.lastLocation?.lat === lat &&
        this.lastLocation?.lng === lng
      ) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const dist = ubicacionStore.filtros.radius || 3000;
        const url = `${API_BASE}/comunidad/feed?lat=${lat}&lng=${lng}&dist=${dist}&page=${targetPage}`;

        const response: any = await $fetch(url);

        let rawPosts: BackendPost[] = [];
        let meta = { total: 0, page: 1, lastPage: 1 };

        if (response && Array.isArray(response.data)) {
          rawPosts = response.data;
          meta = response.meta || meta;
        } else if (Array.isArray(response)) {
          rawPosts = response;
        }

        const authStore = useAuthStore();
        const mappedPosts: Post[] = rawPosts.map((bp) => ({
          id: bp._id,
          author: bp.usuario.nombre,
          authorAvatar:
            bp.usuario.image?.url ||
            `https://ui-avatars.com/api/?name=${bp.usuario.nombre}&background=random`,
          timestamp: bp.createdAt,
          category: (bp.categoria || 'otros').toLowerCase() as any,
          content: bp.contenido,
          image: bp.imagen?.url,
          likes: bp.reactions ? bp.reactions.length : 0,
          comments: bp.comentarios
            ? bp.comentarios.map((c) => this.mapComment(c))
            : [],
          rawReactions: bp.reactions || [],
          isLikedByCurrentUser: bp.reactions
            ? bp.reactions.some((r) => {
                const rId = r.user.id || (r.user as any)._id;
                return rId === authStore.user?.uid;
              })
            : false,
        }));

        if (targetPage === 1) {
          this.posts = mappedPosts;
        } else {
          // Append and deduplicate
          const existingIds = new Set(this.posts.map((p) => p.id));
          const newPosts = mappedPosts.filter((p) => !existingIds.has(p.id));
          this.posts = [...this.posts, ...newPosts];
        }

        this.page = meta.page;
        this.hasMore = meta.page < meta.lastPage;
        this.lastUpdate = now;
        this.lastLocation = { lat, lng };
      } catch (error: any) {
        console.error('Error fetching posts:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    mapComment(c: BackendComment): PostComment {
      return {
        id: c._id,
        author: c.usuario.nombre,
        avatar:
          c.usuario.image?.url ||
          `https://ui-avatars.com/api/?name=${c.usuario.nombre}&background=random`,
        content: c.texto,
        timestamp: c.fecha,
        likes: c.reactions ? c.reactions.length : 0,
        rawReactions: c.reactions || [],
        isLikedByCurrentUser: c.reactions
          ? c.reactions.some((r) => {
              const rId = r.user.id || (r.user as any)._id;
              return rId === useAuthStore().user?.uid;
            })
          : false,
        authorId: c.usuario.id,
        replies: c.respuestas
          ? c.respuestas.map((r) => this.mapComment(r))
          : [],
      };
    },

    async createPost(payload: any) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      const authStore = useAuthStore();

      if (!authStore.user?.token) throw new Error('Usuario no autenticado');

      const formData = new FormData();
      formData.append('contenido', payload.contenido);
      formData.append('categoria', payload.categoria);

      if (payload.ubicacion && payload.ubicacion.coordinates) {
        const [lng, lat] = payload.ubicacion.coordinates;
        formData.append('lat', lat.toString());
        formData.append('lng', lng.toString());
      }

      if (payload.imageFile) {
        formData.append('imagen', payload.imageFile);
      }

      try {
        await $fetch(`${API_BASE}/comunidad/create`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${authStore.user.token}`,
          },
        });
        return true;
      } catch (error) {
        console.error('Error creating post:', error);
        return false;
      }
    },

    async toggleReaction(postId: string, type: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;

      if (!authStore.user?.uid || !authStore.user?.token) return false;

      // 1. Snapshot for rollback
      const postIndex = this.posts.findIndex((p) => p.id === postId);
      if (postIndex === -1) return false;

      const originalPost = JSON.parse(JSON.stringify(this.posts[postIndex]));
      const post = this.posts[postIndex];
      if (!post) return false;

      // 2. Optimistic Update
      const isLiked = post.isLikedByCurrentUser;
      post.isLikedByCurrentUser = !isLiked;
      post.likes = isLiked ? Math.max(0, post.likes - 1) : post.likes + 1;

      try {
        const response: any = await $fetch(
          `${API_BASE}/comunidad/${postId}/reaction`,
          {
            method: 'POST',
            body: { type },
            headers: { Authorization: `Bearer ${authStore.user.token}` },
          }
        );

        // 3. Final Sync with server response
        const reaction = response.reaction;

        const updatePostReactions = (targetPost: Post) => {
          if (!targetPost.rawReactions) targetPost.rawReactions = [];
          if (reaction && reaction.status === 'removed') {
            targetPost.isLikedByCurrentUser = false;
            targetPost.rawReactions = targetPost.rawReactions.filter((r) => {
              const rUserId = r.user.id || (r.user as any)._id;
              return String(rUserId) !== String(authStore.user?.uid);
            });
          } else if (reaction) {
            targetPost.isLikedByCurrentUser = true;
            // Update or add reaction
            const rIndex = targetPost.rawReactions.findIndex((r) => {
              const rUserId = r.user.id || (r.user as any)._id;
              return String(rUserId) === String(authStore.user?.uid);
            });
            if (rIndex !== -1) {
              targetPost.rawReactions[rIndex] = reaction;
            } else {
              targetPost.rawReactions.push(reaction);
            }
          }
          targetPost.likes = targetPost.rawReactions.length;
        };

        if (post) updatePostReactions(post);
        if (this.currentPost && this.currentPost.id === postId) {
          // Clone to trigger reactivity if needed, or just mutate
          updatePostReactions(this.currentPost);
        }

        return true;
      } catch (error) {
        console.error('Error toggling reaction (rolling back):', error);
        // 4. Rollback
        if (postIndex !== -1) {
          this.posts.splice(postIndex, 1, originalPost);
        }
        // Note: Rolling back currentPost is harder without a snapshot, but standard fetch can fix it.
        return false;
      }
    },

    async reportPost(postId: string, reason: string) {
      const authStore = useAuthStore();
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;

      if (!authStore.user?.token) return false;

      try {
        await $fetch(`${API_BASE}/comunidad/${postId}/report`, {
          method: 'POST',
          body: { motivo: reason },
          headers: { Authorization: `Bearer ${authStore.user.token}` },
        });
        return true;
      } catch (error) {
        console.error('Error reporting post:', error);
        return false;
      }
    },

    async fetchPostById(postId: string, token?: string) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      this.loading = true;
      this.currentPost = null; // Clear previous

      try {
        const url = `${API_BASE}/comunidad/post/${postId}`;
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response: any = await $fetch(url, { headers });
        // Robust unwrapping: response is { message, post }
        const bp: BackendPost = response.post || response;

        if (!bp || !bp._id) {
          console.error('Invalid post data received:', response);
          return null;
        }

        const authStore = useAuthStore();
        const post: Post = {
          id: bp._id,
          author: bp.usuario.nombre,
          authorAvatar:
            bp.usuario.image?.url ||
            `https://ui-avatars.com/api/?name=${bp.usuario.nombre}&background=random`,
          timestamp: bp.createdAt,
          category: (bp.categoria || 'otros').toLowerCase() as any,
          content: bp.contenido,
          image: bp.imagen?.url,
          likes: bp.reactions ? bp.reactions.length : 0,
          comments: bp.comentarios
            ? bp.comentarios.map((c) => this.mapComment(c))
            : [],
          rawReactions: bp.reactions || [],
          isLikedByCurrentUser: bp.reactions
            ? bp.reactions.some((r) => {
                const rId = r.user.id || (r.user as any)._id;
                return rId === authStore.user?.uid;
              })
            : false,
        };

        // Set as current viewed post
        this.currentPost = post;

        // Update in posts array IF it exists there (keep feed fresh but don't pollute)
        const index = this.posts.findIndex((p) => p.id === postId);
        if (index !== -1) {
          this.posts.splice(index, 1, post);
        }
        // DO NOT UNSHIFT into posts to avoid pollution when viewing old posts

        return post;
      } catch (error) {
        console.error('Error fetching post by id:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async addComment(postId: string, text: string, parentId?: string) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      const authStore = useAuthStore();

      if (!authStore.user?.token) throw new Error('Usuario no autenticado');

      // Find post to update
      const postIndex = this.posts.findIndex((p) => p.id === postId);
      const post = postIndex !== -1 ? this.posts[postIndex] : null;

      // Also check currentPost
      if (!post && !(this.currentPost && this.currentPost.id === postId))
        return false;
      try {
        const url = parentId
          ? `${API_BASE}/comunidad/${postId}/comment/${parentId}/reply`
          : `${API_BASE}/comunidad/${postId}/comment`;

        const response: any = await $fetch(url, {
          method: 'POST',
          body: { texto: text },
          headers: { Authorization: `Bearer ${authStore.user.token}` },
        });

        const newCommentRaw = parentId ? response.reply : response.comment;

        if (newCommentRaw) {
          const newComment = this.mapComment(newCommentRaw);

          // Helper to update comment tree
          const addReplyToTree = (comments: PostComment[]): boolean => {
            for (const c of comments) {
              if (c.id === parentId) {
                if (!c.replies) c.replies = [];
                c.replies.push(newComment);
                return true;
              }
              if (c.replies && addReplyToTree(c.replies)) return true;
            }
            return false;
          };

          // Update Post in feed list if exists
          if (post) {
            if (parentId) {
              addReplyToTree(post.comments);
            } else {
              post.comments.push(newComment);
            }
          }

          // Update Current Post if it's different (to avoid double push if post and currentPost are the same ref)
          if (
            this.currentPost &&
            this.currentPost.id === postId &&
            this.currentPost !== post
          ) {
            if (parentId) {
              addReplyToTree(this.currentPost.comments);
            } else {
              this.currentPost.comments.push(newComment);
            }
          }
        } else {
          // Fallback if backend doesn't return the new object
          await this.fetchPostById(postId, authStore.user.token);
        }

        return true;
      } catch (error) {
        console.error('Error adding comment:', error);
        return false;
      }
    },

    async toggleCommentReaction(
      postId: string,
      commentId: string,
      type: string = 'like'
    ) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      const authStore = useAuthStore();

      if (!authStore.user?.uid || !authStore.user?.token) return false;

      // 1. Find post and comment for rollback and optimistic update
      const postIndex = this.posts.findIndex((p) => p.id === postId);
      const post = postIndex !== -1 ? this.posts[postIndex] : null;

      // Also check currentPost
      if (!post && !(this.currentPost && this.currentPost.id === postId))
        return false;

      let isReply = false;

      // Helper to find comment/reply
      const findAndToggleComment = (
        comments: PostComment[],
        isNested = false
      ): boolean => {
        for (const c of comments) {
          if (c.id === commentId) {
            if (isNested) isReply = true;
            const isLiked = c.isLikedByCurrentUser;
            c.isLikedByCurrentUser = !isLiked;
            c.likes = isLiked ? Math.max(0, c.likes - 1) : c.likes + 1;
            return true;
          }
          if (c.replies && findAndToggleComment(c.replies, true)) return true;
        }
        return false;
      };

      // 2. Perform Optimistic Update
      let updated = false;
      if (post) updated = findAndToggleComment(post.comments) || updated;
      if (this.currentPost && this.currentPost.id === postId)
        updated = findAndToggleComment(this.currentPost.comments) || updated;

      if (!updated) return false;

      try {
        const url = isReply
          ? `${API_BASE}/comunidad/reply/${commentId}/reaction`
          : `${API_BASE}/comunidad/comment/${commentId}/reaction`;

        const response: any = await $fetch(url, {
          method: 'POST',
          body: { type },
          headers: { Authorization: `Bearer ${authStore.user.token}` },
        });

        // 3. Final Sync with server response
        const reaction = response.reaction;

        const updateCommentStats = (comments: PostComment[]) => {
          for (const c of comments) {
            if (c.id === commentId) {
              if (!c.rawReactions) c.rawReactions = [];

              if (reaction && reaction.status === 'removed') {
                c.isLikedByCurrentUser = false;
                c.rawReactions = c.rawReactions.filter((r) => {
                  const rUserId = r.user.id || (r.user as any)._id;
                  return String(rUserId) !== String(authStore.user?.uid);
                });
              } else if (reaction) {
                c.isLikedByCurrentUser = true;
                const rIndex = c.rawReactions.findIndex((r) => {
                  const rUserId = r.user.id || (r.user as any)._id;
                  return String(rUserId) === String(authStore.user?.uid);
                });
                if (rIndex !== -1) {
                  c.rawReactions[rIndex] = reaction;
                } else {
                  c.rawReactions.push(reaction);
                }
              }
              c.likes = c.rawReactions.length;
              return true;
            }
            if (c.replies && updateCommentStats(c.replies)) return true;
          }
          return false;
        };

        if (post) updateCommentStats(post.comments);
        if (this.currentPost && this.currentPost.id === postId)
          updateCommentStats(this.currentPost.comments);

        return true;
      } catch (error) {
        console.error(
          'Error toggling comment/reply reaction (rolling back):',
          error
        );
        // 4. Rollback
        if (postIndex !== -1 && post) {
          // Simplified rollback: refetch or revert manually?
          // Without easy deep clone of originalPost for currentPost, refetch is safer if critical.
          // communityStore.fetchPostById(postId, ...) - but getting ref here is tricky.
          // For now, let's just log error. Ideally we revert the specific comment stat.
        }
        return false;
      }
    },

    async deleteComment(
      postId: string,
      commentId: string,
      isReplyInput?: boolean
    ) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      const authStore = useAuthStore();

      if (!authStore.user?.token) return false;

      // Try to find post in local state to update UI optimistically or deduce type
      const postIndex = this.posts.findIndex((p) => p.id === postId);
      const post = postIndex !== -1 ? this.posts[postIndex] : null;

      let isReply = isReplyInput;

      // If type not explicitly provided, try to deduce from local post state
      if (isReply === undefined && post) {
        const checkForReply = (comments: PostComment[]): boolean => {
          for (const c of comments) {
            if (c.id === commentId) return false; // Found as top level
            if (c.replies) {
              for (const r of c.replies) {
                if (r.id === commentId) return true; // Found as reply
                if (r.replies && checkForReply(r.replies)) return true;
              }
            }
          }
          return false; // Default/Not found in tree
        };
        isReply = checkForReply(post.comments);
      }

      // If we still don't know the type and have no post, we can't safely proceed unless we guess or fail.
      // But for 'My Comments', we should always pass isReplyInput.
      if (isReply === undefined) {
        console.warn(
          'deleteComment: Unable to determine if comment or reply. Post not found and isReplyInput not provided.'
        );
        return false;
      }

      try {
        const url = isReply
          ? `${API_BASE}/comunidad/reply/${commentId}`
          : `${API_BASE}/comunidad/comment/${commentId}`;

        await $fetch(url, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authStore.user.token}` },
        });

        // Delete from local Post state if available
        if (post) {
          const cleanComments = (comments: PostComment[]): PostComment[] => {
            return comments.filter((c) => {
              if (c.id === commentId) return false; // Remove this one
              if (c.replies) {
                c.replies = cleanComments(c.replies); // Recurse
              }
              return true;
            });
          };
          post.comments = cleanComments(post.comments);
        }

        // Also update currentPost if active
        if (this.currentPost && this.currentPost.id === postId) {
          const cleanComments = (comments: PostComment[]): PostComment[] => {
            return comments.filter((c) => {
              if (c.id === commentId) return false; // Remove this one
              if (c.replies) {
                c.replies = cleanComments(c.replies); // Recurse
              }
              return true;
            });
          };
          this.currentPost.comments = cleanComments(this.currentPost.comments);
        }

        // Also remove from myComments if present (regardless of whether post was in feed)
        this.myComments = this.myComments.filter((c) => c.id !== commentId);

        return true;
      } catch (error) {
        console.error('Error deleting comment/reply:', error);
        // Fallback: if post exists, maybe re-fetch it to ensure state sync, but simplified for now
        return false;
      }
    },

    resetState() {
      this.posts = [];
      this.page = 1;
      this.hasMore = true;
      this.lastUpdate = 0;
      this.lastLocation = null;
      this.myPosts = [];
      this.pageMyPosts = 1;
      this.hasMoreMyPosts = true;
      this.myComments = [];
      this.pageMyComments = 1;
      this.hasMoreMyComments = true;
    },

    async fetchMyPosts(force = false, targetPage = 1) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      const authStore = useAuthStore();

      if (!authStore.user?.token) return;

      const now = Date.now();
      const expiration = 5 * 60 * 1000; // 5 minutes

      if (
        !force &&
        targetPage === 1 &&
        this.myPosts.length > 0 &&
        now - this.lastUpdate < expiration
      ) {
        return;
      }

      if (targetPage > 1 && !this.hasMoreMyPosts && !force) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response: any = await $fetch(
          `${API_BASE}/comunidad/mis-posts?page=${targetPage}`,
          {
            headers: {
              Authorization: `Bearer ${authStore.user.token}`,
            },
          }
        );

        let rawPosts = [];
        let meta = { page: 1, lastPage: 1, total: 0 };

        if (Array.isArray(response)) {
          rawPosts = response;
        } else if (response.data && Array.isArray(response.data)) {
          rawPosts = response.data;
          meta = response.meta || meta;
        }

        const mappedPosts: Post[] = rawPosts.map((bp: any) => ({
          id: bp._id,
          author: bp.usuario?.nombre || 'Usuario',
          authorAvatar:
            bp.usuario?.image?.url ||
            `https://ui-avatars.com/api/?name=${bp.usuario?.nombre || 'User'}&background=random`,
          timestamp: bp.createdAt,
          category: (bp.categoria || 'otros').toLowerCase() as any,
          content: bp.contenido,
          image: bp.imagen?.url,
          likes: bp.reactions ? bp.reactions.length : 0,
          comments: bp.comentarios
            ? bp.comentarios.map((c: any) => this.mapComment(c))
            : [],
          rawReactions: bp.reactions || [],
          isLikedByCurrentUser: false, // Usually my own posts are not liked by me by default or check reactions
        }));

        if (targetPage === 1) {
          this.myPosts = mappedPosts;
        } else {
          // Append and deduplicate
          const existingIds = new Set(this.myPosts.map((p) => p.id));
          const newPosts = mappedPosts.filter((p) => !existingIds.has(p.id));
          this.myPosts = [...this.myPosts, ...newPosts];
        }

        this.pageMyPosts = meta.page;
        this.hasMoreMyPosts = meta.page < meta.lastPage;
      } catch (error: any) {
        console.error('Error fetching my posts:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async deletePost(postId: string) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      const authStore = useAuthStore();

      if (!authStore.user?.token) return false;

      try {
        await $fetch(`${API_BASE}/comunidad/post/${postId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authStore.user.token}`,
          },
        });

        this.myPosts = this.myPosts.filter((p) => p.id !== postId);
        this.posts = this.posts.filter((p) => p.id !== postId); // Also remove from feed
        return true;
      } catch (error) {
        console.error('Error deleting post:', error);
        return false;
      }
    },

    async fetchMyComments(force = false, targetPage = 1) {
      const config = useRuntimeConfig();
      const API_BASE = config.public.apiBase;
      const authStore = useAuthStore();

      if (!authStore.user?.token) return;

      const now = Date.now();
      const expiration = 5 * 60 * 1000; // 5 minutes

      if (
        !force &&
        targetPage === 1 &&
        this.myComments.length > 0 &&
        now - this.lastUpdate < expiration
      ) {
        return;
      }

      if (targetPage > 1 && !this.hasMoreMyComments && !force) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response: any = await $fetch(
          `${API_BASE}/comunidad/mis-comentarios?page=${targetPage}`,
          {
            headers: {
              Authorization: `Bearer ${authStore.user.token}`,
            },
          }
        );

        let rawComments = [];
        let meta = { page: 1, lastPage: 1, total: 0 };

        if (Array.isArray(response)) {
          rawComments = response;
        } else if (response.data && Array.isArray(response.data)) {
          rawComments = response.data;
          meta = response.meta || meta;
        }

        // We need to map `post` info if available for linking
        const mappedComments = rawComments.map((c: any) => ({
          id: c.id || c._id, // Backend returns 'id' through aggregation project
          content: c.texto,
          timestamp: c.fecha || c.createdAt,
          likes: c.reactions ? c.reactions.length : 0,
          postId: c.postId,
          postTitle: c.postTitle || 'Publicación no disponible',
          isReply: c.type === 'reply',
        }));

        if (targetPage === 1) {
          this.myComments = mappedComments;
        } else {
          const existingIds = new Set(this.myComments.map((c) => c.id));
          const newComments = mappedComments.filter(
            (c) => !existingIds.has(c.id)
          );
          this.myComments = [...this.myComments, ...newComments];
        }

        this.pageMyComments = meta.page;
        this.hasMoreMyComments = meta.page < meta.lastPage;
      } catch (error: any) {
        console.error('Error fetching my comments:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
