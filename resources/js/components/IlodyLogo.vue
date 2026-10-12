<script setup>
/*
 * Logo Ilody.
 * Le « i » est un opérateur : le point est la tête, le fût le buste, l'arc le casque-micro.
 * Les fûts i, l, d, y montent et descendent comme les barres d'un niveau sonore.
 */
defineProps({
    variant: { type: String, default: 'wordmark' }, // 'wordmark' | 'mark'
    onDark: { type: Boolean, default: false },
});
</script>

<template>
    <svg v-if="variant === 'mark'" viewBox="0 0 64 64" fill="none" role="img" aria-label="Ilody Callcenter">
        <rect width="64" height="64" rx="17" class="fill-cobalt" />
        <g stroke="#fff" stroke-linecap="round">
            <path d="M32 39.5V50" stroke-width="9.5" />
            <path d="M17.5 23a14.5 14.5 0 0 1 29 0" stroke-width="3.6" />
            <path d="M17.5 21v5M46.5 21v5" stroke-width="6.4" />
            <path d="M17.5 27c0 6 2.5 9 7.5 9.5" stroke-width="2.6" />
        </g>
        <circle cx="32" cy="23" r="6.6" class="fill-apricot" />
    </svg>

    <svg v-else viewBox="2 5 197 100" fill="none" role="img" aria-label="Ilody Callcenter">
        <g :class="onDark ? 'stroke-white' : 'stroke-ink'" stroke-width="10" stroke-linecap="round">
            <path d="M21 45V75" />
            <path d="M49 17V75" />
            <circle cx="82" cy="60" r="15" />
            <circle cx="128" cy="60" r="15" />
            <path d="M143 17V75" />
            <path d="M162 45V60a15 15 0 0 0 30 0M192 45V85a15 15 0 0 1-15 15h-5" />
        </g>
        <g :class="onDark ? 'stroke-cobalt-300' : 'stroke-cobalt'" stroke-linecap="round">
            <path d="M7 23a14 14 0 0 1 28 0" stroke-width="3.6" />
            <path d="M7 21v5M35 21v5" stroke-width="6.4" />
            <path d="M7 27c0 6 2 8.5 6 9" stroke-width="2.6" />
        </g>
        <circle cx="21" cy="23" r="6.6" class="fill-apricot" />
    </svg>
</template>
