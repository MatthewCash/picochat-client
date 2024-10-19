<script setup lang="ts">
import ServerConnect from './components/ServerConnect.vue';
import ChatWindow from './components/ChatWindow.vue';
</script>

<template>
    <div class="flex flex-col gap-8 h-full">
        <ServerConnect />
        <div class="min-h-0 max-h-100 h-full">
            <ChatWindow />
        </div>
    </div>
</template>
