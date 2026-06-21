<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push("/");
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="brand">VocabPluse</RouterLink>
      <div class="nav-links">
        <RouterLink to="/">Words</RouterLink>
        <RouterLink to="/plans">Plans</RouterLink>
        <template v-if="auth.isAuthenticated">
          <RouterLink to="/account">Account</RouterLink>
          <button class="ghost" @click="logout">Logout</button>
        </template>
        <RouterLink v-else to="/login">
          <button>Login</button>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
