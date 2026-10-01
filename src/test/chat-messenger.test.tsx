import { describe, it, expect, vi } from 'vitest';
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
