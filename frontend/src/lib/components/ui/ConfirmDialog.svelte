<script lang="ts">
  import Modal from './Modal.svelte';
  import Button from './Button.svelte';

  interface Props {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning';
    onconfirm: () => void;
    oncancel: () => void;
  }

  let {
    open,
    title = 'Confirm',
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    variant = 'danger',
    onconfirm,
    oncancel
  }: Props = $props();
</script>

<Modal {open} {title} onclose={oncancel}>
  <p class="text-neutral-300">{message}</p>

  {#snippet footer()}
    <Button variant="ghost" onclick={oncancel}>
      {cancelText}
    </Button>
    <Button variant={variant === 'danger' ? 'danger' : 'primary'} onclick={onconfirm}>
      {confirmText}
    </Button>
  {/snippet}
</Modal>
