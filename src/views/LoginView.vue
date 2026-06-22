<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();
const error = ref("");
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

async function handleCredential(response: { credential: string }) {
  try {
    await auth.loginWithGoogle(response.credential);
    router.push("/");
  } catch (e: any) {
    error.value = e.response?.data?.detail || "Login failed.";
  }
}

onMounted(() => {
  if (!clientId) return;
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.onload = () => {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
    });
    google.accounts.id.renderButton(document.getElementById("gbtn"), {
      theme: "outline",
      size: "large",
    });
  };
  document.head.appendChild(script);
});
</script>

<template>
  <div style="max-width: 420px; margin: 40px auto; text-align: center">
    <h1>Log in to VocabPluse</h1>
    <p style="color: var(--muted)">
      Sign in with your Gmail account to track progress and unlock more AI
      explanations.
    </p>

    <div id="gbtn" style="display: flex; justify-content: center; margin: 20px 0"></div>

    <p v-if="!clientId" class="notice">
      Google login is not configured. Set <code>VITE_GOOGLE_CLIENT_ID</code> in
      the frontend <code>.env</code> and <code>GOOGLE_OAUTH_CLIENT_ID</code> in
      the backend to enable it.
    </p>
    <p v-if="error" class="notice">{{ error }}</p>
  </div>
</template>
