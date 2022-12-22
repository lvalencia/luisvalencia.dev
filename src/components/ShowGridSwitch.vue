<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useGrid } from '../stores/useGrid';

export default {
    methods: {
        ...mapActions(useGrid, ['toggleVisbility']),
    },
    computed: {
        ...mapState(useGrid, ['gridState', 'isVisible']),
    }
}
</script>

<template>
    <button class="toggle-grid" :class="{ visible: isVisible }" @click="toggleVisbility">
        <font-awesome-icon icon="fa-solid fa-pen" class="no-grid-icon" />
        <font-awesome-icon icon="fa-solid fa-pen-ruler" class="grid-icon" />
    </button>
</template>

<style scoped lang="scss">
button {
    background: transparent;
    border: none;
    cursor: pointer;
}

.toggle-grid {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    max-height: 32px;
    max-width: 40px;
    font-size: 1em;

    &>* {
        display: none;
    }

    .no-grid-icon {
        display: block;
    }

    &.visible {
        .no-grid-icon {
            display: none;
        }

        .grid-icon {
            display: block;
        }
    }
}
</style>
