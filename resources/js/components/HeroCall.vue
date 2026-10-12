<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Check } from 'lucide-vue-next';
import IlodyLogo from './IlodyLogo.vue';

const { t, tm } = useI18n();

const lines = computed(() => tm('call.lines'));

/* Nombre de répliques affichées ; une étape de plus révèle le résultat de l'appel. */
const step = ref(0);
const seconds = ref(0);
const lastStep = computed(() => lines.value.length + 1);
const done = computed(() => step.value >= lastStep.value);
const clock = computed(() => `0:${String(seconds.value).padStart(2, '0')}`);

const delays = [500, 2100, 1800, 2000, 1400];
let timeout;
let interval;

function next() {
    step.value += 1;
    if (done.value) {
        clearInterval(interval);
        return;
    }
    timeout = setTimeout(next, delays[step.value] ?? 1600);
}

onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        step.value = lastStep.value;
        seconds.value = 47;
        return;
    }
    interval = setInterval(() => (seconds.value += 1), 1000);
    timeout = setTimeout(next, delays[0]);
});

onBeforeUnmount(() => {
    clearTimeout(timeout);
    clearInterval(interval);
});
</script>

<template>
    <figure class="rounded-[1.75rem] border border-line bg-white p-5 shadow-[var(--shadow-call)] sm:p-6">
        <figcaption class="flex items-center justify-between gap-4">
            <span class="flex items-center gap-3">
                <IlodyLogo variant="mark" class="size-10 shrink-0" />
                <span class="leading-tight">
                    <span class="block text-sm font-semibold text-ink">{{ t('call.title') }}</span>
                    <span class="block text-xs text-muted">{{ t('call.caption') }}</span>
                </span>
            </span>
            <span class="flex items-center gap-2 text-sm font-medium tabular-nums text-muted">
                <span class="size-2 rounded-full" :class="done ? 'bg-line' : 'animate-pulse bg-cobalt'" />
                {{ clock }}
            </span>
        </figcaption>

        <ol class="mt-5 flex flex-col gap-2.5">
            <li
                v-for="(line, i) in lines"
                :key="i"
                class="call-line max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.95rem] leading-snug"
                :class="[
                    line.who === 'agent'
                        ? 'self-end rounded-br-md bg-cobalt text-white'
                        : 'self-start rounded-bl-md bg-paper text-ink',
                    step > i ? 'is-shown' : '',
                ]"
            >
                <span class="sr-only">{{ t('call.' + line.who) }} :</span>
                {{ line.text }}
            </li>
        </ol>

        <p
            class="call-line mt-4 flex items-center justify-between gap-3 rounded-2xl bg-apricot-100 px-4 py-3 text-sm text-ink"
            :class="done ? 'is-shown' : ''"
        >
            <span class="flex items-center gap-2.5 font-semibold">
                <span class="grid size-6 place-items-center rounded-full bg-ink text-white">
                    <Check class="size-3.5" stroke-width="3" />
                </span>
                {{ t('call.outcome') }}
            </span>
            <span class="tabular-nums">{{ t('call.slot') }}</span>
        </p>
    </figure>
</template>

<style scoped>
/* Les répliques occupent leur place dès le départ : la carte ne change pas de taille pendant l'appel. */
.call-line {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
    transition:
        opacity 0.35s ease-out,
        transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}
.call-line.is-shown {
    opacity: 1;
    transform: none;
}
@media (prefers-reduced-motion: reduce) {
    .call-line {
        transition: none;
    }
}
</style>
