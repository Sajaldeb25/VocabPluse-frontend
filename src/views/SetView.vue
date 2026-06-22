<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { api } from "@/api/client";
import { useAuthStore } from "@/stores/auth";
import FlashCard from "@/components/FlashCard.vue";
import type { WordCard } from "@/types";

const route = useRoute();
const auth = useAuthStore();
const cards = ref<WordCard[]>([]);
const index = ref(0);
const error = ref("");

onMounted(async () => {
  try {
    const res = await api.get(`/wordsets/${route.params.id}/cards/`);
    cards.value = res.data;
  } catch (e: any) {
    error.value = e.response?.data?.detail || "Unable to load this set.";
  }
});

async function recordProgress(status: string) {
  if (!auth.isAuthenticated) return;
  const card = cards.value[index.value];
  try {
    await api.post("/progress/", { word: card.id, status });
  } catch {
    /* progress is best-effort */
  }
}

function next(status: string) {
  recordProgress(status);
  if (index.value < cards.value.length - 1) index.value++;
}

function prev() {
  if (index.value > 0) index.value--;
}
</script>

<template>
  <RouterLink to="/">← Back to words</RouterLink>
  <p v-if="error" class="notice">{{ error }}</p>

  <div v-if="cards.length">
    <div class="progress-bar">
      <span>Card {{ index + 1 }} / {{ cards.length }}</span>
      <span v-if="!auth.isAuthenticated">Log in to save progress</span>
    </div>

    <FlashCard :key="cards[index].id" :card="cards[index]" />

    <div class="card-buttons">
      <button class="ghost" @click="prev" :disabled="index === 0">
        Previous
      </button>
      <button class="ghost" @click="next('learning')">Still learning</button>
      <button @click="next('known')">I know this →</button>
    </div>
  </div>

  <p v-else-if="!error">Loading cards…</p>
</template>
