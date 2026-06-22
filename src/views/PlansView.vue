<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "@/api/client";
import { useAuthStore } from "@/stores/auth";
import type { Plan } from "@/types";

const auth = useAuthStore();
const router = useRouter();
const plans = ref<Plan[]>([]);
const message = ref("");

onMounted(async () => {
  const res = await api.get("/plans/");
  plans.value = res.data;
});

async function subscribe(plan: Plan) {
  if (!auth.isAuthenticated) {
    router.push("/login");
    return;
  }
  try {
    const res = await api.post("/subscriptions/checkout/", { plan_id: plan.id });
    if (res.data.redirect_url) {
      window.location.href = res.data.redirect_url;
    } else {
      message.value = "Checkout started.";
    }
  } catch (e: any) {
    message.value = e.response?.data?.detail || "Could not start checkout.";
  }
}
</script>

<template>
  <h1>Subscription Plans</h1>
  <p style="color: var(--muted)">
    Unlock all levels, unlimited AI explanations, and past exam questions.
  </p>
  <p v-if="message" class="notice">{{ message }}</p>

  <div class="card-grid">
    <div v-for="plan in plans" :key="plan.id" class="plan-card">
      <h2>{{ plan.name }}</h2>
      <p class="plan-price">{{ plan.price }} {{ plan.currency }}</p>
      <p style="color: var(--muted)">per {{ plan.duration_days }} days</p>
      <p>{{ plan.description }}</p>
      <button @click="subscribe(plan)">Subscribe</button>
    </div>
  </div>
  <p v-if="!plans.length" style="color: var(--muted)">No plans available.</p>
</template>
