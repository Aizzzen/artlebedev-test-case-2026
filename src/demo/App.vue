<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { FormGenerator } from '../form-generator';
import type { FormData } from '../form-generator';
import { presets } from './examples';

const activeId = ref(presets[0].id);
const formData = ref<FormData>({});
const lastSubmitted = ref<FormData | null>(null);

const activePreset = computed(
  () => presets.find((p) => p.id === activeId.value) ?? presets[0],
);

watch(activeId, () => {
  formData.value = {};
  lastSubmitted.value = null;
});

function handleSubmit(data: FormData) {
  lastSubmitted.value = { ...data };
}
</script>

<template>
  <div class="demo">
    <header class="demo__header">
      <div class="demo__brand">
        <span class="demo__brand-mark">FG</span>
        <span class="demo__brand-text">FormGenerator</span>
      </div>
      <p class="demo__tagline">
        Vue 3 компонент, который собирает форму из JSON-схемы.
      </p>
    </header>

    <main class="demo__main">
      <aside class="demo__sidebar">
        <h2 class="demo__sidebar-title">Примеры сценариев</h2>
        <ul class="demo__preset-list">
          <li v-for="preset in presets" :key="preset.id">
            <button
              type="button"
              class="demo__preset"
              :class="{ 'demo__preset--active': activeId === preset.id }"
              @click="activeId = preset.id"
            >
              <span class="demo__preset-title">{{ preset.title }}</span>
              <span class="demo__preset-desc">{{ preset.description }}</span>
            </button>
          </li>
        </ul>
      </aside>

      <section class="demo__form-panel">
        <header class="demo__panel-header">
          <h2 class="demo__panel-title">{{ activePreset.title }}</h2>
          <p class="demo__panel-desc">{{ activePreset.description }}</p>
        </header>
        <FormGenerator
          :schema="activePreset.schema"
          v-model="formData"
          @submit="handleSubmit"
        />
      </section>

      <section class="demo__data-panel">
        <header class="demo__panel-header">
          <h2 class="demo__panel-title">Реактивное состояние</h2>
          <p class="demo__panel-desc">
            Привязка через <code>v-model="formData"</code>.
          </p>
        </header>

        <div class="demo__data-block">
          <h3 class="demo__data-label">formData</h3>
          <pre class="demo__data-code">{{ JSON.stringify(formData, null, 2) }}</pre>
        </div>

        <div v-if="lastSubmitted" class="demo__data-block demo__data-block--success">
          <h3 class="demo__data-label">Отправлено</h3>
          <pre class="demo__data-code">{{ JSON.stringify(lastSubmitted, null, 2) }}</pre>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped lang="scss">
$bp-md: 900px;

.demo {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e5e5e0;
  }

  &__brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  &__brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 32px;
    padding: 0 8px;
    background: #111;
    color: #fff;
    border-radius: 4px;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.02em;
  }

  &__brand-text {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  &__tagline {
    margin: 0;
    color: #6b6b6b;
    font-size: 15px;
  }

  &__main {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr) minmax(0, 1fr);
    gap: 24px;
    align-items: start;

    @media (max-width: $bp-md) {
      grid-template-columns: 1fr;
    }
  }

  &__sidebar {
    position: sticky;
    top: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    @media (max-width: $bp-md) { position: static; }
  }

  &__sidebar-title {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b6b6b;
  }

  &__preset-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__preset {
    width: 100%;
    text-align: left;
    padding: 12px 16px;
    background: transparent;
    border: 1px solid #e5e5e0;
    border-radius: 6px;
    cursor: pointer;
    font: inherit;
    color: inherit;
    display: flex;
    flex-direction: column;
    gap: 2px;
    transition: background 0.12s ease, border-color 0.12s ease;

    &:hover { border-color: #111; }

    &--active {
      background: #111;
      color: #fff;
      border-color: #111;
    }
  }

  &__preset-title { font-size: 15px; font-weight: 600; }
  &__preset-desc { font-size: 12px; opacity: 0.7; }

  &__form-panel, &__data-panel {
    background: #fff;
    border: 1px solid #e5e5e0;
    border-radius: 6px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__panel-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e5e5e0;
  }

  &__panel-title { margin: 0; font-size: 18px; font-weight: 600; }

  &__panel-desc {
    margin: 0;
    font-size: 13px;
    color: #6b6b6b;

    code {
      font-family: ui-monospace, 'SF Mono', Menlo, monospace;
      font-size: 12px;
      padding: 1px 4px;
      background: #fafaf7;
      border-radius: 4px;
    }
  }

  &__data-block {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &--success {
      padding: 16px;
      background: rgba(42, 157, 63, 0.06);
      border: 1px solid rgba(42, 157, 63, 0.25);
      border-radius: 6px;
    }
  }

  &__data-label {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b6b6b;
  }

  &__data-code {
    margin: 0;
    padding: 16px;
    background: #fafaf7;
    border: 1px solid #e5e5e0;
    border-radius: 6px;
    font-family: ui-monospace, 'SF Mono', Menlo, monospace;
    font-size: 13px;
    line-height: 1.55;
    overflow-x: auto;
    white-space: pre;
  }
}
</style>