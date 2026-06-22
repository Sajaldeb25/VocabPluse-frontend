<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "@/api/client";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const progress = ref<any[]>([]);

onMounted(async () => {
  await auth.fetchUser();
  try {
    const res = await api.get("/progress/");
    progress.value = res.data;
  } catch {
    /* ignore */
  }
});
</script>

<template>
  <h1>My Account</h1>
  <div v-if="auth.user" class="plan-card" style="max-width: 480px">
    <p><strong>Email:</strong> {{ auth.user.email }}</p>
    <p>
      <strong>Subscription:</strong>
      <span v-if="auth.isSubscriber" style="color: var(--green)">Active</span>
      <span v-else>
        Free plan —
        <RouterLink to="/plans">upgrade</RouterLink>
      </span>
    </p>
  </div>

  <h2 style="margin-top: 28px">Progress ({{ progress.length }} words)</h2>
  <ul class="set-list">
    <li v-for="p in progress" :key="p.id" class="set-item">
      <span>{{ p.word_text }}</span>
      <span class="chip">{{ p.status }} · seen {{ p.times_seen }}×</span>
    </li>
  </ul>
  <p v-if="!progress.length" style="color: var(--muted)">
    No progress yet. Start studying a set!
  </p>
</template>
