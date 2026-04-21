import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface IDreamFact {
  id: number;
  category: string;
  text: string;
}

@Component({
  selector: 'app-dream-facts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dream-facts.html',
  styleUrl: './dream-facts.css'
})
export class DreamFacts {
  public readonly facts = signal<IDreamFact[]>([
    {
      id: 1,
      category: 'Psychology',
      text: 'Most people have about 4 to 6 dreams a night, but we forget 95-99% of them.'
    },
    {
      id: 2,
      category: 'Science',
      text: 'During REM sleep, your brain is almost as active as when you are awake.'
    },
    {
      id: 3,
      category: 'Visions',
      text: 'Blind people can also dream. Those blind from birth have dreams involving sound, smell, and touch.'
    },
    {
      id: 4,
      category: 'Lucidity',
      text: 'Lucid dreaming can be learned. It is the state of being aware that you are dreaming while it is happening.'
    },
    {
      id: 5,
      category: 'Evolution',
      text: 'Dreams might be an evolutionary mechanism to "rehearse" threatening situations.'
    }
  ]);
}
