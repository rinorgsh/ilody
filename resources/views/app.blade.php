<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f6f5fb">
    <meta name="description" content="Ilody Callcenter — Génération de leads qualifiés, centre d'appels FR/NL, campagnes publicitaires et formation commerciale.">

    <title inertia>{{ config('app.name', 'Ilody Callcenter') }}</title>

    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    @vite(['resources/js/app.js'])
    @inertiaHead
</head>
<body class="antialiased">
    @inertia
</body>
</html>
