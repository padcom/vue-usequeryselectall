import { ref, readonly, toValue, watch, isRef, onMounted, onBeforeUnmount, type DeepReadonly, type Ref } from 'vue'
import type { MaybeRefOrGetter, ComputedRef } from 'vue'

export interface QuerySelectAll {
  elements: DeepReadonly<Ref<HTMLElement[]>>
  disconnect: () => void
}

/**
 * Creates a reactive readonly list of HTMLELements that is being kept up to date with the DOM.
 */
// eslint-disable-next-line max-lines-per-function
export function useQuerySelectAll(
  root: MaybeRefOrGetter<HTMLElement | null | undefined> | ComputedRef<HTMLElement | null | undefined>,
  selector: MaybeRefOrGetter<string>,
): QuerySelectAll {
  const elements = ref<HTMLElement[]>([])

  function update() {
    const element = toValue(root)
    if (element) {
      elements.value = Array.prototype.slice.call(
        element.querySelectorAll(toValue(selector)),
      ) as HTMLElement[]
    } else {
      elements.value = []
    }
  }

  const observer = ref<MutationObserver | null>()

  function stop() {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
  }

  function start() {
    const element = toValue(root)
    if (element) {
      observer.value = new MutationObserver(update)
      observer.value.observe(element, { childList: true, attributes: true, subtree: true })
      update()
    }
  }

  function restart() {
    stop()
    start()
  }

  if (isRef(selector)) watch([selector], restart)
  watch([root], restart)
  onMounted(start)
  onBeforeUnmount(stop)

  return {
    elements: readonly(elements),
    disconnect: stop,
  }
}
