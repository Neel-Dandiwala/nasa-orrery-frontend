<template>
    <div>
        <h1 title="Error"></h1>

        <div class="flex items-center justify-center h-screen">
            <h1 class="text-8xl font-bold">404</h1>
            <NuxtLink to="/" class="btn btn-primary ml-12">Go home &gt;</NuxtLink>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        error: {
            type: [Object, Error],
            default: () => {},
        },
    },
};
</script>
