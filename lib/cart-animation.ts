export async function animateCartAddition(
  source: HTMLElement,
  commit: () => Promise<void>,
  options: {
    dotClass?: string;
    dotViewTransitionName?: string;
    targetId?: string;
    reverse?: boolean;
  } = {},
) {
  const {
    dotClass = "cart-animation-dot",
    dotViewTransitionName = "cart-dot",
    targetId = "cart-animation-target",
    reverse = false,
  } = options;
  const dot = document.createElement("span");
  dot.className = dotClass;
  dot.style.viewTransitionName = dotViewTransitionName;

  const target = document.getElementById(targetId);
  if (!target || typeof document.startViewTransition !== "function") {
    await commit();
    return;
  }

  (reverse ? target : source).append(dot);

  const moveTransition = document.startViewTransition(() => {
    (reverse ? source : target).append(dot);
  });
  await moveTransition.finished;
  dot.remove();

  const counterTransition = document.startViewTransition(commit);
  await counterTransition.finished;
}
