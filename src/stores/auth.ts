import { defineStore } from "pinia";
import { api } from "@/api/client";
import type { User } from "@/types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    access: localStorage.getItem("access") as string | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.access,
    isSubscriber: (state) => !!state.user?.has_active_subscription,
  },
  actions: {
    async loginWithGoogle(idToken: string) {
      const res = await api.post("/auth/google/", { id_token: idToken });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      this.access = res.data.access;
      this.user = res.data.user;
    },
    async fetchUser() {
      if (!this.access) return;
      try {
        const res = await api.get("/auth/user/");
        this.user = res.data;
      } catch {
        this.logout();
      }
    },
    logout() {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      this.access = null;
      this.user = null;
    },
  },
});
