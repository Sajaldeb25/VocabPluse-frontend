import { defineStore } from "pinia";
import { api } from "@/api/client";
import type { Category, WordSet } from "@/types";

export const useCatalogStore = defineStore("catalog", {
  state: () => ({
    categories: [] as Category[],
    wordSets: [] as WordSet[],
  }),
  actions: {
    async fetchCategories() {
      if (this.categories.length) return;
      const res = await api.get("/categories/");
      this.categories = res.data;
    },
    async fetchWordSets(categorySlug?: string, level?: string) {
      const params: Record<string, string> = {};
      if (categorySlug) params.category = categorySlug;
      if (level) params.level = level;
      const res = await api.get("/wordsets/", { params });
      this.wordSets = res.data;
    },
  },
});
