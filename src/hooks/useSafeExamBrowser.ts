import { useEffect, useState, useCallback, useRef } from 'react';
import { ViolationRecord } from '../types/olympiad';

interface UseSafeExamBrowserOptions {
  enabled: boolean;
  maxViolations: number;
  onAutoSubmit: (violations: ViolationRecord[]) => void;
}

export function useSafeExamBrowser({
  enabled,
  maxViolations,
  onAutoSubmit,
}: UseSafeExamBrowserOptions) {
  const [violations, setViolations] = useState<ViolationRecord[]>([]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSecurityAlert, setShowSecurityAlert] = useState<boolean>(false);
  const [alertReason, setAlertReason] = useState<string>('');
  const [isExamLocked, setIsExamLocked] = useState<boolean>(false);

  // Keep ref to avoid stale closures in event listeners
  const violationsRef = useRef<ViolationRecord[]>(violations);
  violationsRef.current = violations;

  const onAutoSubmitRef = useRef(onAutoSubmit);
  onAutoSubmitRef.current = onAutoSubmit;

  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setIsFullscreen(true);
    } catch {
      // In some embedded iframes requestFullscreen might be restricted, gracefully handle
      setIsFullscreen(false);
    }
  }, []);

  const triggerViolation = useCallback(
    (type: ViolationRecord['type'], details: string) => {
      if (!enabled || isExamLocked) return;

      const newRecord: ViolationRecord = {
        timestamp: Date.now(),
        type,
        details,
      };

      const updated = [...violationsRef.current, newRecord];
      setViolations(updated);
      setAlertReason(details);
      setShowSecurityAlert(true);

      if (updated.length >= maxViolations) {
        setIsExamLocked(true);
        // Delay slightly so the alert renders before submitting
        setTimeout(() => {
          onAutoSubmitRef.current(updated);
        }, 1200);
      }
    },
    [enabled, isExamLocked, maxViolations]
  );

  const dismissAlert = useCallback(() => {
    setShowSecurityAlert(false);
    // Prompt to re-enter fullscreen if lost
    if (enabled && !document.fullscreenElement) {
      enterFullscreen();
    }
  }, [enabled, enterFullscreen]);

  useEffect(() => {
    if (!enabled) return;

    // Check initial fullscreen
    setIsFullscreen(!!document.fullscreenElement);

    // 1. Visibility Change (Tab switch / Minimize)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation(
          'tab_switch',
          'Tab switch detected! You navigated away from the exam tab. This incident has been logged.'
        );
      }
    };

    // 2. Window Blur (User clicked on another window, inspector, or second monitor)
    const handleWindowBlur = () => {
      // Avoid firing redundant blur if hidden already fired
      if (!document.hidden) {
        triggerViolation(
          'window_blur',
          'Window focus lost! Please remain strictly focused on the exam interface.'
        );
      }
    };

    // 3. Fullscreen Change
    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (!active && enabled) {
        triggerViolation(
          'fullscreen_exit',
          'Safe Exam Lockdown requirement breached: Fullscreen mode was exited.'
        );
      }
    };

    // 4. Keyboard Shortcuts Interception
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      // Block devtools, inspect, refresh, print, copy/paste
      if (
        (ctrlOrCmd && ['c', 'v', 'u', 'p', 's', 'w', 't', 'r', 'j', 'i'].includes(key)) ||
        e.key === 'F12' ||
        (ctrlOrCmd && e.shiftKey && ['i', 'j', 'c'].includes(key))
      ) {
        e.preventDefault();
        e.stopPropagation();
        triggerViolation(
          'shortcut_attempt',
          `Restricted keyboard shortcut (${e.key.toUpperCase()}) was blocked by Safe Exam Browser.`
        );
      }
    };

    // 5. Context Menu & Selection Prevention
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
    };
  }, [enabled, triggerViolation]);

  return {
    violations,
    violationCount: violations.length,
    isFullscreen,
    showSecurityAlert,
    alertReason,
    isExamLocked,
    enterFullscreen,
    dismissAlert,
  };
}
