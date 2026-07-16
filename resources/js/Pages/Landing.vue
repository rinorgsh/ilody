<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import IlodyLogo from '../components/IlodyLogo.vue';
import {
    Target,
    PhoneCall,
    Megaphone,
    GraduationCap,
    Languages,
    Layers,
    SlidersHorizontal,
    BadgeCheck,
    MessagesSquare,
    HardHat,
    Zap,
    Building2,
    Coins,
    Signal,
    ShieldCheck,
    Briefcase,
    Check,
    ArrowRight,
    ArrowUpRight,
    Mail,
    Menu,
    X,
    Phone,
} from 'lucide-vue-next';

const { t, tm, locale } = useI18n();
const page = usePage();

/* ---------- Langue ---------- */
function setLocale(l) {
    locale.value = l;
    localStorage.setItem('ilody_locale', l);
    document.documentElement.lang = l;
}

/* ---------- Menu mobile ---------- */
const mobileOpen = ref(false);
const scrolled = ref(false);
function onScroll() {
    scrolled.value = window.scrollY > 24;
}

/* ---------- Reveal on scroll ---------- */
let observer;
onMounted(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.lang = locale.value;

    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    observer.unobserve(e.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
});
onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
    observer?.disconnect();
});

function goTo(id) {
    mobileOpen.value = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------- Données services ---------- */
const services = computed(() => [
    { key: 'leadgen', icon: Target },
    { key: 'callcenter', icon: PhoneCall },
    { key: 'marketing', icon: Megaphone },
    { key: 'training', icon: GraduationCap },
]);

const whyIcons = [Languages, Layers, SlidersHorizontal, BadgeCheck, MessagesSquare];
const sectorIcons = [HardHat, Zap, Building2, Coins, Signal, ShieldCheck, Briefcase];

const whyItems = computed(() => tm('why.items'));
const sectorItems = computed(() => tm('sectors.items'));

const contactEmail = computed(() => page.props.contactEmail);

/* ---------- Formulaire ---------- */
const submitted = ref(false);
const form = useForm({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    website: '', // honeypot
});

const serviceOptions = computed(() => [
    t('services.leadgen.title'),
    t('services.callcenter.title'),
    t('services.marketing.title'),
    t('services.training.title'),
]);

function submit() {
    form.post('/contact', {
        preserveScroll: true,
        onSuccess: () => {
            submitted.value = true;
            form.reset();
        },
    });
}

const navLinks = computed(() => [
    { id: 'services', label: t('nav.services') },
    { id: 'why', label: t('nav.why') },
    { id: 'sectors', label: t('nav.sectors') },
    { id: 'contact', label: t('nav.contact') },
]);
</script>

<template>
    <Head :title="'Ilody Callcenter — ' + t('hero.title1') + ' ' + t('hero.title2')" />

    <div class="min-h-screen bg-white font-sans text-navy-800 antialiased">
        <!-- ===================== NAV ===================== -->
        <header
            class="fixed inset-x-0 top-0 z-50 transition-all duration-300"
            :class="scrolled ? 'bg-navy-900/90 backdrop-blur-md shadow-lg shadow-navy-950/20' : 'bg-transparent'"
        >
            <nav class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
                <a href="#" @click.prevent="goTo('top')" aria-label="Ilody Callcenter">
                    <IlodyLogo theme="dark" compact />
                </a>

                <div class="hidden items-center gap-8 lg:flex">
                    <button
                        v-for="link in navLinks"
                        :key="link.id"
                        @click="goTo(link.id)"
                        class="group relative text-sm font-medium text-navy-100 transition hover:text-white"
                    >
                        {{ link.label }}
                        <span
                            class="absolute -bottom-1.5 left-0 h-px w-0 bg-gold-400 transition-all duration-300 group-hover:w-full"
                        />
                    </button>
                </div>

                <div class="flex items-center gap-3">
                    <div class="hidden items-center rounded-full border border-white/15 p-0.5 sm:flex">
                        <button
                            v-for="l in ['fr', 'nl']"
                            :key="l"
                            @click="setLocale(l)"
                            class="rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition"
                            :class="
                                locale === l
                                    ? 'bg-gold-400 text-navy-900'
                                    : 'text-navy-100 hover:text-white'
                            "
                        >
                            {{ l }}
                        </button>
                    </div>

                    <button
                        @click="goTo('contact')"
                        class="hidden items-center gap-2 rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-lg shadow-gold-400/20 transition hover:bg-gold-300 hover:shadow-gold-400/40 lg:inline-flex"
                    >
                        {{ t('nav.cta') }}
                        <ArrowRight class="size-4" />
                    </button>

                    <button
                        @click="mobileOpen = !mobileOpen"
                        class="grid size-10 place-items-center rounded-full border border-white/15 text-white lg:hidden"
                        aria-label="Menu"
                    >
                        <Menu v-if="!mobileOpen" class="size-5" />
                        <X v-else class="size-5" />
                    </button>
                </div>
            </nav>

            <!-- Menu mobile -->
            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-2"
                leave-active-class="transition duration-150 ease-in"
                leave-to-class="opacity-0 -translate-y-2"
            >
                <div v-if="mobileOpen" class="border-t border-white/10 bg-navy-900/95 backdrop-blur-md lg:hidden">
                    <div class="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
                        <button
                            v-for="link in navLinks"
                            :key="link.id"
                            @click="goTo(link.id)"
                            class="rounded-lg px-3 py-3 text-left text-base font-medium text-navy-100 transition hover:bg-white/5 hover:text-white"
                        >
                            {{ link.label }}
                        </button>
                        <div class="mt-2 flex items-center justify-between px-3">
                            <div class="flex items-center rounded-full border border-white/15 p-0.5">
                                <button
                                    v-for="l in ['fr', 'nl']"
                                    :key="l"
                                    @click="setLocale(l)"
                                    class="rounded-full px-3 py-1 text-xs font-semibold uppercase transition"
                                    :class="locale === l ? 'bg-gold-400 text-navy-900' : 'text-navy-100'"
                                >
                                    {{ l }}
                                </button>
                            </div>
                            <button
                                @click="goTo('contact')"
                                class="inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-2 text-sm font-semibold text-navy-900"
                            >
                                {{ t('nav.cta') }}
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </header>

        <!-- ===================== HERO ===================== -->
        <section id="top" class="relative overflow-hidden bg-navy-800 pt-32 pb-24 lg:pt-40 lg:pb-32">
            <!-- Atmosphère -->
            <div class="pointer-events-none absolute inset-0" aria-hidden="true">
                <div class="absolute -left-32 -top-24 h-96 w-96 rounded-full bg-navy-500/40 blur-[120px]" />
                <div class="absolute right-0 top-1/4 h-[28rem] w-[28rem] rounded-full bg-gold-500/10 blur-[130px]" />
                <div
                    class="absolute inset-0 opacity-[0.04]"
                    style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 56px 56px;"
                />
            </div>

            <div class="relative mx-auto grid max-w-7xl items-center gap-16 px-5 lg:grid-cols-12 lg:px-8">
                <div class="lg:col-span-7">
                    <span
                        class="reveal inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold-300"
                    >
                        <span class="size-1.5 rounded-full bg-gold-400" />
                        {{ t('hero.eyebrow') }}
                    </span>

                    <h1 class="reveal mt-7 font-display text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl" style="transition-delay: 80ms">
                        <span class="block">{{ t('hero.title1') }}</span>
                        <span class="block text-navy-100">{{ t('hero.title2') }}</span>
                        <span class="block">
                            <span class="relative inline-block">
                                {{ t('hero.title3') }}
                                <svg class="absolute -bottom-2 left-0 w-full" height="10" viewBox="0 0 300 10" preserveAspectRatio="none" fill="none">
                                    <path d="M2 7C60 2 240 2 298 7" stroke="#D4AF37" stroke-width="3" stroke-linecap="round" />
                                </svg>
                            </span>
                        </span>
                    </h1>

                    <p class="reveal mt-8 max-w-xl text-lg leading-relaxed text-navy-100" style="transition-delay: 160ms">
                        {{ t('hero.subtitle') }}
                    </p>
                    <p class="reveal mt-4 max-w-xl text-[0.95rem] leading-relaxed text-navy-200/80" style="transition-delay: 200ms">
                        {{ t('hero.desc') }}
                    </p>

                    <div class="reveal mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style="transition-delay: 260ms">
                        <button
                            @click="goTo('contact')"
                            class="group inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-xl shadow-gold-400/20 transition hover:bg-gold-300 hover:shadow-gold-400/40"
                        >
                            {{ t('hero.cta1') }}
                            <ArrowRight class="size-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <button
                            @click="goTo('services')"
                            class="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                        >
                            {{ t('hero.cta2') }}
                        </button>
                    </div>

                    <div class="reveal mt-10 flex flex-wrap gap-x-7 gap-y-3" style="transition-delay: 320ms">
                        <div v-for="k in ['trust1', 'trust2', 'trust3']" :key="k" class="flex items-center gap-2 text-sm text-navy-100">
                            <Check class="size-4 text-gold-400" />
                            {{ t('hero.' + k) }}
                        </div>
                    </div>
                </div>

                <!-- Visuel : carte "campagne en cours" -->
                <div class="reveal lg:col-span-5" style="transition-delay: 240ms">
                    <div class="relative mx-auto max-w-sm">
                        <div class="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-gold-400/20 to-transparent blur-2xl" />
                        <div class="relative rounded-[1.75rem] border border-white/10 bg-navy-700/70 p-6 shadow-2xl backdrop-blur-sm">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2.5">
                                    <span class="grid size-9 place-items-center rounded-xl bg-gold-400/15">
                                        <PhoneCall class="size-4 text-gold-400" />
                                    </span>
                                    <div class="leading-tight">
                                        <p class="text-sm font-semibold text-white">Ilody · Live</p>
                                        <p class="text-[0.7rem] text-navy-200">FR / NL</p>
                                    </div>
                                </div>
                                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-300">
                                    <span class="size-1.5 animate-pulse rounded-full bg-emerald-400" />
                                    En cours
                                </span>
                            </div>

                            <!-- Equalizer -->
                            <div class="mt-6 flex h-16 items-end justify-center gap-1.5">
                                <span v-for="n in 22" :key="n" class="eq-bar w-1.5 rounded-full bg-gold-400/80" :style="{ animationDelay: (n * 90) + 'ms' }" />
                            </div>

                            <div class="mt-6 space-y-3">
                                <div v-for="row in [
                                    { label: 'Leads qualifiés', value: '+38 %' },
                                    { label: 'Rendez-vous fixés', value: '124' },
                                    { label: 'Taux de contact', value: '61 %' },
                                ]" :key="row.label" class="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                                    <span class="text-sm text-navy-100">{{ row.label }}</span>
                                    <span class="font-display text-base font-semibold text-gold-300">{{ row.value }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===================== SERVICES ===================== -->
        <section id="services" class="relative bg-mist py-24 lg:py-32">
            <div class="mx-auto max-w-7xl px-5 lg:px-8">
                <div class="max-w-3xl">
                    <p class="reveal text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
                        {{ t('services.eyebrow') }}
                    </p>
                    <h2 class="reveal mt-4 font-display text-3xl font-semibold leading-tight text-navy-800 sm:text-4xl lg:text-5xl" style="transition-delay: 80ms">
                        {{ t('services.title') }}
                    </h2>
                    <p class="reveal mt-5 text-lg leading-relaxed text-navy-500" style="transition-delay: 140ms">
                        {{ t('services.intro') }}
                    </p>
                </div>

                <div class="mt-14 grid gap-6 lg:grid-cols-2">
                    <article
                        v-for="(svc, i) in services"
                        :key="svc.key"
                        class="reveal group relative flex flex-col overflow-hidden rounded-3xl border border-navy-100/60 bg-white p-8 shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
                        :style="{ transitionDelay: (i * 90) + 'ms' }"
                    >
                        <span class="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gold-400/10 transition group-hover:scale-150" />
                        <div class="relative flex items-center gap-4">
                            <span class="grid size-14 shrink-0 place-items-center rounded-2xl bg-navy-800 text-gold-400 shadow-lg shadow-navy-800/20 transition group-hover:bg-navy-700">
                                <component :is="svc.icon" class="size-6" />
                            </span>
                            <h3 class="font-display text-2xl font-semibold text-navy-800">
                                {{ t('services.' + svc.key + '.title') }}
                            </h3>
                        </div>
                        <p class="relative mt-5 text-[0.95rem] leading-relaxed text-navy-500">
                            {{ t('services.' + svc.key + '.text') }}
                        </p>
                        <ul class="relative mt-6 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                            <li
                                v-for="item in tm('services.' + svc.key + '.items')"
                                :key="item"
                                class="flex items-start gap-2.5 text-sm text-navy-600"
                            >
                                <Check class="mt-0.5 size-4 shrink-0 text-gold-500" />
                                <span>{{ item }}</span>
                            </li>
                        </ul>
                    </article>
                </div>
            </div>
        </section>

        <!-- ===================== POURQUOI ===================== -->
        <section id="why" class="relative overflow-hidden bg-navy-800 py-24 lg:py-32">
            <div class="pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true"
                style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 56px 56px;" />
            <div class="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-gold-500/10 blur-[130px]" aria-hidden="true" />

            <div class="relative mx-auto max-w-7xl px-5 lg:px-8">
                <div class="max-w-3xl">
                    <p class="reveal text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                        {{ t('why.eyebrow') }}
                    </p>
                    <h2 class="reveal mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl" style="transition-delay: 80ms">
                        {{ t('why.title') }}
                    </h2>
                    <p class="reveal mt-5 text-lg leading-relaxed text-navy-100" style="transition-delay: 140ms">
                        {{ t('why.intro') }}
                    </p>
                </div>

                <div class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="(item, i) in whyItems"
                        :key="i"
                        class="reveal group rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-gold-400/40 hover:bg-white/[0.06]"
                        :class="i === 4 ? 'lg:col-span-1' : ''"
                        :style="{ transitionDelay: (i * 80) + 'ms' }"
                    >
                        <span class="grid size-12 place-items-center rounded-xl bg-gold-400/10 text-gold-400 ring-1 ring-gold-400/20">
                            <component :is="whyIcons[i]" class="size-5" />
                        </span>
                        <h3 class="mt-5 font-display text-xl font-semibold text-white">{{ item.title }}</h3>
                        <p class="mt-2.5 text-sm leading-relaxed text-navy-200">{{ item.text }}</p>
                    </div>

                    <!-- Carte CTA -->
                    <div class="reveal flex flex-col justify-between rounded-2xl bg-gold-400 p-7 text-navy-900" style="transition-delay: 400ms">
                        <MessagesSquare class="size-8" />
                        <div class="mt-6">
                            <p class="font-display text-xl font-semibold leading-snug">{{ t('hero.title1') }} {{ t('hero.title3') }}</p>
                            <button
                                @click="goTo('contact')"
                                class="mt-5 inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800"
                            >
                                {{ t('nav.cta') }}
                                <ArrowUpRight class="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===================== SECTEURS ===================== -->
        <section id="sectors" class="bg-white py-24 lg:py-32">
            <div class="mx-auto max-w-7xl px-5 lg:px-8">
                <div class="grid gap-12 lg:grid-cols-12 lg:items-center">
                    <div class="lg:col-span-5">
                        <p class="reveal text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">
                            {{ t('sectors.eyebrow') }}
                        </p>
                        <h2 class="reveal mt-4 font-display text-3xl font-semibold leading-tight text-navy-800 sm:text-4xl lg:text-5xl" style="transition-delay: 80ms">
                            {{ t('sectors.title') }}
                        </h2>
                        <p class="reveal mt-5 text-lg leading-relaxed text-navy-500" style="transition-delay: 140ms">
                            {{ t('sectors.intro') }}
                        </p>
                        <div class="reveal mt-8 h-px w-24 bg-gradient-to-r from-gold-400 to-transparent" style="transition-delay: 180ms" />
                    </div>

                    <div class="lg:col-span-7">
                        <div class="grid gap-4 sm:grid-cols-2">
                            <div
                                v-for="(sector, i) in sectorItems"
                                :key="i"
                                class="reveal group flex items-center gap-4 rounded-2xl border border-navy-100/70 bg-mist/60 px-5 py-4 transition hover:border-gold-400/50 hover:bg-white hover:shadow-[var(--shadow-soft)]"
                                :style="{ transitionDelay: (i * 60) + 'ms' }"
                            >
                                <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-navy-800 text-gold-400 transition group-hover:bg-navy-700">
                                    <component :is="sectorIcons[i]" class="size-5" />
                                </span>
                                <span class="font-medium text-navy-700">{{ sector }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===================== CONTACT ===================== -->
        <section id="contact" class="relative overflow-hidden bg-navy-900 py-24 lg:py-32">
            <div class="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-navy-500/30 blur-[130px]" aria-hidden="true" />
            <div class="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-gold-500/10 blur-[120px]" aria-hidden="true" />

            <div class="relative mx-auto max-w-7xl px-5 lg:px-8">
                <div class="grid gap-14 lg:grid-cols-12">
                    <!-- Colonne texte -->
                    <div class="lg:col-span-5">
                        <p class="reveal text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                            {{ t('contact.eyebrow') }}
                        </p>
                        <h2 class="reveal mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl" style="transition-delay: 80ms">
                            {{ t('contact.title') }}
                        </h2>
                        <p class="reveal mt-5 max-w-md text-lg leading-relaxed text-navy-100" style="transition-delay: 140ms">
                            {{ t('contact.intro') }}
                        </p>

                        <div class="reveal mt-9 space-y-4" style="transition-delay: 200ms">
                            <a :href="'mailto:' + contactEmail" class="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-gold-400/40 hover:bg-white/[0.06]">
                                <span class="grid size-12 place-items-center rounded-xl bg-gold-400/10 text-gold-400 ring-1 ring-gold-400/20">
                                    <Mail class="size-5" />
                                </span>
                                <div class="leading-tight">
                                    <p class="text-xs uppercase tracking-wide text-navy-200">{{ t('contact.emailLabel') }}</p>
                                    <p class="font-medium text-white transition group-hover:text-gold-300">{{ contactEmail }}</p>
                                </div>
                            </a>
                            <div class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <span class="grid size-12 place-items-center rounded-xl bg-gold-400/10 text-gold-400 ring-1 ring-gold-400/20">
                                    <Languages class="size-5" />
                                </span>
                                <div class="leading-tight">
                                    <p class="text-xs uppercase tracking-wide text-navy-200">{{ t('contact.langLabel') }}</p>
                                    <p class="font-medium text-white">{{ t('contact.langValue') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Formulaire -->
                    <div class="reveal lg:col-span-7" style="transition-delay: 160ms">
                        <div class="rounded-3xl border border-white/10 bg-white p-7 shadow-2xl sm:p-9">
                            <Transition
                                enter-active-class="transition duration-500 ease-out"
                                enter-from-class="opacity-0 scale-95"
                            >
                                <div v-if="submitted" class="flex min-h-[24rem] flex-col items-center justify-center text-center">
                                    <span class="grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-500">
                                        <Check class="size-8" />
                                    </span>
                                    <p class="mt-6 max-w-sm font-display text-2xl font-semibold text-navy-800">
                                        {{ t('contact.form.success') }}
                                    </p>
                                    <a :href="'mailto:' + contactEmail" class="mt-6 text-sm font-semibold text-gold-600 hover:underline">
                                        {{ contactEmail }}
                                    </a>
                                </div>

                                <form v-else @submit.prevent="submit" class="space-y-5">
                                    <!-- honeypot -->
                                    <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />

                                    <div class="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label class="mb-1.5 block text-sm font-medium text-navy-700">
                                                {{ t('contact.form.name') }} <span class="text-gold-500">*</span>
                                            </label>
                                            <input
                                                v-model="form.name"
                                                type="text"
                                                required
                                                class="w-full rounded-xl border border-navy-100 bg-mist/50 px-4 py-3 text-navy-800 outline-none transition focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-400/15"
                                            />
                                            <p v-if="form.errors.name" class="mt-1 text-xs text-red-500">{{ form.errors.name }}</p>
                                        </div>
                                        <div>
                                            <label class="mb-1.5 block text-sm font-medium text-navy-700">{{ t('contact.form.company') }}</label>
                                            <input
                                                v-model="form.company"
                                                type="text"
                                                class="w-full rounded-xl border border-navy-100 bg-mist/50 px-4 py-3 text-navy-800 outline-none transition focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-400/15"
                                            />
                                        </div>
                                    </div>

                                    <div class="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label class="mb-1.5 block text-sm font-medium text-navy-700">
                                                {{ t('contact.form.email') }} <span class="text-gold-500">*</span>
                                            </label>
                                            <input
                                                v-model="form.email"
                                                type="email"
                                                required
                                                class="w-full rounded-xl border border-navy-100 bg-mist/50 px-4 py-3 text-navy-800 outline-none transition focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-400/15"
                                            />
                                            <p v-if="form.errors.email" class="mt-1 text-xs text-red-500">{{ form.errors.email }}</p>
                                        </div>
                                        <div>
                                            <label class="mb-1.5 block text-sm font-medium text-navy-700">{{ t('contact.form.phone') }}</label>
                                            <input
                                                v-model="form.phone"
                                                type="tel"
                                                class="w-full rounded-xl border border-navy-100 bg-mist/50 px-4 py-3 text-navy-800 outline-none transition focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-400/15"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label class="mb-1.5 block text-sm font-medium text-navy-700">{{ t('contact.form.service') }}</label>
                                        <select
                                            v-model="form.service"
                                            class="w-full rounded-xl border border-navy-100 bg-mist/50 px-4 py-3 text-navy-800 outline-none transition focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-400/15"
                                        >
                                            <option value="">{{ t('contact.form.servicePlaceholder') }}</option>
                                            <option v-for="opt in serviceOptions" :key="opt" :value="opt">{{ opt }}</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label class="mb-1.5 block text-sm font-medium text-navy-700">
                                            {{ t('contact.form.message') }} <span class="text-gold-500">*</span>
                                        </label>
                                        <textarea
                                            v-model="form.message"
                                            required
                                            rows="4"
                                            :placeholder="t('contact.form.messagePlaceholder')"
                                            class="w-full resize-none rounded-xl border border-navy-100 bg-mist/50 px-4 py-3 text-navy-800 outline-none transition placeholder:text-navy-300 focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-400/15"
                                        />
                                        <p v-if="form.errors.message" class="mt-1 text-xs text-red-500">{{ form.errors.message }}</p>
                                    </div>

                                    <div class="flex items-center justify-between gap-4 pt-1">
                                        <p class="text-xs text-navy-400"><span class="text-gold-500">*</span> {{ t('contact.form.required') }}</p>
                                        <button
                                            type="submit"
                                            :disabled="form.processing"
                                            class="inline-flex items-center gap-2 rounded-full bg-navy-800 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-navy-800/20 transition hover:bg-navy-700 disabled:opacity-60"
                                        >
                                            {{ form.processing ? t('contact.form.sending') : t('contact.form.submit') }}
                                            <ArrowRight v-if="!form.processing" class="size-4" />
                                        </button>
                                    </div>
                                </form>
                            </Transition>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===================== FOOTER ===================== -->
        <footer class="bg-navy-950 pt-16 pb-8">
            <div class="mx-auto max-w-7xl px-5 lg:px-8">
                <div class="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-12">
                    <div class="lg:col-span-5">
                        <IlodyLogo theme="dark" />
                        <p class="mt-5 max-w-xs font-display text-lg leading-snug text-navy-100">
                            {{ t('footer.tagline') }}
                        </p>
                        <a :href="'mailto:' + contactEmail" class="mt-5 inline-flex items-center gap-2 text-sm text-navy-200 transition hover:text-gold-300">
                            <Mail class="size-4" /> {{ contactEmail }}
                        </a>
                    </div>

                    <div class="lg:col-span-3 lg:col-start-8">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">{{ t('footer.services') }}</p>
                        <ul class="mt-4 space-y-2.5">
                            <li v-for="svc in services" :key="svc.key">
                                <button @click="goTo('services')" class="text-sm text-navy-100 transition hover:text-white">
                                    {{ t('services.' + svc.key + '.title') }}
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div class="lg:col-span-2">
                        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">{{ t('footer.navigate') }}</p>
                        <ul class="mt-4 space-y-2.5">
                            <li v-for="link in navLinks" :key="link.id">
                                <button @click="goTo(link.id)" class="text-sm text-navy-100 transition hover:text-white">
                                    {{ link.label }}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-col items-center justify-between gap-3 pt-6 text-xs text-navy-300 sm:flex-row">
                    <p>© {{ new Date().getFullYear() }} Ilody Callcenter. {{ t('footer.rights') }}</p>
                    <p class="flex items-center gap-2">
                        <span class="inline-flex items-center gap-1.5"><Phone class="size-3.5 text-gold-400" /> FR / NL</span>
                    </p>
                </div>
            </div>
        </footer>
    </div>
</template>

<style scoped>
.eq-bar {
    height: 20%;
    animation: eq 1.1s ease-in-out infinite alternate;
}
@keyframes eq {
    0% { height: 15%; opacity: 0.5; }
    100% { height: 100%; opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
    .eq-bar { animation: none; height: 55%; }
}
</style>
