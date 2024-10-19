<script setup lang="ts">
import { ref } from 'vue';
import {
    messages,
    wsConnected,
    sendChat,
    uploadFile,
    downloadFile
} from '../chat';

const text = ref('');
const destination = ref('');
</script>

<template>
    <div class="h-full flex flex-col gap-4 items-stretch">
        <div
            class="flex flex-col-reverse h-full border-2 border-gray-300 rounded-lg p-3 overflow-y-auto"
        >
            <div v-for="(message, i) in messages" :key="i" class="flex gap-2">
                <span class="font-bold"
                    >{{ message.sender_name }}
                    <span v-if="message.destination_name"
                        >🡒 {{ message.destination_name }}</span
                    ></span
                >

                <div v-if="message.content.type === 'ChatMessage'">
                    <span class="font-mono">{{ message.content.text }}</span>
                </div>
                <div v-if="message.content.type === 'FileMessage'">
                    <span
                        class="font-mono text-accent-500 underline cursor-pointer"
                        @click="downloadFile(message.content)"
                        >{{ message.content.filename }}</span
                    >
                </div>
            </div>
        </div>
        <form class="flex flex-wrap gap-3 justify-center">
            <div class="flex border-2 border-accent-500 rounded-full grow">
                <input
                    class="py-2 px-4 rounded-full flex-grow"
                    type="text"
                    placeholder="Message Content"
                    v-model="text"
                />
                <label
                    class="rounded-full bg-accent-500 p-1 m-1"
                    :class="
                        wsConnected
                            ? 'hover:bg-accent-700 cursor-pointer'
                            : 'opacity-60'
                    "
                    for="file-upload"
                >
                    📂</label
                >
                <input
                    class="hidden"
                    type="file"
                    id="file-upload"
                    :disabled="!wsConnected"
                    @input="
                        uploadFile(
                            (<HTMLInputElement>$event?.target)?.files?.[0]!,
                            destination
                        )
                    "
                />
            </div>
            <input
                class="border-2 border-accent-500 py-2 px-4 rounded-full"
                type="text"
                placeholder="Destination (optional)"
                v-model="destination"
            />
            <button
                class="bg-accent-500 disabled:opacity-60 enabled:hover:bg-accent-700 text-white font-bold py-2 p-4 rounded-full"
                :disabled="!text || !wsConnected"
                @click.stop.prevent="
                    sendChat(text, destination);
                    text = '';
                "
            >
                Send
            </button>
        </form>
    </div>
</template>
