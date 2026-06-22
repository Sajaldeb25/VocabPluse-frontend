<script setup lang="ts">
import { ref } from "vue";
import { api } from "@/api/client";
import { useAuthStore } from "@/stores/auth";
import type { Definition, ExampleQuestion, WordCard } from "@/types";

const props = defineProps<{ card: WordCard }>();
const auth = useAuthStore();

const activePanel = ref<"" | "define" | "ai" | "questions">("");
const definition = ref<Definition | null>(null);
const aiContent = ref<string>("");
const questions = ref<ExampleQuestion[]>([]);
const message = ref<string>("");
const loading = ref(false);

function reset() {
  message.value = "";
}

async function showDefine() {
  reset();
  activePanel.value = "define";
  if (definition.value) return;
  loading.value = true;
  try {
    const res = await api.get(`/words/${props.card.id}/define/`);
    definition.value = res.data;
  } catch (e: any) {
    message.value = e.response?.data?.detail || "Could not load definition.";
  } finally {
    loading.value = false;
  }
}

async function showAI() {
  reset();
  activePanel.value = "ai";
  if (aiContent.value) return;
  loading.value = true;
  try {
    const res = await api.post(`/words/${props.card.id}/explain/`);
    aiContent.value = res.data.content;
  } catch (e: any) {
    message.value =
      e.response?.data?.detail || "AI explanation is not available.";
  } finally {
    loading.value = false;
  }
}

async function showQuestions() {
  reset();
  activePanel.value = "questions";
  if (questions.value.length) return;
  loading.value = true;
  try {
    const res = await api.get(`/words/${props.card.id}/questions/`);
    questions.value = res.data;
    if (!questions.value.length) {
      message.value = "No example questions recorded for this word yet.";
    }
  } catch (e: any) {
    message.value =
      e.response?.data?.detail || "Example questions require a subscription.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flashcard">
    <p class="pos" v-if="card.part_of_speech">{{ card.part_of_speech }}</p>
    <h2 class="word">{{ card.text }}</h2>
    <span class="chip">{{ card.level }}</span>

    <div class="card-buttons">
      <button @click="showDefine">Define</button>
      <button @click="showAI">Explanation with AI</button>
      <button
        @click="showQuestions"
        :disabled="!auth.isSubscriber"
        :title="auth.isSubscriber ? '' : 'Subscription required'"
      >
        Example Questions {{ auth.isSubscriber ? "" : "🔒" }}
      </button>
    </div>

    <p v-if="loading" class="panel">Loading…</p>
    <p v-if="message" class="notice">{{ message }}</p>

    <div v-if="activePanel === 'define' && definition" class="panel">
      <strong>Definition:</strong> {{ definition.simple_definition }}<br />
      <template v-if="definition.example_sentence">
        <strong>Example:</strong> {{ definition.example_sentence }}
      </template>
    </div>

    <div v-if="activePanel === 'ai' && aiContent" class="panel">{{ aiContent }}</div>

    <div v-if="activePanel === 'questions' && questions.length" class="panel">
      <div v-for="q in questions" :key="q.id" style="margin-bottom: 12px">
        <strong>{{ q.source.toUpperCase() }}<span v-if="q.year"> {{ q.year }}</span>:</strong>
        {{ q.question_text }}
        <ul v-if="q.options">
          <li v-for="(opt, i) in q.options" :key="i">{{ opt }}</li>
        </ul>
        <em v-if="q.answer">Answer: {{ q.answer }}</em>
      </div>
    </div>
  </div>
</template>
