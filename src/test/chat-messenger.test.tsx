import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Header } from '../components/Header';
import { AIAssistantBanner } from '../components/AIAssistantBanner';

describe('CX Agent Studio Chat Messenger Trigger Integration', () => {
  it('triggers chat messenger open when "Ask AI Advisor" button in Header is clicked', () => {
    const mockChat = document.createElement('chat-messenger');
    const toggleBtn = document.createElement('chat-toggle-dialog-button');
    const clickSpy = vi.fn();
    toggleBtn.click = clickSpy;
    mockChat.appendChild(toggleBtn);
    document.body.appendChild(mockChat);

    render(<Header />);
    const askButtons = screen.getAllByRole('button', { name: /Ask AI Advisor/i });
    expect(askButtons.length).toBeGreaterThan(0);

    fireEvent.click(askButtons[0]);
    expect(clickSpy).toHaveBeenCalled();

    document.body.removeChild(mockChat);
  });

  it('triggers chat messenger open when sample prompts in AIAssistantBanner are clicked', () => {
    const mockChat = document.createElement('chat-messenger');
    const toggleBtn = document.createElement('chat-toggle-dialog-button');
    const clickSpy = vi.fn();
    toggleBtn.click = clickSpy;
    mockChat.appendChild(toggleBtn);
    document.body.appendChild(mockChat);

    render(<AIAssistantBanner />);
    const promptButtons = screen.getAllByRole('button', { name: /difference between 4-blade and 6-blade/i });
    expect(promptButtons.length).toBeGreaterThan(0);

    fireEvent.click(promptButtons[0]);
    expect(clickSpy).toHaveBeenCalled();

    document.body.removeChild(mockChat);
  });
});
