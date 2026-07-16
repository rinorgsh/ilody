<script setup>
defineProps({
    theme: { type: String, default: 'dark' }, // 'dark' => texte clair, 'light' => texte navy
    compact: { type: Boolean, default: false },
});
</script>

<template>
    <span class="inline-flex items-center gap-3 select-none">
        <span
            class="grid place-items-center rounded-xl bg-navy-800 ring-1 ring-white/10 shadow-sm"
            :class="compact ? 'size-9' : 'size-11'"
        >
            <svg viewBox="0 0 64 64" class="h-1/2 w-1/2" fill="none" aria-hidden="true">
                <g stroke="#D4AF37" stroke-width="4.2" stroke-linecap="round">
                    <path d="M18 28 V36" />
                    <path d="M27 20 V44" />
                    <path d="M36 25 V39" />
                    <path d="M45 17 V47" />
                </g>
            </svg>
        </span>
        <span class="flex flex-col leading-none">
            <span
                class="font-display font-semibold tracking-tight"
                :class="[
                    compact ? 'text-lg' : 'text-xl',
                    theme === 'dark' ? 'text-white' : 'text-navy-800',
                ]"
            >
                Ilody
            </span>
            <span
                class="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.28em]"
                :class="theme === 'dark' ? 'text-gold-400' : 'text-gold-500'"
            >
                Callcenter
            </span>
        </span>
    </span>
</template>
