import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from '../App';

describe('Dollar Shave Club App', () => {
  beforeEach(() => {
    // Mock querySelector for chat-messenger custom element
    const mockChatMessenger = document.createElement('chat-messenger');
    const mockToggleBtn = document.createElement('chat-toggle-dialog-button');
    mockChatMessenger.appendChild(mockToggleBtn);
    document.body.appendChild(mockChatMessenger);
  });

  it('renders the branding and navigation elements', () => {
    render(<App />);
    expect(screen.getAllByText(/DOLLAR SHAVE CLUB/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Starter Set/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/FAQ/i).length).toBeGreaterThan(0);
  });

  it('renders the hero section with $5 starter kit offer', () => {
    render(<App />);
    expect(screen.getByText(/THE ALL-IN-ONE STARTER SET/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Get Started for \$5/i).length).toBeGreaterThan(0);
  });

  it('renders the Google CX Agent Studio AI Assistant banner', () => {
    render(<App />);
    expect(screen.getByText(/Meet Your 24\/7 Personal Grooming Advisor/i)).toBeInTheDocument();
    expect(screen.getByText(/POWERED BY GOOGLE CX AGENT STUDIO/i)).toBeInTheDocument();
  });

  it('filters product catalogue by category when clicked', () => {
    render(<App />);
    // Initial view shows all products including blades and shave butter
    expect(screen.getByRole('heading', { name: /6-Blade Razor Cartridge Refills/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Translucent Shave Butter/i })).toBeInTheDocument();

    // Click 'blades' filter
    const bladesBtn = screen.getByRole('button', { name: /^blades$/i });
    fireEvent.click(bladesBtn);

    expect(screen.getByRole('heading', { name: /6-Blade Razor Cartridge Refills/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Translucent Shave Butter/i })).not.toBeInTheDocument();
  });

  it('expands FAQ item on click', () => {
    render(<App />);
    const faqQuestion = screen.getByText(/What is included in the \$5 Starter Set\?/i);
    expect(faqQuestion).toBeInTheDocument();

    // The first item is open by default
    expect(screen.getByText(/Your Starter Set comes with our weighty diamond-grip metal handle/i)).toBeInTheDocument();

    // Click another question
    const secondQuestion = screen.getByText(/Can I cancel, pause, or change my frequency anytime\?/i);
    fireEvent.click(secondQuestion);
    expect(screen.getByText(/Zero long-term commitments or hidden cancellation fees/i)).toBeInTheDocument();
  });
});
