import fetch from "isomorphic-unfetch";

import fetcher from "./utils/fetcher";
import { SERVER_BASE_URL } from "./utils/constant";
import { limit } from "./utils/limit";

const Articles = {
  all: (page, limit = 10) =>
    fetcher(`${SERVER_BASE_URL}/articles?${limit(limit, page)}`),

  byAuthor: (author, page = 0, offset = 5) =>
    fetcher(
      `${SERVER_BASE_URL}/articles?author=${encodeURIComponent(author)}&${limit(
        offset,
        page
      )}`
    ),

  byTag: (tag, page = 0, limit = 10) =>
    fetcher(
      `${SERVER_BASE_URL}/articles?tag=${encodeURIComponent(tag)}&${limit(
        limit,
        page
      )}`
    ),

  del: slug =>
    fetch(`${SERVER_BASE_URL}/articles/${slug}`, {
      method: "DELETE"
    }),

  favorite: slug =>
    fetch(`${SERVER_BASE_URL}/articles/${slug}/favorite`, {
      method: "POST"
    }),

  favoritedBy: (author, page) =>
    fetcher(
      `${SERVER_BASE_URL}/articles?favorited=${encodeURIComponent(
        author
      )}&${limit(5, page)}`
    ),

  feed: (page, limit = 10) =>
    fetcher(`${SERVER_BASE_URL}/articles/feed?${limit(limit, page)}`),

  get: slug => fetcher(`${SERVER_BASE_URL}/articles/${slug}`),

  unfavorite: slug =>
    fetch(`${SERVER_BASE_URL}/articles/${slug}/favorite`, {
      method: "DELETE"
    }),

  update: async (article, token) => {
    const response = await fetch(
      `${SERVER_BASE_URL}/articles/${article.slug}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${encodeURIComponent(token)}`
        },
        body: JSON.stringify({ article })
      }
    );
    const data = await response.json();

    return {
      ok: response.ok,
      data
    };
  },

  create: async (article, token) => {
    const response = await fetch(`${SERVER_BASE_URL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${encodeURIComponent(token)}`
      },
      body: JSON.stringify({ article })
    });
    const data = await response.json();

    return {
      ok: response.ok,
      data
    };
  }
};

const Auth = {
  current: async () => {
    const user = window.localStorage.getItem(`user`);
    const token = user && user.token;

    const response = await fetch(`/user`, {
      method: "GET",
      headers: {
        Authorization: `Token ${encodeURIComponent(token)}`
      }
    });
    const data = await response.json();

    return {
      ok: response.ok,
      data
    };
  },

  login: async (email, password) => {
    const response = await fetch(`${SERVER_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user: { email, password } })
    });
    const data = await response.json();

    return {
      ok: response.ok,
      data
    };
  },

  register: async (username, email, password) => {
    const response = await fetch(`${SERVER_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user: { username, email, password } })
    });
    const data = await response.json();

    return {
      ok: response.ok,
      data
    };
  },

  save: async user => {
    const response = await fetch(`${SERVER_BASE_URL}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user })
    });
    const data = await response.json();

    return {
      ok: response.ok,
      data
    };
  }
};

const Comments = {
  create: async (slug, comment) => {
    const response = await fetch(
      `${SERVER_BASE_URL}/articles/${slug}/comments`,
      {
        method: "POST",
        body: JSON.stringify({ comment })
      }
    );
    const data = await response.json();

    return {
      ok: response.ok,
      data
    };
  },

  delete: async (slug, commentId) => {
    const response = await fetch(
      `${SERVER_BASE_URL}/articles/${slug}/comments/${commentId}`,
      {
        method: "DELETE"
      }
    );

    return {
      ok: response.ok
    };
  },

  forArticle: slug => fetcher(`${SERVER_BASE_URL}/articles/${slug}/comments`)
};

const Profile = {
  follow: async username => {
    const response = await fetch(
      `${SERVER_BASE_URL}/profiles/${username}/follow`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    const data = await response.json();

    return {
      ok: response.ok,
      data
    };
  },
  unfollow: async username => {
    const { ok } = await fetch(
      `${SERVER_BASE_URL}/profiles/${username}/follow`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return {
      ok
    };
  },
  get: async username => fetcher(`${SERVER_BASE_URL}/profiles/${username}`)
};

const Tags = {
  getAll: () => fetcher(`${SERVER_BASE_URL}/tags`)
};

export default {
  Articles,
  Auth,
  Comments,
  Profile,
  Tags
};
