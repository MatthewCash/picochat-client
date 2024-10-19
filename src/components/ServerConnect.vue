<script setup lang="ts">
import { ref } from 'vue';
import { connect, wsConnected } from '../chat';

const serverAddr = ref('');
const username = ref('');
</script>

<template>
    <div>
        <h2 class="font-bold text-center text-3xl mb-4">
            🎃 {{ wsConnected ? 'Connected' : 'Disconnected' }}
        </h2>
        <form action="" class="flex flex-wrap gap-3 justify-center">
            <input
                class="border-2 border-accent-500 py-2 px-4 rounded-full"
                type="text"
                placeholder="Server Address"
                v-model="serverAddr"
            />
            <input
                class="border-2 border-accent-500 py-2 px-4 rounded-full"
                type="text"
                placeholder="Your Name"
                v-model="username"
            />
            <button
                class="bg-accent-500 disabled:opacity-60 enabled:hover:bg-accent-700 text-white font-bold py-2 p-4 rounded-full"
                :disabled="!serverAddr || !username"
                @click.stop.prevent="connect(serverAddr, username)"
            >
                {{ wsConnected ? 'Reconnect' : 'Connect' }}
            </button>
        </form>
    </div>
</template>
