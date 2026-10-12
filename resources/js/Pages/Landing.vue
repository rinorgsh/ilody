<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue';
import { Head, useForm, usePage } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import IlodyLogo from '../components/IlodyLogo.vue';
import HeroCall from '../components/HeroCall.vue';
import {
    Target,
    PhoneCall,
    Megaphone,
    GraduationCap,
    HardHat,
    Zap,
    Building2,
    Coins,
    Signal,
    ShieldCheck,
    Briefcase,
    Check,
    ChevronDown,
    Mail,
    Menu,
    X,
} from 'lucide-vue-next';

const { t, tm, locale } = useI18n();
const page = usePage();

/* ---------- Langue ---------- */
const locales = ['fr', 'nl'];
function setLocale(l) {
    locale.value = l;
    localStorage.setItem('ilody_locale', l);
    document.documentElement.lang = l;
}

/* ---------- Navigation ---------- */
const mobileOpen = ref(false);
const scrolled = ref(false);
function onScroll() {
    scrolled.value = window.scrollY > 16;
}
watch(mobileOpen, (open) => {
    document.body.style.overflow = open ? 'hidden' : '';
});

function goTo(id) {
    mobileOpen.value = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const navLinks = computed(() => [
    { id: 'services', label: t('nav.services') },
    { id: 'why', label: t('nav.why') },
    { id: 'sectors', label: t('nav.sectors') },
    { id: 'contact', label: t('nav.contact') },
]);

/* ---------- Barre d'action mobile : visible entre le hero et le formulaire ---------- */
const heroCta = ref(null);
const contactSection = ref(null);
const heroCtaVisible = ref(true);
const contactVisible = ref(false);
const showStickyCta = computed(() => !heroCtaVisible.value && !contactVisible.value && !mobileOpen.value);

let observer;
onMounted(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.lang = locale.value;

    observer = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.target === heroCta.value) heroCtaVisible.value = e.isIntersecting;
            if (e.target === contactSection.value) contactVisible.value = e.isIntersecting;
        });
    });
    observer.observe(heroCta.value);
    observer.observe(contactSection.value);
});
onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll);
    observer?.disconnect();
    document.body.style.overflow = '';
});

/* ---------- Services ---------- */
const services = [
    { key: 'leadgen', icon: Target },
    { key: 'callcenter', icon: PhoneCall },
    { key: 'marketing', icon: Megaphone },
    { key: 'training', icon: GraduationCap },
];
const activeService = ref(0);
function selectService(i) {
    // Sur mobile c'est un accordéon (on peut refermer) ; sur desktop, un panneau reste toujours ouvert.
    const desktop = window.matchMedia('(min-width: 1024px)').matches;
    activeService.value = !desktop && activeService.value === i ? -1 : i;
}

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

const serviceOptions = computed(() => services.map((s) => t('services.' + s.key + '.title')));

function submit() {
    form.post('/contact', {
        preserveScroll: true,
        onSuccess: () => {
            submitted.value = true;
            form.reset();
        },
    });
}
</script>

<template>
    <Head :title="'Ilody Callcenter — ' + t('hero.title1') + ' ' + t('hero.title2')" />

    <div class="min-h-screen bg-paper font-sans text-ink antialiased">
        <!-- ===================== NAV ===================== -->
        <header
            class="fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300"
            :class="scrolled || mobileOpen ? 'border-line bg-paper/90 backdrop-blur-md' : 'border-transparent'"
        >
            <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 lg:h-20 lg:px-8">
                <a href="#top" @click.prevent="goTo('top')" class="shrink-0 rounded-lg">
                    <IlodyLogo class="h-9 w-auto lg:h-10" />
                </a>

                <div class="hidden items-center gap-8 lg:flex">
                    <a
                        v-for="link in navLinks"
                        :key="link.id"
                        :href="'#' + link.id"
                        @click.prevent="goTo(link.id)"
                        class="text-[0.95rem] font-medium text-ink underline-offset-8 decoration-2 decoration-apricot hover:underline"
                    >
                        {{ link.label }}
                    </a>
                </div>

                <div class="flex items-center gap-2 sm:gap-3">
                    <div class="flex items-center rounded-full border border-line bg-white p-1" role="group" :aria-label="t('menu.language')">
                        <button
                            v-for="l in locales"
                            :key="l"
                            @click="setLocale(l)"
                            :aria-pressed="locale === l"
                            class="min-w-9 rounded-full px-2.5 py-1.5 text-xs font-semibold uppercase transition-colors"
                            :class="locale === l ? 'bg-ink text-white' : 'text-muted hover:text-ink'"
                        >
                            {{ l }}
                        </button>
                    </div>

                    <button @click="goTo('contact')" class="btn btn-primary hidden lg:inline-flex">
                        {{ t('nav.cta') }}
                    </button>

                    <button
                        @click="mobileOpen = !mobileOpen"
                        class="grid size-11 place-items-center rounded-full bg-ink text-white lg:hidden"
                        :aria-label="mobileOpen ? t('menu.close') : t('menu.open')"
                        :aria-expanded="mobileOpen"
                    >
                        <X v-if="mobileOpen" class="size-5" />
                        <Menu v-else class="size-5" />
                    </button>
                </div>
            </nav>
        </header>

        <!-- Menu mobile plein écran -->
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            leave-active-class="transition duration-150 ease-in"
            leave-to-class="opacity-0"
        >
            <div v-if="mobileOpen" class="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-paper px-5 pt-20 pb-8 lg:hidden">
                <ul class="mt-4">
                    <li v-for="link in navLinks" :key="link.id" class="border-b border-line">
                        <a
                            :href="'#' + link.id"
                            @click.prevent="goTo(link.id)"
                            class="block py-5 font-display text-4xl font-bold tracking-tight text-ink"
                        >
                            {{ link.label }}
                        </a>
                    </li>
                </ul>
                <div class="mt-auto flex flex-col gap-4 pt-10">
                    <button @click="goTo('contact')" class="btn btn-primary w-full">{{ t('nav.cta') }}</button>
                    <a :href="'mailto:' + contactEmail" class="flex items-center justify-center gap-2 py-2 text-sm font-medium text-muted">
                        <Mail class="size-4" /> {{ contactEmail }}
                    </a>
                </div>
            </div>
        </Transition>

        <main>
            <!-- ===================== HERO ===================== -->
            <section id="top" class="relative overflow-hidden pt-28 pb-16 lg:pt-40 lg:pb-28">
                <div class="mx-auto max-w-6xl px-5 lg:px-8">
                    <h1 class="font-display text-[clamp(2.6rem,7.4vw,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.025em] text-balance">
                        <span class="block">{{ t('hero.title1') }}</span>
                        <span class="block">{{ t('hero.title2') }}</span>
                        <span class="block">{{ t('hero.title3') }}</span>
                    </h1>

                    <div class="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-16">
                        <div class="lg:col-span-6">
                            <p class="max-w-xl text-lg leading-relaxed text-muted lg:text-xl">
                                {{ t('hero.subtitle') }}
                            </p>

                            <div ref="heroCta" class="mt-8 flex flex-col gap-3 sm:flex-row">
                                <button @click="goTo('contact')" class="btn btn-primary">{{ t('hero.cta1') }}</button>
                                <button @click="goTo('services')" class="btn btn-ghost">{{ t('hero.cta2') }}</button>
                            </div>

                            <ul class="mt-10 space-y-3 border-t border-line pt-8">
                                <li v-for="k in ['trust1', 'trust2', 'trust3']" :key="k" class="flex items-center gap-3 font-medium">
                                    <span class="grid size-6 shrink-0 place-items-center rounded-full bg-cobalt-100 text-cobalt">
                                        <Check class="size-3.5" stroke-width="3" />
                                    </span>
                                    {{ t('hero.' + k) }}
                                </li>
                            </ul>
                        </div>

                        <div class="lg:col-span-6 lg:-mt-2">
                            <HeroCall class="mx-auto max-w-md lg:mr-0" />
                        </div>
                    </div>
                </div>
            </section>

            <!-- ===================== SERVICES ===================== -->
            <section id="services" class="bg-white py-20 lg:py-28">
                <div class="mx-auto max-w-6xl px-5 lg:px-8">
                    <div class="max-w-2xl">
                        <h2 class="font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance sm:text-4xl lg:text-5xl">
                            {{ t('services.title') }}
                        </h2>
                        <p class="mt-5 text-lg leading-relaxed text-muted">{{ t('services.intro') }}</p>
                    </div>

                    <!-- Accordéon sur mobile ; liste + panneau côte à côte sur desktop (même balisage) -->
                    <div class="mt-10 border-t border-line lg:mt-14 lg:grid lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:grid-rows-[repeat(4,auto)_1fr] lg:gap-x-14 lg:border-t-0">
                        <template v-for="(svc, i) in services" :key="svc.key">
                            <h3 class="border-b border-line lg:col-start-1" :class="i === 0 ? 'lg:border-t' : ''" :style="{ gridRow: i + 1 }">
                                <button
                                    :id="'svc-tab-' + svc.key"
                                    @click="selectService(i)"
                                    :aria-expanded="activeService === i"
                                    :aria-controls="'svc-panel-' + svc.key"
                                    class="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-xl font-bold leading-tight tracking-tight transition-colors lg:py-6 lg:text-2xl"
                                    :class="activeService === i ? 'text-cobalt' : 'text-ink hover:text-cobalt'"
                                >
                                    <span class="flex items-center gap-4">
                                        <component :is="svc.icon" class="size-6 shrink-0" />
                                        {{ t('services.' + svc.key + '.title') }}
                                    </span>
                                    <ChevronDown
                                        class="size-5 shrink-0 transition-transform lg:hidden"
                                        :class="activeService === i ? 'rotate-180' : ''"
                                    />
                                </button>
                            </h3>
                            <div
                                v-show="activeService === i"
                                :id="'svc-panel-' + svc.key"
                                role="region"
                                :aria-labelledby="'svc-tab-' + svc.key"
                                class="border-b border-line pt-1 pb-7 lg:col-start-2 lg:row-span-5 lg:row-start-1 lg:rounded-[1.75rem] lg:border-0 lg:bg-paper lg:p-10"
                            >
                                <p class="max-w-xl leading-relaxed text-muted lg:text-lg">
                                    {{ t('services.' + svc.key + '.text') }}
                                </p>
                                <ul class="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:mt-8">
                                    <li
                                        v-for="item in tm('services.' + svc.key + '.items')"
                                        :key="item"
                                        class="flex items-start gap-3 font-medium"
                                    >
                                        <Check class="mt-1 size-4 shrink-0 text-cobalt" stroke-width="3" />
                                        <span>{{ item }}</span>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </div>
                </div>
            </section>

            <!-- ===================== POURQUOI ===================== -->
            <section id="why" class="on-dark bg-cobalt py-20 text-white lg:py-28">
                <div class="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-12 lg:gap-16 lg:px-8">
                    <div class="lg:col-span-5">
                        <div class="lg:sticky lg:top-28">
                            <h2 class="font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance sm:text-4xl lg:text-5xl">
                                {{ t('why.title') }}
                            </h2>
                            <p class="mt-5 max-w-md text-lg leading-relaxed text-white/85">{{ t('why.intro') }}</p>
                            <button @click="goTo('contact')" class="btn btn-apricot mt-8 hidden lg:inline-flex">
                                {{ t('nav.cta') }}
                            </button>
                        </div>
                    </div>

                    <dl class="border-t border-white/25 lg:col-span-7">
                        <div v-for="(item, i) in whyItems" :key="i" class="border-b border-white/25 py-6 lg:py-7">
                            <dt class="font-display text-xl font-bold tracking-tight lg:text-2xl">{{ item.title }}</dt>
                            <dd class="mt-2 max-w-lg leading-relaxed text-white/85">{{ item.text }}</dd>
                        </div>
                    </dl>
                </div>
            </section>

            <!-- ===================== SECTEURS ===================== -->
            <section id="sectors" class="py-20 lg:py-28">
                <div class="mx-auto max-w-6xl px-5 lg:px-8">
                    <div class="max-w-2xl">
                        <h2 class="font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance sm:text-4xl lg:text-5xl">
                            {{ t('sectors.title') }}
                        </h2>
                        <p class="mt-5 text-lg leading-relaxed text-muted">{{ t('sectors.intro') }}</p>
                    </div>

                    <ul class="mt-10 flex flex-wrap gap-2.5 lg:mt-14 lg:gap-4">
                        <li
                            v-for="(sector, i) in sectorItems"
                            :key="i"
                            class="flex items-center gap-3 rounded-full border border-line bg-white py-2.5 pr-5 pl-3 font-display text-base font-semibold tracking-tight lg:py-3.5 lg:pr-8 lg:pl-4 lg:text-2xl"
                        >
                            <span class="grid size-8 shrink-0 place-items-center rounded-full bg-apricot-100 lg:size-11">
                                <component :is="sectorIcons[i]" class="size-4 lg:size-5" />
                            </span>
                            {{ sector }}
                        </li>
                    </ul>
                </div>
            </section>

            <!-- ===================== CONTACT ===================== -->
            <section id="contact" ref="contactSection" class="on-dark bg-ink py-20 text-white lg:py-28">
                <div class="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-12 lg:gap-16 lg:px-8">
                    <div class="lg:col-span-5">
                        <h2 class="font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance sm:text-4xl lg:text-5xl">
                            {{ t('contact.title') }}
                        </h2>
                        <p class="mt-5 max-w-md text-lg leading-relaxed text-white/75">{{ t('contact.intro') }}</p>

                        <dl class="mt-8 space-y-5 border-t border-white/15 pt-8">
                            <div>
                                <dt class="text-sm text-white/60">{{ t('contact.emailLabel') }}</dt>
                                <dd class="mt-1">
                                    <a
                                        :href="'mailto:' + contactEmail"
                                        class="font-display text-lg font-semibold break-all underline decoration-apricot decoration-2 underline-offset-4 hover:text-apricot sm:text-xl"
                                    >
                                        {{ contactEmail }}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm text-white/60">{{ t('contact.langLabel') }}</dt>
                                <dd class="mt-1 font-display text-lg font-semibold sm:text-xl">{{ t('contact.langValue') }}</dd>
                            </div>
                        </dl>
                    </div>

                    <div class="lg:col-span-7">
                        <div class="rounded-[1.75rem] bg-white p-5 text-ink sm:p-9">
                            <div
                                v-if="submitted"
                                class="flex min-h-[22rem] flex-col items-center justify-center text-center"
                                role="status"
                            >
                                <span class="grid size-14 place-items-center rounded-full bg-cobalt text-white">
                                    <Check class="size-7" stroke-width="3" />
                                </span>
                                <p class="mt-6 max-w-sm font-display text-2xl font-bold leading-tight tracking-tight">
                                    {{ t('contact.form.success') }}
                                </p>
                                <a :href="'mailto:' + contactEmail" class="mt-5 font-semibold text-cobalt hover:underline">
                                    {{ contactEmail }}
                                </a>
                            </div>

                            <form v-else @submit.prevent="submit" class="space-y-5">
                                <!-- honeypot -->
                                <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" class="hidden" aria-hidden="true" />

                                <div class="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label for="f-name" class="field-label">
                                            {{ t('contact.form.name') }} <span class="text-cobalt">*</span>
                                        </label>
                                        <input id="f-name" v-model="form.name" type="text" required autocomplete="name" class="field" />
                                        <p v-if="form.errors.name" class="mt-1.5 text-sm text-red-600">{{ form.errors.name }}</p>
                                    </div>
                                    <div>
                                        <label for="f-company" class="field-label">{{ t('contact.form.company') }}</label>
                                        <input id="f-company" v-model="form.company" type="text" autocomplete="organization" class="field" />
                                    </div>
                                </div>

                                <div class="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label for="f-email" class="field-label">
                                            {{ t('contact.form.email') }} <span class="text-cobalt">*</span>
                                        </label>
                                        <input id="f-email" v-model="form.email" type="email" required autocomplete="email" class="field" />
                                        <p v-if="form.errors.email" class="mt-1.5 text-sm text-red-600">{{ form.errors.email }}</p>
                                    </div>
                                    <div>
                                        <label for="f-phone" class="field-label">{{ t('contact.form.phone') }}</label>
                                        <input id="f-phone" v-model="form.phone" type="tel" autocomplete="tel" class="field" />
                                    </div>
                                </div>

                                <div>
                                    <label for="f-service" class="field-label">{{ t('contact.form.service') }}</label>
                                    <select id="f-service" v-model="form.service" class="field">
                                        <option value="">{{ t('contact.form.servicePlaceholder') }}</option>
                                        <option v-for="opt in serviceOptions" :key="opt" :value="opt">{{ opt }}</option>
                                    </select>
                                </div>

                                <div>
                                    <label for="f-message" class="field-label">
                                        {{ t('contact.form.message') }} <span class="text-cobalt">*</span>
                                    </label>
                                    <textarea
                                        id="f-message"
                                        v-model="form.message"
                                        required
                                        rows="4"
                                        :placeholder="t('contact.form.messagePlaceholder')"
                                        class="field resize-none"
                                    />
                                    <p v-if="form.errors.message" class="mt-1.5 text-sm text-red-600">{{ form.errors.message }}</p>
                                </div>

                                <div class="flex flex-col-reverse gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                                    <p class="text-sm text-muted"><span class="text-cobalt">*</span> {{ t('contact.form.required') }}</p>
                                    <button type="submit" :disabled="form.processing" class="btn btn-primary w-full disabled:opacity-60 sm:w-auto">
                                        {{ form.processing ? t('contact.form.sending') : t('contact.form.submit') }}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- ===================== FOOTER ===================== -->
        <footer class="on-dark border-t border-white/10 bg-ink pt-14 pb-28 text-white lg:pt-16 lg:pb-10">
            <div class="mx-auto max-w-6xl px-5 lg:px-8">
                <div class="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-12">
                    <div class="sm:col-span-2 lg:col-span-6">
                        <IlodyLogo on-dark class="h-14 w-auto" />
                        <p class="mt-6 max-w-xs font-display text-xl font-semibold leading-snug tracking-tight">
                            {{ t('footer.tagline') }}
                        </p>
                    </div>

                    <div class="lg:col-span-3">
                        <p class="text-sm text-white/60">{{ t('footer.services') }}</p>
                        <ul class="mt-4 space-y-3">
                            <li v-for="(svc, i) in services" :key="svc.key">
                                <a
                                    href="#services"
                                    @click.prevent="activeService = i; goTo('services')"
                                    class="text-white/90 hover:text-apricot"
                                >
                                    {{ t('services.' + svc.key + '.title') }}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div class="lg:col-span-3">
                        <p class="text-sm text-white/60">{{ t('footer.navigate') }}</p>
                        <ul class="mt-4 space-y-3">
                            <li v-for="link in navLinks" :key="link.id">
                                <a :href="'#' + link.id" @click.prevent="goTo(link.id)" class="text-white/90 hover:text-apricot">
                                    {{ link.label }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
                    <p>© {{ new Date().getFullYear() }} Ilody Callcenter. {{ t('footer.rights') }}</p>
                    <a :href="'mailto:' + contactEmail" class="break-all hover:text-apricot">{{ contactEmail }}</a>
                </div>
            </div>
        </footer>

        <!-- Barre d'action mobile -->
        <div
            class="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 lg:hidden"
            :class="showStickyCta ? 'translate-y-0' : 'translate-y-full'"
            :inert="!showStickyCta"
        >
            <button @click="goTo('contact')" class="btn btn-primary w-full">{{ t('nav.cta') }}</button>
        </div>
    </div>
</template>
