// src/composables/useNavigation.js
import { useRouter } from 'vue-router';

export function useNavigation() {
  const router = useRouter();

  function goBack() {
    router.back();
  }

  function goTo(name, opts = {}) {
    router.push({ name, ...opts });
  }

  return { goBack, goTo };
}
