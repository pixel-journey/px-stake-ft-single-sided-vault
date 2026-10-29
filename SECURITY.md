# Security notes

| Issue | Lab mitigation |
|-------|----------------|
| Share inflation on deposit | floor mint |
| Drain via floor withdraw | ceil burn cost |
| Empty vault desync | refused |
| Zero / oversized amounts | refused |

Production still needs token `on_notify`, custody accounting, and donation/inflation attack review (first-depositor and virtual-offset patterns).
