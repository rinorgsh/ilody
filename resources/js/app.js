import '../css/app.css';

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createI18n } from 'vue-i18n';
import { messages, defaultLocale } from './i18n';

const i18n = createI18n({
    legacy: false,
    locale: localStorage.getItem('ilody_locale') || defaultLocale,
    fallbackLocale: 'fr',
    messages,
});

createInertiaApp({
    title: (title) => (title ? `${title} · Ilody Callcenter` : 'Ilody Callcenter'),
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(i18n)
            .mount(el);
    },
    progress: {
        color: '#D4AF37',
        showSpinner: false,
    },
});
