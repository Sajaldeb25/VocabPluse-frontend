<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useCatalogStore } from "@/stores/catalog";
import { useAuthStore } from "@/stores/auth";
import type { WordSet } from "@/types";

const catalog = useCatalogStore();
const auth = useAuthStore();

const LEVELS = ["easy", "medium", "hard", "advanced"];

onMounted(async () => {
  await catalog.fetchCategories();
  await catalog.fetchWordSets();
});

const setsByCategoryLevel = computed(() => {
  const map: Record<number, Record<string, WordSet[]>> = {};
  for (const set of catalog.wordSets) {
    map[set.category] ??= {};
    map[set.category][set.level] ??= [];
    map[set.category][set.level].push(set);
  }
  return map;
});
</script>

<template>
  <h1>Master English Vocabulary</h1>
  <p style="color: var(--muted)">
    Learn with flash cards, AI explanations, and real exam questions.
    <span v-if="!auth.isAuthenticated">
      <RouterLink to="/login">Log in</RouterLink> to track your progress.
    </span>
  </p>

  <div class="menu">
    <section
      v-for="cat in catalog.categories"
      :key="cat.id"
      class="menu-section"
    >
      <h2>{{ cat.name }}</h2>
      <div v-for="level in LEVELS" :key="level">
        <div class="level-row">
          <span class="chip">{{ level }}</span>
        </div>
        <ul class="set-list">
          <li
            v-for="set in setsByCategoryLevel[cat.id]?.[level] || []"
            :key="set.id"
            class="set-item"
            :class="{ locked: set.locked }"
          >
            <span>{{ set.title }} · {{ set.word_count }} words</span>
            <RouterLink v-if="!set.locked" :to="`/sets/${set.id}`">
              <button>Study</button>
            </RouterLink>
            <RouterLink v-else to="/plans">
              <button class="ghost">Unlock 🔒</button>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
