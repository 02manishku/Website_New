'use client';

// Heavy-video capability flag. After 4 weeks of mobile-device shake-out
// the gate has been dropped — every device now renders the <video>
// element. Reasons:
//
//   - Safari iOS 17.4+ reports navigator.deviceMemory, and every iPhone
//     XR/XS/11 returns exactly 4 GB. The previous `mem <= 4` rule
//     excluded those phones from every video on the site, which is
//     why users reported the homepage as "frozen" — they were seeing
//     the poster <Image> fallback indefinitely.
//
//   - navigator.hardwareConcurrency is unreliable on iOS Safari for
//     anti-fingerprinting reasons and frequently under-reports cores.
//
//   - The actual decoder pressure has already been mitigated at the
//     architecture level: MAX=1 global video coordinator for
//     Hero / Stacy / Poolside / Page heroes, per-panel observers for
//     WhyStone, preload="metadata" so off-screen videos don't decode,
//     and mobile MP4 variants at 854x480 H.264 main / CRF 27.
//
// Returning a flat `true` keeps every existing call-site working
// without rewrites. If a future device is genuinely too weak, the
// browser will show the poster while the video buffers and we lose
// nothing.

type Capability = { canPlayHeavyVideo: boolean };

export function useDeviceCapability(): Capability {
  return { canPlayHeavyVideo: true };
}
