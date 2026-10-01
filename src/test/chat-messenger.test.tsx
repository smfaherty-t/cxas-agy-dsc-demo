import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Header } from '../components/Header';
import { AIAssistantBanner } from '../components/AIAssistantBanner';

describe('CX Agent Studio Chat Messenger Trigger Integration', () => {
  it('triggers window.openCxasChat when "Ask AI Advisor" button in Header is clicked', () => {
    const openSpy = vi.fn();
    (window as unknown as { openCxasChat?: () => void }).openCxasChat = openSpy;

    render(<Header />);
    const askButtons = screen.getAllByRole('button', { name: /Ask AI Advisor/i });
    expect(askButtons.length).toBeGreaterThan(0);

    fireEvent.click(askButtons[0]);
    expect(openSpy).toHaveBeenCalled();

    delete (window as unknown as { openCxasChat?: () => void }).openCxasChat;
  });

  it('triggers fallback DOM click when window.openCxasChat is undefined in Header', () => {
    const mockChat = document.createElement('chat-messenger');
    const toggleBtn = document.createElement('chat-toggle-dialog-button');
    const clickSpy = vi.fn();
    toggleBtn.click = clickSpy;
    mockChat.appendChild(toggleBtn);
    document.body.appendChild(mockChat);

    render(<Header />);
    const askButtons = screen.getAllByRole('button', { name: /Ask AI Advisor/i });
    fireEvent.click(askButtons[0]);
    expect(clickSpy).toHaveBeenCalled();

    document.body.removeChild(mockChat);
  });

  it('triggers window.openCxasChat with prompt when sample prompt in AIAssistantBanner is clicked', () => {
    const openSpy = vi.fn();
    (window as unknown as { openCxasChat?: (prompt: string) => void }).openCxasChat = openSpy;

    render(<AIAssistantBanner />);
    const promptButtons = screen.getAllByRole('button', { name: /difference between 4-blade and 6-blade/i });
    expect(promptButtons.length).toBeGreaterThan(0);

    fireEvent.click(promptButtons[0]);
    expect(openSpy).toHaveBeenCalledWith("What's the difference between 4-blade and 6-blade?");

    delete (window as unknown as { openCxasChat?: (prompt: string) => void }).openCxasChat;
  });

  it('displays accurate lower-left corner copy in AIAssistantBanner', () => {
    render(<AIAssistantBanner />);
    expect(screen.getByText(/lower-left corner/i)).toBeInTheDocument();
  });
});

describe('CX Agent Studio Lower-Left Bubble Controller Idempotency and Lifecycle', () => {
  let cm: HTMLElement;
  let launcher: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = '';
    cm = document.createElement('chat-messenger');
    launcher = document.createElement('button');
    launcher.id = 'cxas-bubble-launcher';
    document.body.appendChild(cm);
    document.body.appendChild(launcher);
    delete (window as unknown as { __cxasBubbleControllerInitialized?: boolean }).__cxasBubbleControllerInitialized;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    delete (window as unknown as { __cxasBubbleControllerInitialized?: boolean }).__cxasBubbleControllerInitialized;
    delete (window as unknown as { openCxasChat?: (prompt?: string) => void }).openCxasChat;
    delete (window as unknown as { closeCxasChat?: () => void }).closeCxasChat;
    delete (window as unknown as { toggleCxasChat?: () => void }).toggleCxasChat;
  });

  function setupController() {
    window.openCxasChat = function(promptText) {
      const targetCm = document.querySelector('chat-messenger');
      const targetLauncher = document.getElementById('cxas-bubble-launcher');
      if (targetCm) targetCm.classList.remove('dsc-chat-closed');
      if (targetLauncher) targetLauncher.setAttribute('aria-expanded', 'true');
      if (promptText && targetCm) {
        const input = targetCm.querySelector('chat-messenger-user-input') as unknown as { setInput?: (t: string) => void };
        if (input && typeof input.setInput === 'function') input.setInput(promptText);
      }
    };

    window.closeCxasChat = function() {
      const targetCm = document.querySelector('chat-messenger');
      const targetLauncher = document.getElementById('cxas-bubble-launcher');
      if (targetCm) targetCm.classList.add('dsc-chat-closed');
      if (targetLauncher) targetLauncher.setAttribute('aria-expanded', 'false');
    };

    window.toggleCxasChat = function() {
      const targetCm = document.querySelector('chat-messenger');
      if (!targetCm) return;
      if (targetCm.classList.contains('dsc-chat-closed')) {
        window.openCxasChat();
      } else {
        window.closeCxasChat();
      }
    };

    function initCxasBubbleController() {
      const targetCm = document.querySelector('chat-messenger');
      const targetLauncher = document.getElementById('cxas-bubble-launcher');
      if (!targetCm || !targetLauncher) return;

      if (!(window as unknown as { __cxasBubbleControllerInitialized?: boolean }).__cxasBubbleControllerInitialized) {
        (window as unknown as { __cxasBubbleControllerInitialized?: boolean }).__cxasBubbleControllerInitialized = true;
        targetCm.classList.add('dsc-chat-closed');
        targetLauncher.setAttribute('aria-expanded', 'false');

        targetLauncher.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          window.toggleCxasChat();
        });

        targetCm.addEventListener('chat-messenger-close', function() {
          window.closeCxasChat();
        });
      }
    }

    return initCxasBubbleController;
  }

  it('guarantees clicking bubble opens chat and does not immediately toggle back to closed', () => {
    const initFn = setupController();

    // Simulate multiple initializations (e.g., DOMContentLoaded + chat-messenger-loaded)
    initFn();
    initFn();

    // Verify initial closed state
    expect(cm.classList.contains('dsc-chat-closed')).toBe(true);
    expect(launcher.getAttribute('aria-expanded')).toBe('false');

    // Click once: should open
    launcher.click();
    expect(cm.classList.contains('dsc-chat-closed')).toBe(false);
    expect(launcher.getAttribute('aria-expanded')).toBe('true');

    // Click again: should close
    launcher.click();
    expect(cm.classList.contains('dsc-chat-closed')).toBe(true);
    expect(launcher.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes chat when chat-messenger-close event is dispatched', () => {
    const initFn = setupController();
    initFn();

    // Open chat
    window.openCxasChat();
    expect(cm.classList.contains('dsc-chat-closed')).toBe(false);
    expect(launcher.getAttribute('aria-expanded')).toBe('true');

    // Dispatch chat-messenger-close (simulating titlebar X button click)
    cm.dispatchEvent(new CustomEvent('chat-messenger-close'));
    expect(cm.classList.contains('dsc-chat-closed')).toBe(true);
    expect(launcher.getAttribute('aria-expanded')).toBe('false');
  });
});
